import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { map } from 'rxjs/operators';
import { Comment } from 'src/app/models/comment.model';
import { User } from '../../shared/services/user';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.css']
})
export class CommentsListComponent implements OnInit {
  @Input() eventId?: string;
  comments?: Comment[];
  users: { [userId: string]: User } = {}; // Obiekt do przechowywania danych użytkowników


  constructor(private commentService: CommentService, private userService: UserService) { }

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
      this.comments = data.filter(comment => comment.eventId === this.eventId);
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
    console.log( this.users);
  }

  getUserName(userId: string): string {
    // Pobierz nazwę użytkownika na podstawie jego identyfikatora
    const user = this.users[userId];
    return user ? user.displayName : 'Nieznany użytkownik';
  }

}
