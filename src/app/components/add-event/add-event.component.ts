import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/models/event.model';
import { EventService } from 'src/app/services/event.service';


@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {

  event: Event = new Event();
  submitted = false;
  categories: string[] = ['kat1', 'kat2', 'kat3', 'kat4'];

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
  }

  saveEvent(): void {
    this.eventService.create(this.event).then(() => {
      console.log('Created new item successfully!');
      this.submitted = true;
    });
  }

  newEvent(): void {
    this.submitted = false;
    this.event = new Event();
  }

}
