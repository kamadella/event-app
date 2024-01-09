import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { EventService } from 'src/app/services/event.service';
import { map } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EditCategoryDialogComponent } from './edit-category-dialog/edit-category-dialog.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  category: Category = new Category();
  categories?: Category[];
  submitted: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private eventService: EventService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.retrieveCategories();
  }

  saveCategory(): void {
    const categoryNameLowerCase = this.category.name?.toLowerCase();
    const isNameUnique = !this.categories?.some(c => c.name?.toLowerCase() === categoryNameLowerCase);

    if (isNameUnique) {
      this.categoryService.create(this.category).then(() => {
        this.submitted = true;
      });
    } else {
      this.dialog.open(AlertDialogComponent, {
        width: '400px',
        data: 'Nazwa kategorii nie jest unikalna.',
      });
    }
  }

  newCategory(): void {
    this.submitted = false;
    this.category = new Category();
  }

  retrieveCategories(): void {
    this.categoryService
      .getAll()
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
          }))
        )
      )
      .subscribe((data) => {
        this.categories = data;
      });
  }

  deleteCategory(currentCategory: Category): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Czy na pewno chcesz usunąć?',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (currentCategory.id) {
          const eventsCollection = this.eventService.getEventsByCategory(currentCategory.id);

          eventsCollection.get().subscribe((result) => {
            if (result.size === 0) {
              if (currentCategory.id) {
                this.categoryService
                  .delete(currentCategory.id)
                  .catch((err) => console.log(err));
                }
            } else {
              this.dialog.open(AlertDialogComponent, {
                width: '400px',
                data: 'Nie można usunąć kategorii, istnieją przypisane do niej wydarzenia.',
              });
            }
          });
        }
      } else {
        console.log('Cancelled category delete.');
      }
    });
  }

  openEditCategoryDialog(category: Category): void {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      width: '400px',
      data: category.name,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const data = {
          name: result,
        };

        if (category.id) {
          this.categoryService.update(category.id, data)
            .catch(err => console.log(err));
        }
      }
    });
  }
}
