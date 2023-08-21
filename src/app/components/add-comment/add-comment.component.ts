import { Component, OnInit, Input } from '@angular/core';
import { Comment } from 'src/app/models/comment.model';
import { CommentService } from 'src/app/services/comment.service';
import { AuthService } from '../../shared/services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AddCommentDialogComponent } from './add-comment-dialog/add-comment-dialog.component';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css'],
})
export class AddCommentComponent implements OnInit {
  @Input() eventId?: string;

  comment: Comment = new Comment();

  constructor(
    private commentService: CommentService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

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
    console.log(new Date());

    // Sprawdź czy komentarz nie jest samymi spacjami i entrami oraz czy nie przekracza limitu znaków
    if (
      this.comment.text &&
      this.comment.text.trim() !== '' &&
      this.comment.text.length <= 500
    ) {
      this.commentService.create(this.comment).then(() => {
        console.log('Created new comment successfully!');
      });
    } else {
      console.log('Invalid comment');
    }

    this.comment = new Comment();
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddCommentDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
