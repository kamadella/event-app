import { Component, Input } from '@angular/core';
import { Comment } from 'src/app/models/comment.model';
import { CommentService } from 'src/app/services/comment.service';
import { AuthService } from '../../shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css'],
})
export class AddCommentComponent  {
  @Input() eventId?: string;
  comment: Comment = new Comment();
  invalidComment: boolean = false;

  constructor(
    private commentService: CommentService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}


  isLoggedIn() {
    return this.authService.isLoggedIn;
  }

  saveComment(): void {
    this.comment.eventId = this.eventId;

    // Pobierz identyfikator użytkownika
    const userId = this.authService.getUserId();

    // Przypisz identyfikator użytkownika do komentarza
    this.comment.userId = userId;

    this.comment.date = new Date();

    // Sprawdź czy komentarz nie jest samymi spacjami i entrami oraz czy nie przekracza limitu znaków
    if (
      this.comment.text &&
      this.comment.text.trim() !== '' &&
      this.comment.text.length <= 500
    ) {
      this.commentService.create(this.comment);
    } else {
      this.invalidComment = true;
    }

    this.comment = new Comment();
  }

  openLoginDialog() {
    this.dialog.open(LoginDialogComponent);
  }
}
