import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { TicketService } from 'src/app/services/ticket.service';
import { map } from 'rxjs/operators';
import { Ticket } from 'src/app/models/ticket.model';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/models/event.model';
import { MatDialog } from '@angular/material/dialog';
import { DisplayNameDialogComponent } from './display-name-dialog/display-name-dialog.component';
import { ProfileIMGDialogComponent } from './profile-img-dialog/profile-img-dialog.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  displayName: string = '';
  tickets: Ticket[] = [];
  showed: boolean = false;
  expiredTickets: Ticket[] = [];
  isTicketValidityChecked: boolean = false; // zmienna flagowa
  selectedProfileImage: File | null = null;
  invalidDisplayName: boolean = false;

  constructor(
    public authService: AuthService,
    private ticketService: TicketService,
    private eventService: EventService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.displayName = '';
    this.retrieveTickets();
  }

  updateDisplayName() {
    const newDisplayName = this.displayName; // Pobieramy nową nazwę użytkownika
    if (newDisplayName.trim() !== '' && newDisplayName.length < 20) {
      this.authService.updateDisplayName(newDisplayName);
    } else {
      this.invalidDisplayName = true;
    }
  }

  retrieveTickets(): void {
    // Pobierz identyfikator użytkownika
    const userId = this.authService.getUserId();
    this.ticketService
      .getTicketsByUser(userId)
      .snapshotChanges()
      .subscribe((changes) => {
        this.tickets = changes.map((c) => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data(),
        }));
        // Sprawdź aktualność biletów tylko jeśli jeszcze nie sprawdzono
        if (!this.isTicketValidityChecked) {
          this.checkTicketValidity();
          this.isTicketValidityChecked = true; // Oznacz, że sprawdzono aktualność biletów
        }
      });
  }

  showTickets(): void {
    this.showed = !this.showed;
  }

  checkTicketValidity(): void {
    if (this.tickets && this.tickets.length > 0) {
      const currentDate = new Date();

      //sprawdzam ważność biletów (pobieram eventy i sprawdzamkiedy sie zakonczyly dla każdego ticketu)
      this.tickets.forEach((ticket) => {
        if (ticket.eventId) {
          this.eventService
            .getOne(ticket.eventId)
            .snapshotChanges()
            .pipe(
              map((c) => {
                const eventData = c.payload.data() as Event;
                const eventId = c.payload.id;
                return { id: eventId, ...eventData };
              })
            )
            .subscribe((data) => {
              if (data.date_end && new Date(data.date_end) < currentDate) {
                // Wydarzenie, na które jest bilet, już się zakończyło
                // Dodaj bilet do tablicy expiredTickets
                this.expiredTickets.push(ticket);
                // Opcjonalnie: usuń nieważny bilet z listy tickets
                this.tickets = this.tickets.filter((t) => t.id !== ticket.id);
              }
            });
        }
      });
    }
  }

  // Metoda do zmiany obrazka profilowego
  changeProfileImage(): void {
    if (this.selectedProfileImage) {
      this.authService
        .updateProfileImage(this.selectedProfileImage)
        .then((downloadURL) => {
          console.log('Obrazek profilowy został zaktualizowany.');
          console.log('Nowy URL obrazka:', downloadURL);
        })
        .catch((error: any) => {
          console.error(
            'Wystąpił błąd podczas aktualizacji obrazka profilowego:',
            error
          );
        });
    } else {
      console.warn('Nie wybrano obrazka profilowego.');
    }
  }

  openChangeDisplayNameDialog(): void {
    const dialogRef = this.dialog.open(DisplayNameDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.displayName = result;
        this.updateDisplayName();
      }
    });
  }

  openChangeProfilePictureDialog(): void {
    const dialogRef = this.dialog.open(ProfileIMGDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result: File | null) => {
      if (result) {
        this.selectedProfileImage = result;
        this.changeProfileImage();
      }
    });
  }
}
