import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/compat/firestore';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private dbPath = '/categories';
  categoriesRef: AngularFirestoreCollection<Category>;

  constructor(private db: AngularFirestore) {
    this.categoriesRef = db.collection(this.dbPath);
  }

  getAll(): AngularFirestoreCollection<Category> {
    return this.db.collection(this.dbPath, (ref) => ref.orderBy('name'));
    //return this.categoriesRef;
  }

  create(category: Category): any {
    return this.categoriesRef.add({ ...category });
  }

  getOne(id: string): AngularFirestoreDocument<Category> {
    return this.categoriesRef.doc(id);
  }

  delete(id: string): Promise<void> {
    return this.categoriesRef.doc(id).delete();
  }

}
