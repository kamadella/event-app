import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TicketService } from 'src/app/services/ticket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css'],
})
export class TicketComponent implements OnInit {
  ticketForm!: FormGroup;
  ticketsAvailabilityMessage: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public event: any,
    private ticketService: TicketService,
    private eventService: EventService,
    private authService: AuthService,
    public fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.ticketForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
          Validators.pattern('^[a-zA-Z]+$'),
        ],
      ],
      surname: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
          Validators.pattern('^[a-zA-Z]+$'),
        ],
      ],
      number: ['', [Validators.required]],
      userId: [''],
      eventId: [''],
    });
  }

  get number() {
    return this.ticketForm.get('number');
  }

  get name() {
    return this.ticketForm.get('name');
  }
  get surname() {
    return this.ticketForm.get('surname');
  }

  onReservedTicketsChange(): void {
    const reservedTickets = this.ticketForm.value.number;
    // Tutaj wykonaj sprawdzenie dostępności biletów i ustaw odpowiednią wiadomość
    if (this.event.ticketsLeft < reservedTickets) {
      this.ticketsAvailabilityMessage = 'Nie ma wystarczającej ilości biletów.';
    } else {
      this.ticketsAvailabilityMessage = '';
    }
  }

  saveTicket(): void {
    // Pobierz identyfikator użytkownika
    const userId = this.authService.getUserId();

    // Przypisz identyfikator użytkownika do biletu
    this.ticketForm.value.userId = userId;
    // Przypisz identyfikator wydarzenia do biletu
    this.ticketForm.value.eventId = this.event.id;

    if (this.event.ticketsLeft >= this.ticketForm.value.number) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: 'Czy na pewno chcesz zarezerwować bilety?',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          // Użytkownik kliknął "OK" w potwierdzeniu
          this.ticketService.create(this.ticketForm.value).then(() => {
            console.log('Rezerwacja się powiodła');
            this.updateEvent(this.ticketForm.value.number);
          });
        } else {
          // Użytkownik kliknął "Anuluj" lub zamknął dialog
          console.log('Cancelled reservation');
        }
      });
    }
  }

  updateEvent(reservedTickets: number): void {
    this.event.ticketsLeft -= reservedTickets;

    if (this.event.id) {
      this.eventService
        .update(this.event.id, this.event)
        .catch((err) => console.log(err));
    }
  }
}
