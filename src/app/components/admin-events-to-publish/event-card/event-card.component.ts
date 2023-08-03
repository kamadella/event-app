import { Component, Input, OnInit } from '@angular/core';
import { Event } from 'src/app/models/event.model';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit {
  @Input() event! : Event;
  @Input() categories?: Category[];

  constructor() { }

  ngOnInit(): void {

  }




}
