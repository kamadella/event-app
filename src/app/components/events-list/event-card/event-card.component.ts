import { Component, Input } from '@angular/core';
import { Event } from 'src/app/models/event.model';
import { Category } from 'src/app/models/category.model';


@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent  {
  @Input() event! : Event;
  @Input() categories?: Category[];

  constructor() { }

}
