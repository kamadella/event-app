import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TicketService } from 'src/app/services/ticket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {
  ticketForm!: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public event: any,
  private ticketService: TicketService,
  private eventService: EventService,
  private authService: AuthService,
  public fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.ticketForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: [''],
      number: [''],
      userId: [''],
      eventId: [''],
    });
  }



  saveTicket(): void {
    // Pobierz identyfikator użytkownika
    const userId = this.authService.getUserId();

    // Przypisz identyfikator użytkownika do biletu
    this.ticketForm.value.userId = userId;
    // Przypisz identyfikator wydarzenia do biletu
    this.ticketForm.value.eventId = this.event.id;


    if (confirm('Czy na pewno chcesz zarezerwować bilety?')) {
      this.ticketService
        .create(this.ticketForm.value)
        .then(() => {
          console.log('Rezerwacja się powiodła');
          this.updateEvent(this.ticketForm.value.number);
        });
    }
  }


  updateEvent(reservedTickets: number): void {
    this.event.ticketsLeft -= reservedTickets;

    if (this.event.id) {
      this.eventService.update(this.event.id, this.event)
        .catch(err => console.log(err));
    }
  }

}
