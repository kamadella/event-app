import { Component, Input } from '@angular/core';
import { Event } from 'src/app/models/event.model';
import { Category } from 'src/app/models/category.model';
import { AuthService } from '../../../shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../../dialogs/login-dialog/login-dialog.component';


@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent  {
  @Input() event! : Event;
  @Input() categories?: Category[];

  constructor(
    private authService: AuthService,
    public dialog: MatDialog
  ) { }


  isEventLiked(): boolean {
    // Replace this logic with your actual implementation
    return this.authService.isEventLiked(this.event.id!);
  }

  isLoggedIn() {
    return this.authService.isLoggedIn;
  }

  updateLikedEventsList(action: boolean): void {
    if (this.event.id) {
      if (!action) {
        console.log("addLikedEvent");
        this.authService.addLikedEvent(this.event.id);
      }
      if (action) {
        console.log("removeLikedEvent");
        this.authService.removeLikedEvent(this.event.id);
      }
    }
  }

  openLoginDialog() {
    this.dialog.open(LoginDialogComponent, {
      width: '500px',
    });
  }

}
