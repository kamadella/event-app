import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { User } from '../shared/services/user';
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private dbPath = '/users';
  usersRef: AngularFirestoreCollection<User>;

  constructor(private db: AngularFirestore) {
    this.usersRef = db.collection(this.dbPath);
   }

  getAll(): AngularFirestoreCollection<User> {
    return this.usersRef;
  }

  getOne(id: string): AngularFirestoreDocument<User> {
    return this.usersRef.doc(id);
  }

  getUsersByLikedEvents(eventId: string): AngularFirestoreCollection<User> {
    return this.db.collection(this.dbPath, (ref) => ref.where('likedEvents', 'array-contains', eventId));
  }

  removeLikedEventFromUser(userId: string, eventId: string): Promise<void> {
    return this.usersRef.doc(userId).update({
      likedEvents: arrayRemove(eventId) as unknown as string[]
    });
  }
}
