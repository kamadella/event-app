import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { CategoryService } from 'src/app/services/category.service';
import { map } from 'rxjs/operators';
import { Event } from 'src/app/models/event.model';
import { Category } from 'src/app/models/category.model';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css']
})
export class EventsListComponent implements OnInit {
  categories!: Category[];
  events?: Event[];
  currentEvent?: Event;
  title = '';
  filteredEventList?: Event[] = [];
  nameFilter: string = '';
  localizationFilter: string = '';
  kilometersFilter: number = 0;

  dateStartFilter: Date | null = new Date();
  dateEndFilter: Date | null = new Date();
  selectedCategories: number[] = []; // Tablica do przechowywania zaznaczonych indeksów kategorii

  bbox?: number[];

  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat: number = 53.1322;
  lng: number = 23.1687;


  constructor(private eventService: EventService, private categoryService: CategoryService) {

  }

  ngOnInit(): void {
    this.retrieveEvents();
    this.retrieveCategories();
    this.dateStartFilter = null;
    this.dateEndFilter = null;

    const geocoder = new MapboxGeocoder({
      accessToken: environment.mapbox.accessToken,
      mapboxgl: mapboxgl
    });

    geocoder.addTo('#geocoder');

    // Add geocoder result to container.
    geocoder.on('result', (e) => {
      this.bbox = e.result.bbox;
      console.log(this.bbox);

      });

    // Clear results container when search is cleared.
    geocoder.on('clear', () => {

    });
  }


  retrieveEvents(): void {
    this.eventService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.events = data.filter(event => event.published === true);
      this.filteredEventList = data.filter(event => event.published === true);
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

    const selectedCategoryObjects = this.getSelectedCategories();

    this.filteredEventList = this.events!.filter(
      event =>{

        return(
          event?.place_name?.toLowerCase().includes(this.localizationFilter.toLowerCase()) &&
          event?.name?.toLowerCase().includes(this.nameFilter.toLowerCase()) &&
          event?.date_start && new Date(event.date_start) >= dateStartFilter &&
          event?.date_end && new Date(event.date_end) <= dateEndFilter  &&
          (selectedCategoryObjects.length === 0 || // Jeśli nie ma wybranych kategorii, to zwróć true (bez filtrowania po kategoriach)
          selectedCategoryObjects.some(category => category.id === event?.category))

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


    // Metoda do obsługi zaznaczania kategorii
    toggleCategory(index: number) {
      if (this.selectedCategories.includes(index)) {
        this.selectedCategories = this.selectedCategories.filter(i => i !== index);
      } else {
        this.selectedCategories.push(index);
      }
    }

    getSelectedCategories() {
      const selectedCategoryObjects = this.selectedCategories.map(index => this.categories[index]);
      return selectedCategoryObjects;
    }

}
