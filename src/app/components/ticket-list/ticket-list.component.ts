import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from 'src/app/models/event.model';
import { EventService } from 'src/app/services/event.service';
import { TicketService } from 'src/app/services/ticket.service';
import { map } from 'rxjs/operators';
import { Ticket } from 'src/app/models/ticket.model';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {
  eventId: string = '-1';
  currentEvent: Event = {};
  tickets?: Ticket[];

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private ticketService: TicketService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => (this.eventId = params['id']));
    this.getCurrentEvent(this.eventId);
    this.retrieveTickets();
  }

  getCurrentEvent(id: string): void {
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
      });
  }

  retrieveTickets(): void {
    this.ticketService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.tickets = data.filter(ticket => ticket.eventId === this.eventId);
    });
  }

}
