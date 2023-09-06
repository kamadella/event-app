import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/compat/firestore';
import { Ticket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private dbPath = '/tickets';
  ticketsRef: AngularFirestoreCollection<Ticket>;

  constructor(private db: AngularFirestore) {
    this.ticketsRef = db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<Ticket> {
    return this.ticketsRef;
  }

  create(ticket: Ticket): any {
    return this.ticketsRef.add({ ...ticket });
  }

  getOne(id: string): AngularFirestoreDocument<Ticket> {
    return this.ticketsRef.doc(id);
  }

  delete(id: string): Promise<void> {
    return this.ticketsRef.doc(id).delete();
  }

  getTicketsByUser(userId: string): AngularFirestoreCollection<Ticket> {
    return this.db.collection(this.dbPath, (ref) => ref.where('userId', '==', userId));
  }
}
