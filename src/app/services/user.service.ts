import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { User } from '../shared/services/user';


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

  getUser(id: string): AngularFirestoreDocument<User> {
    return this.usersRef.doc(id);
  }




}
