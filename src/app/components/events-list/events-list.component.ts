import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { CategoryService } from 'src/app/services/category.service';
import { map } from 'rxjs/operators';
import { Event } from 'src/app/models/event.model';
import { Category } from 'src/app/models/category.model';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css']
})
export class EventsListComponent implements OnInit {
  categories?: Category[];
  events?: Event[];
  currentEvent?: Event;
  title = '';
  filteredEventList?: Event[] = [];
  nameFilter: string = '';
  localizationFilter: string = '';
  dateStartFilter: Date | null = new Date();
  dateEndFilter: Date | null = new Date();



  constructor(private eventService: EventService, private categoryService: CategoryService) {

  }

  ngOnInit(): void {
    this.retrieveEvents();
    this.retrieveCategories();
    this.dateStartFilter = null;
    this.dateEndFilter = null;
  }


  retrieveEvents(): void {
    this.eventService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.events = data;
      this.filteredEventList = data;
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

  filterResults(text: string) {
    if (!text) {
      this.filteredEventList = this.events;
    }

    this.filteredEventList = this.events!.filter(
      event => event?.name?.toLowerCase().includes(text.toLowerCase())
    );
  }

  NewFilter(){
    const dateStartFilter = this.dateStartFilter ?? new Date(0);
    const dateEndFilter = this.dateEndFilter ?? new Date(9999, 11, 31);

    console.log("START = " + dateStartFilter);

    this.filteredEventList = this.events!.filter(
      event =>{
        return(
          //event?.place_name?.toLowerCase().includes(this.localizationFilter.toLowerCase()) &&
          event?.name?.toLowerCase().includes(this.nameFilter.toLowerCase()) &&
          event?.date_start && new Date(event.date_start) >= dateStartFilter &&
          event?.date_end && new Date(event.date_end) <= dateEndFilter
          )
      }
    );
  }

  CleanFilter(){
    this.filteredEventList = this.events;
    this.nameFilter = '';
    this.localizationFilter = '';
    this.dateStartFilter = null;
    this.dateEndFilter = null;
  }


}
