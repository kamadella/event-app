import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { TicketService } from 'src/app/services/ticket.service';
import { map } from 'rxjs/operators';
import { Ticket } from 'src/app/models/ticket.model';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/models/event.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  displayName: string = '';
  tickets: Ticket[] = [];;
  showed: boolean = false;
  currentEventDate: Date = new Date();
  expiredTickets: Ticket[] = [];
  isTicketValidityChecked: boolean = false; // zmienna flagowa
  selectedProfileImage: File | null = null; // Pole przechowujące wybrany obrazek


  constructor(
    public authService: AuthService,
    private ticketService: TicketService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.displayName = '';
    this.retrieveTickets();
  }

  updateDisplayName() {
    const newDisplayName = this.displayName; // Pobieramy nową nazwę użytkownika
    if (newDisplayName.trim() !== '') {
      console.log('innn dash');
      this.authService.updateDisplayName(newDisplayName);
    }
  }

  retrieveTickets(): void {
    // Pobierz identyfikator użytkownika
    const userId = this.authService.getUserId();
    this.ticketService
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
        this.tickets = data.filter((ticket) => ticket.userId === userId);
        // Sprawdź aktualność biletów tylko jeśli jeszcze nie sprawdzono
        if (!this.isTicketValidityChecked) {
          this.checkTicketValidity();
          this.isTicketValidityChecked = true; // Oznacz, że sprawdzono aktualność biletów
        }
      });
  }

  showTickets(): void {
    this.showed = !this.showed; // Zamienia wartość na przeciwną (true na false lub false na true)
  }

  checkTicketValidity(): void {
    if (this.tickets && this.tickets.length > 0) {
      const currentDate = new Date();
      this.tickets.forEach(ticket => {
        if (ticket.eventId) {
          this.eventService.getOne(ticket.eventId).snapshotChanges().pipe(
            map(c => {
              const eventData = c.payload.data() as Event;
              const eventId = c.payload.id;
              return { id: eventId, ...eventData };
            })
          ).subscribe(data => {
            if (data.date_end && new Date(data.date_end) < currentDate) {
              // Wydarzenie, na które jest bilet, już się zakończyło
              // Dodaj bilet do tablicy expiredTickets
              this.expiredTickets.push(ticket);
              // Opcjonalnie: usuń nieważny bilet z listy tickets
              this.tickets = this.tickets.filter(t => t.id !== ticket.id);
            }
          });
        }
      });
    }
  }

    // Metoda wywoływana po wybraniu obrazka przez użytkownika
    onImageSelected(event: any): void {
      if (event.target.files && event.target.files.length > 0) {
        const selectedImage = event.target.files[0];
        const imageSizeLimit = 3 * 1024 * 1024; // Przykładowy limit wielkości obrazka (3 MB)

        if (selectedImage.size > imageSizeLimit) {
          alert('Zdjęcie jest za duże. Maksymalny rozmiar to 3MB.');

          this.selectedProfileImage = null; // Wyczyść wybrany plik
          event.target.value = null; // Wyczyść pole input typu plik

        } else {
          this.selectedProfileImage = selectedImage;
        }
      }
    }

    // Metoda do zmiany obrazka profilowego
    changeProfileImage(): void {
      if (this.selectedProfileImage) {
        this.authService.updateProfileImage(this.selectedProfileImage)
          .then((downloadURL) => {
            console.log('Obrazek profilowy został zaktualizowany.');
            console.log('Nowy URL obrazka:', downloadURL);
          })
          .catch((error: any ) => {
            console.error('Wystąpił błąd podczas aktualizacji obrazka profilowego:', error);
          });
      } else {
        console.warn('Nie wybrano obrazka profilowego.');
      }
    }

}
