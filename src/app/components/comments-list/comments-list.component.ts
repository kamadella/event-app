import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { map } from 'rxjs/operators';
import { Comment } from 'src/app/models/comment.model';
import { User } from '../../shared/services/user';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.css'],
})
export class CommentsListComponent implements OnInit {
  eventId?: string;
  comments?: Comment[];
  users: { [userId: string]: User } = {}; // Obiekt do przechowywania danych użytkowników

  constructor(
    private commentService: CommentService,
    private dialog: MatDialog,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => (this.eventId = params['id']));
    this.retrieveCommentsByEvents();
  }

  retrieveCommentsByEvents(): void {
    this.commentService
      .getCommentsByEvent(this.eventId!)
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
          }))
        )
      )
      .subscribe((data) => {
        this.comments = data;
        this.loadUsers();
      });
  }

  loadUsers(): void {
    // Pobierz dane użytkowników i zapisz je w obiekcie users
    this.userService
      .getAll()
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
          }))
        )
      )
      .subscribe((data) => {
        data.forEach((user) => {
          this.users[user.id] = user;
        });
      });
  }

  getUserName(userId: string): string {
    // Pobierz nazwę użytkownika na podstawie jego identyfikatora
    const user = this.users[userId];
    return user ? user.displayName : 'Nieznany użytkownik';
  }

  getPhotoURL(userId: string): string {
    // Pobierz nazwę użytkownika na podstawie jego identyfikatora
    const user = this.users[userId];
    return user
      ? user.photoURL
      : 'https://firebasestorage.googleapis.com/v0/b/event-app-4eaf2.appspot.com/o/userProfileImages%2Fdefault_img.jpg?alt=media&token=fc0e9ead-7c55-4121-9790-8e4823a0aa10';
  }

  deleteComment(currentComment: Comment): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: 'Czy na pewno chcesz usunąć?',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Użytkownik kliknął "OK" w potwierdzeniu
        if (currentComment.id) {
          this.commentService
            .delete(currentComment.id)
            .catch((err) => console.log(err));
        }
      } else {
        console.log('Cancelled category delete.');
      }
    });
  }

  isAdmin() {
    return this.authService.isAdmin;
  }

  formatTimestamp(timestamp: any): string {
    const date = timestamp.toDate(); // Convert Firebase Timestamp to JavaScript Date
    return date.toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
