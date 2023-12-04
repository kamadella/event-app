import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { map } from 'rxjs/operators';
import { Event } from 'src/app/models/event.model';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { AuthService } from '../../shared/services/auth.service';
import { Location } from '@angular/common';
import { TicketComponent } from '../ticket/ticket.component';
import { LoginDialogComponent } from '../dialogs/login-dialog/login-dialog.component';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component';
import { CommentService } from 'src/app/services/comment.service';
import { ChangeDetectorRef } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css'],
})
export class EventPageComponent implements OnInit {
  eventId: string = '-1';
  categoryId: string = '-1';
  currentEvent: Event = {
    name: '',
    description: '',
    place_name: '',
    organizator: '',
    img: '',
    date_start: new Date(),
    date_end: new Date(),
    category: '',
    tickets: 0,
  };
  currentCategory: Category = {
    name: '',
  };
  mapVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private categoryService: CategoryService,
    private commentService: CommentService,
    private authService: AuthService,
    private userService: UserService,
    private location: Location,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => (this.eventId = params['id']));
    this.getCurrentEvent(this.eventId);
  }

  getCurrentCategory(id: string): void {
    this.categoryService
      .getOne(id)
      .snapshotChanges()
      .pipe(
        map((c) => {
          const categoryData = c.payload.data() as Category;
          const categoryId = c.payload.id;
          return { id: categoryId, ...categoryData };
        })
      )
      .subscribe((data) => {
        this.currentCategory = data;
      });
  }

  canActivateEvent(): boolean {
    // Sprawdź, czy użytkownik jest administratorem
    const isAdmin = this.authService.isAdmin;

    // Sprawdź, czy wydarzenie ma właściwość 'published' ustawioną na true
    const isEventPublished = this.currentEvent.published === true;

    // Zwróć true, jeśli użytkownik jest administratorem lub wydarzenie jest opublikowane
    // W przeciwnym przypadku zwróć false
    return isAdmin || isEventPublished;
  }

  getCurrentEvent(id: string): void {
    this.mapVisible = false; // Ustawia mapVisible na false przy zmianie wydarzenia
    this.eventService
      .getOne(id)
      .snapshotChanges()
      .pipe(
        map((c) => {
          const eventData = c.payload.data() as Event;
          const eventId = c.payload.id;
          return { id: eventId, ...eventData };
        })
      )
      .subscribe((data) => {
        this.currentEvent = data;
        this.getCurrentCategory(this.currentEvent.category!);
        this.cdr.detectChanges(); // Ręczne wywołanie detekcji zmian
      });
  }

  deleteEvent(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px', // Dostosuj szerokość do swoich potrzeb
      data: 'Czy na pewno chcesz usunąć?',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Użytkownik kliknął "OK" w potwierdzeniu
        if (this.currentEvent.id) {
          // Wywołanie funkcji deleteEventWithImage
          if (this.currentEvent.tickets !== this.currentEvent.ticketsLeft) {
            this.dialog.open(AlertDialogComponent, {
              width: '400px',
              data: 'Nie można usunąć wydarzenia, istnieją przypisane do niego bilety',
            });
          } else {
            //znajdz wszystkie komentarze pod wydarzeniem i je usuń
            this.commentService
              .getCommentsByEvent(this.currentEvent.id)
              .snapshotChanges()
              .subscribe((changes) => {
                const commentsToDelete = changes.map((c) => ({
                  id: c.payload.doc.id,
                  ...c.payload.doc.data(),
                }));

                if (commentsToDelete.length > 0) {
                  // Usuń wszystkie te komentarze
                  commentsToDelete.forEach((comment) =>
                    this.commentService.delete(comment.id)
                  );
                }
              });

              this.userService
              .getUsersByLikedEvents(this.currentEvent.id)
              .snapshotChanges()
              .subscribe((changes) => {
                const usersWithEventToDelete = changes.map((c) => ({
                  id: c.payload.doc.id,
                  ...c.payload.doc.data(),
                }));
                if (usersWithEventToDelete.length > 0) {
                  // Usuń wszystkie te komentarze
                  usersWithEventToDelete.forEach((user) =>
                  this.userService
                  .removeLikedEventFromUser(user.uid, this.currentEvent.id!)
                  .catch((err) => console.log(err))
                  );
                }
              });


            //usuń wydarznie
            this.eventService
              .deleteEventWithImage(this.currentEvent.id)
              .then(() => {
                console.log('Usunięto wydarzenie i obrazek');
                // Przekierowanie lub inne akcje po usunięciu
                this.location.back(); // Wróć na poprzednią kartę
              })
              .catch((err) => console.log(err));
          }
        }
      } else {
        // Użytkownik kliknął "Anuluj" lub zamknął dialog
        console.log('Cancelled event delete.');
      }
    });
  }

  publishEvent(status: boolean): void {
    let messege = '';
    if (status === true) {
      messege = 'Czy na pewno chcesz opublikowac to wydarzenie? ';
    } else {
      messege = 'Czy na pewno chcesz unulowac publikację tego wydarzenia? ';
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: messege,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Użytkownik kliknął "OK" w potwierdzeniu
        if (this.currentEvent.id) {
          this.eventService
            .update(this.currentEvent.id, { published: status })
            .then(() => {
              this.currentEvent.published = status;
            })
            .catch((err) => console.log(err));
        }
      } else {
        // Użytkownik kliknął "Anuluj" lub zamknął dialog
        console.log('Cancelled event publish.');
      }
    });
  }

  isAdmin() {
    return this.authService.isAdmin;
  }

  ticketReservationDialog(e: Event) {
    this.dialog.open(TicketComponent, {
      data: e,
      width: '550px'
     });
  }

  isActual(): boolean {
    const currentDate = new Date();
    return this.currentEvent.date_end
      ? new Date(this.currentEvent.date_end) > currentDate
      : false;
  }

  isLoggedIn() {
    return this.authService.isLoggedIn;
  }

  openLoginDialog() {
    this.dialog.open(LoginDialogComponent, {
      width: '500px',
    });
  }

  openMap(): void {
    this.mapVisible = true;
  }

  isEventLiked(): boolean {
    // Replace this logic with your actual implementation
    return this.authService.isEventLiked(this.currentEvent.id!);
  }

  updateLikedEventsList(action: boolean): void {
    if (this.currentEvent.id) {
      if (!action) {
        console.log("addLikedEvent");
        this.authService.addLikedEvent(this.currentEvent.id);
      }
      if (action) {
        console.log("removeLikedEvent");
        this.authService.removeLikedEvent(this.currentEvent.id);
      }
    }
  }
}
