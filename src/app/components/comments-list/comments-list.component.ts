import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { map } from 'rxjs/operators';
import { Comment } from 'src/app/models/comment.model';
import { User } from '../../shared/services/user';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from '../../shared/services/auth.service';


@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.css']
})
export class CommentsListComponent implements OnInit {
  @Input() eventId?: string;
  comments?: Comment[];
  users: { [userId: string]: User } = {}; // Obiekt do przechowywania danych użytkowników


  constructor(private commentService: CommentService, private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    this.retrieveComments();
  }



  retrieveComments(): void {
    this.commentService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.comments = data
      .filter(comment => comment.eventId === this.eventId)
      .sort((a, b) => {
        const timestampA = a.date;
        const timestampB = b.date;
        if (timestampA && timestampB) {
          return timestampA < timestampB ? -1 : (timestampA > timestampB ? 1 : 0);
        }
        return 0;
      });

      this.loadUsers(); // Wczytaj dane użytkowników po pobraniu komentarzy
    });
  }

  loadUsers(): void {
    // Pobierz dane użytkowników i zapisz je w obiekcie users
    this.userService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      data.forEach(user => {
        this.users[user.id] = user;

      });
    });
  }

  getUserName(userId: string): string {
    // Pobierz nazwę użytkownika na podstawie jego identyfikatora
    const user = this.users[userId];
    return user ? user.displayName : 'Nieznany użytkownik';
  }

  deleteComment(currentComment: Comment): void {
    if (confirm('Czy na pewno chcesz usunąć? ')) {
      if (currentComment.id) {
        this.commentService
          .delete(currentComment.id)
          .then(() => {
            //this.refreshList.emit();
          })
          .catch((err) => console.log(err));
      }
    }
  }

  isAdmin() {
    return this.authService.isAdmin;
  }

  formatTimestamp(timestamp: any): string {
    const date = timestamp.toDate(); // Convert Firebase Timestamp to JavaScript Date
    return date.toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }


}
