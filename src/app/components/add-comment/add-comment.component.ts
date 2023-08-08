import { Component, OnInit, Input } from '@angular/core';
import { Comment } from 'src/app/models/comment.model';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent implements OnInit {
  @Input() eventId?: string;

  comment: Comment = new Comment();

  constructor(private commentService: CommentService) { }

  ngOnInit(): void {
  }


  saveComment(): void {
    this.comment.eventId = this.eventId;
    this.commentService.create(this.comment).then(() => {
      console.log('Created new comment successfully!');
    });

    this.comment = new Comment();
  }

}
