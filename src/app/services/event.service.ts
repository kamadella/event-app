import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private dbPath = '/events';
  eventsRef: AngularFirestoreCollection<Event>;

  constructor(private db: AngularFirestore, private storage: AngularFireStorage) {
    this.eventsRef = db.collection(this.dbPath);
   }

  getAll(): AngularFirestoreCollection<Event> {
    return this.eventsRef;
  }

  async create(event: Event, imageFile: File): Promise<any> {
    const eventDocRef = this.eventsRef.add({ ...event });

    if (imageFile) {
      const eventId = (await eventDocRef).id;

      const storageRef = this.storage.ref(`eventImages/${eventId}`);
      const uploadTask = this.storage.upload(`eventImages/${eventId}`, imageFile);

      await uploadTask.task;

      const downloadURL = await storageRef.getDownloadURL().toPromise();

      this.eventsRef.doc(eventId).update({ img: downloadURL });
    }

    return eventDocRef;
  }


  update(id: string, data: any): Promise<void> {
    return this.eventsRef.doc(id).update(data);
  }


  async updateIMG(id: string, data: any, imageFile: File | null): Promise<void> {
    const eventRef = this.eventsRef.doc(id);

    if (imageFile) {
      // Wysyłanie nowego obrazka
      const storageRef = this.storage.ref(`eventImages/${id}`);
      const uploadTask = this.storage.upload(`eventImages/${id}`, imageFile);
      await uploadTask.task;

      const downloadURL = await storageRef.getDownloadURL().toPromise();

      data.img = downloadURL;
    }

    // Aktualizacja pozostałych danych wydarzenia
    await eventRef.update(data);
  }

  delete(id: string): Promise<void> {
    return this.eventsRef.doc(id).delete();
  }

  getOne(id: string): AngularFirestoreDocument<Event> {
    return this.eventsRef.doc(id);
  }

  private uploadImage(eventId: string, imageFile: File): void {
    const storageRef = this.storage.ref(`eventImages/${eventId}`);
    storageRef.put(imageFile).then(snapshot => {
      console.log('Obrazek został przesłany do Firebase Storage.');
    });
  }

  getImageURL(eventId: string): Promise<string> {
    const storageRef = this.storage.ref(`eventImages/${eventId}`);
    return storageRef.getDownloadURL().toPromise();
  }

  private deleteImage(imagePath: string): Promise<void> {
    const storageRef = this.storage.ref(imagePath);
    return storageRef.delete().toPromise();
  }

  deleteEventWithImage(eventId: string): Promise<void> {
    const imagePath = `eventImages/${eventId}`;
    // Usuń wydarzenie z bazą danych
    const eventDeletePromise = this.delete(eventId);

    // Usuń również obrazek z Firebase Storage
    const imageDeletePromise = this.deleteImage(imagePath);

    // Połącz obie obietnice w jedną i zwróć ją
    return Promise.all([eventDeletePromise, imageDeletePromise]).then(() => {
      console.log('Usunięto wydarzenie i obrazek');
    });
  }


}
