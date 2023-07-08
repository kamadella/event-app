import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private dbPath = '/events';
  eventsRef: AngularFirestoreCollection<Event>;

  constructor(private db: AngularFirestore) {
    this.eventsRef = db.collection(this.dbPath);
   }

  getAll(): AngularFirestoreCollection<Event> {
    return this.eventsRef;
  }

  create(event: Event): any {
    return this.eventsRef.add({ ...event });
  }

  update(id: string, data: any): Promise<void> {
    return this.eventsRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.eventsRef.doc(id).delete();
  }

  getOne(id: string): AngularFirestoreDocument<Event> {
    return this.eventsRef.doc(id);
  }
}
