import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private dbPath = '/comments';
  commentsRef: AngularFirestoreCollection<Comment>;

  constructor(private db: AngularFirestore) {
    this.commentsRef = db.collection(this.dbPath);
   }

  getAll(): AngularFirestoreCollection<Comment> {
    return this.commentsRef;
  }

  create(comment: Comment): any {
    return this.commentsRef.add({ ...comment });
  }

  update(id: string, data: any): Promise<void> {
    return this.commentsRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.commentsRef.doc(id).delete();
  }

  getCommentsByEvent(eventId: string): AngularFirestoreCollection<Comment> {
    return this.db.collection(this.dbPath, (ref) => ref.where('eventId', '==', eventId));
  }
}
