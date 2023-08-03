import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { CategoryService } from 'src/app/services/category.service';
import { map } from 'rxjs/operators';
import { Event } from 'src/app/models/event.model';
import { Category } from 'src/app/models/category.model';


@Component({
  selector: 'app-admin-events-to-publish',
  templateUrl: './admin-events-to-publish.component.html',
  styleUrls: ['./admin-events-to-publish.component.css']
})
export class AdminEventsToPublishComponent implements OnInit {

  categories?: Category[];
  events?: Event[];
  currentEvent?: Event;
  title = '';



  constructor(private eventService: EventService, private categoryService: CategoryService) {

  }

  ngOnInit(): void {
    this.retrieveEvents();
    this.retrieveCategories();
  }


  retrieveEvents(): void {
    this.eventService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.events = data.filter(e => e.published === false);
    });
  }

  retrieveCategories(): void {
    this.categoryService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.categories = data;
    });
  }





}
