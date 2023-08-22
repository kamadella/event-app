import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  category: Category = new Category();
  categories!: Category[];
  submitted = false;

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.retrieveCategories();
  }

  saveCategory(): void {
    this.categoryService.create(this.category).then(() => {
      console.log('Created new item successfully!');
      this.submitted = true;
    });
  }

  newCategory(): void {
    this.submitted = false;
    this.category = new Category();
  }

  retrieveCategories(): void {
    this.categoryService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.categories = data;
      // Sortowanie kategorii alfabetycznie
      this.categories.sort((a, b) => {
        if (a.name && b.name) {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
    });
  }



  deleteCategory(currentCategory: Category): void {
    if (confirm('Czy na pewno chcesz usunąć? ')) {
      if (currentCategory.id) {
        this.categoryService
          .delete(currentCategory.id)
          .then(() => {
            //this.refreshList.emit();
          })
          .catch((err) => console.log(err));
      }
    }
  }

}
