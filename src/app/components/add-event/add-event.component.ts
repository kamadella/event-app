import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/models/event.model';
import { EventService } from 'src/app/services/event.service';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {
  categoriess?: Category[];
  event: Event = new Event();
  submitted = false;
  categories: string[] = ['kat1', 'kat2', 'kat3', 'kat4'];

  constructor(private eventService: EventService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.retrieveCategory();
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

  retrieveCategory(): void {
    this.categoryService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.categoriess = data;
    });
  }


}
