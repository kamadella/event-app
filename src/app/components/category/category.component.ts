import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { EventService } from 'src/app/services/event.service';
import { map } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
    // Nazwa kategorii nie jest unikalna, obsłuż odpowiednio
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
        // Użytkownik kliknął "OK" w potwierdzeniu
        if (currentCategory.id) {
          // Pobierz wydarzenia przypisane do kategorii
          const eventsCollection = this.eventService.getEventsByCategory(currentCategory.id);

          eventsCollection.get().subscribe((result) => {
            if (result.size === 0) {
              // Brak przypisanych wydarzeń, możesz usunąć kategorię
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
        // Użytkownik kliknął "Anuluj" lub zamknął dialog
        console.log('Cancelled category delete.');
      }
    });
  }
}
