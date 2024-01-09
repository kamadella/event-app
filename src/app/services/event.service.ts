import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private dbPath = '/events';
  eventsRef: AngularFirestoreCollection<Event>;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.eventsRef = db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<Event> {
    return this.eventsRef;
  }

  getEventsToPublish(): AngularFirestoreCollection<Event> {
    return this.db.collection(this.dbPath, (ref) =>
      ref.where('published', '==', false).orderBy('createdAt')
    );
  }

  getFilteredEvents(
    archiveMode: boolean = false
  ): AngularFirestoreCollection<Event> {
    const currentDate = new Date();
    const dateComparison = archiveMode ? '<' : '>';

    return this.db.collection(
      this.dbPath,
      (ref) =>
        ref
          .where('published', '==', true)
          .where('date_end', dateComparison, currentDate.toISOString())
    );
  }

  async create(event: Event, imageFile: File): Promise<any> {
    const eventDocRef = this.eventsRef.add({ ...event });

    if (imageFile) {
      const eventId = (await eventDocRef).id;

      const storageRef = this.storage.ref(`eventImages/${eventId}`);
      const uploadTask = this.storage.upload(
        `eventImages/${eventId}`,
        imageFile
      );

      await uploadTask.task;

      const downloadURL = await storageRef.getDownloadURL().toPromise();

      this.eventsRef.doc(eventId).update({ img: downloadURL });
    }

    return eventDocRef;
  }

  update(id: string, data: any): Promise<void> {
    return this.eventsRef.doc(id).update(data);
  }

  async updateIMG(
    id: string,
    data: any,
    imageFile: File | null
  ): Promise<void> {
    const eventRef = this.eventsRef.doc(id);

    if (imageFile) {
      // send new image
      const storageRef = this.storage.ref(`eventImages/${id}`);
      const uploadTask = this.storage.upload(`eventImages/${id}`, imageFile);
      await uploadTask.task;

      const downloadURL = await storageRef.getDownloadURL().toPromise();

      data.img = downloadURL;
    }

    await eventRef.update(data);
  }

  delete(id: string): Promise<void> {
    return this.eventsRef.doc(id).delete();
  }

  getOne(id: string): AngularFirestoreDocument<Event> {
    return this.eventsRef.doc(id);
  }

  private deleteImage(imagePath: string): Promise<void> {
    const storageRef = this.storage.ref(imagePath);
    return storageRef.delete().toPromise();
  }

  deleteEventWithImage(eventId: string): Promise<void> {
    const imagePath = `eventImages/${eventId}`;
    const eventDeletePromise = this.delete(eventId);
    const imageDeletePromise = this.deleteImage(imagePath);

    return Promise.all([eventDeletePromise, imageDeletePromise]).then(() => {
      console.log('Usunięto wydarzenie i obrazek');
    });
  }

  getEventsByCategory(categoryId: string): AngularFirestoreCollection<Event> {
    return this.db.collection(this.dbPath, (ref) =>
      ref.where('category', '==', categoryId)
    );
  }
}
