import { Component, OnInit, Input} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';;
import { EventService } from 'src/app/services/event.service';
import { map } from 'rxjs/operators';
import { Event } from 'src/app/models/event.model';


@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit {
  eventId:string = "-1";
  currentEvent: Event = {
    name: '',
    description: '',
    localization: '',
    organizator: '',
    img: '',
    date_start: new Date,
    date_end: new Date,
    category: '',
    tickets: 0,
  };
  message = '';


  constructor(private route: ActivatedRoute, private eventService: EventService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe( params=> this.eventId = params['id']);
    this.getCurrentEvent(this.eventId);
    this.message = '';
  }


  getCurrentEvent(id: string) : void{
    this.eventService.getOne(id).snapshotChanges().pipe(
      map(c =>{
        const eventData = c.payload.data() as Event;
        const eventId = c.payload.id;
        return { id: eventId, ...eventData };
  })
    ).subscribe(data => {
      console.log(data); // Możesz tutaj użyć danych w dalszej części kodu
      this.currentEvent = data;
    });
  }

  deleteEvent(): void {
    if(confirm("Are you sure to delete? ")){
      if (this.currentEvent.id) {
        this.eventService.delete(this.currentEvent.id)
          .then(() => {
            //this.refreshList.emit();
            this.message = 'The tutorial was updated successfully!';
          })
          .catch(err => console.log(err));
      }
    }
    this.router.navigate(['/events']);
  }
}
