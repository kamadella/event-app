import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from 'src/app/services/comment.service';
import { map } from 'rxjs/operators';
import { Comment } from 'src/app/models/comment.model';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.css']
})
export class CommentsListComponent implements OnInit {
  @Input() eventId?: string;
  comments?: Comment[];


  constructor(private commentService: CommentService) { }

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
    });
  }

}
