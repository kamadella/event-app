import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { TicketService } from 'src/app/services/ticket.service';
import { map } from 'rxjs/operators';
import { Ticket } from 'src/app/models/ticket.model';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  displayName: string = '';
  tickets?: Ticket[];
  showed: boolean = false;

  constructor(public authService: AuthService,
    private ticketService: TicketService,
    ) { }

  ngOnInit(): void {
    this.displayName = this.authService.userData.displayName || '';
    this.retrieveTickets();
  }

  updateDisplayName() {
    const newDisplayName = this.displayName; // Pobieramy nową nazwę użytkownika
    if (newDisplayName.trim() !== '') {
      console.log("innn dash");
      this.authService.updateDisplayName(newDisplayName)
    }
  }


  retrieveTickets(): void {
    // Pobierz identyfikator użytkownika
    const userId = this.authService.getUserId();
    this.ticketService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.tickets = data.filter(ticket => ticket.userId === userId);
    });
  }

  showTickets(): void {
    this.showed = !this.showed; // Zamienia wartość na przeciwną (true na false lub false na true)
  }




}
