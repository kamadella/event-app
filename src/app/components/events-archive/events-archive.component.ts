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
  selector: 'app-events-archive',
  templateUrl: './events-archive.component.html',
  styleUrls: ['./events-archive.component.css']
})
export class EventsArchiveComponent implements OnInit {

  categories!: Category[];
  events?: Event[];
  currentEvent?: Event;
  title = '';
  filteredEventList?: Event[] = [];
  archivedEventList?: Event[] = [];
  nameFilter: string = '';
  localizationFilter: string = '';
  distanceFilter: number = 0;

  dateStartFilter: Date | null = new Date();
  dateEndFilter: Date | null = new Date();
  selectedCategories: number[] = []; // Tablica do przechowywania zaznaczonych indeksów kategorii

  cityBbox?: number[];

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

    const geocoderFilter = new MapboxGeocoder({
      accessToken: environment.mapbox.accessToken,
      mapboxgl: mapboxgl,
      types: 'country,place,postcode,locality,neighborhood'

    });

    geocoderFilter.addTo('#geocoderFilterArchieve');

    // Add geocoder result to container.
    geocoderFilter.on('result', (e) => {
      this.cityBbox = e.result.bbox;
      console.log(this.cityBbox);

      });

    // Clear results container when search is cleared.
    geocoderFilter.on('clear', () => {

    });
  }


  retrieveEvents(): void {
    this.eventService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      ),
      map(data => {
        const currentDate = new Date();
        const filteredEvents = data.filter(event =>
          event.published === true && (event.date_end ? new Date(event.date_end) < currentDate : false)
        );
        //sortowanie po dacie rozpoczęcia
        return filteredEvents.sort((a, b) => {
          const dateA = a.date_start ? new Date(a.date_start) : null;
          const dateB = b.date_start ? new Date(b.date_start) : null;

          if (!dateA && !dateB) return 0;
          if (!dateA) return 1;
          if (!dateB) return -1;

          return  dateB.getTime() - dateA.getTime();
        });
      })
    ).subscribe(sortedEvents => {
      this.events = sortedEvents;
      this.filteredEventList = this.events;
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


  NewFilter(){
    const dateStartFilter = this.dateStartFilter ?? new Date(0);
    const dateEndFilter = this.dateEndFilter ?? new Date(9999, 11, 31);

    const selectedCategoryObjects = this.getSelectedCategories();

    if(this.cityBbox){
      this.calculateBbox(this.cityBbox, this.distanceFilter);
      console.log("nowy bbox: " + this.cityBbox);
    }

    this.filteredEventList = this.events!.filter(
      event =>{
        const isWithinDateRange =
          event?.date_start && new Date(event.date_start) >= dateStartFilter &&
          event?.date_end && new Date(event.date_end) <= dateEndFilter;

        const isMatchingCategory =
          selectedCategoryObjects.length === 0 ||
          selectedCategoryObjects.some(category => category.id === event?.category);

        const isMatchingName = event?.name?.toLowerCase().includes(this.nameFilter.toLowerCase());

        let isInsideBbox = true; // Domyślnie załóż, że punkt jest wewnątrz bbox

        if (this.cityBbox && event.lng && event.lat) {
          const isPointInsideBbox =
            event.lng >= this.cityBbox[0] && event.lng <= this.cityBbox[1] &&
            event.lat >= this.cityBbox[2] && event.lat <= this.cityBbox[3];

          isInsideBbox = isPointInsideBbox; // Ustaw wartość na podstawie sprawdzenia punktu w bbox
        }

        return (
          isInsideBbox && isWithinDateRange && isMatchingCategory && isMatchingName
        )


      }
    );
  }

  showArchivedEvents(): void {
    this.filteredEventList = this.archivedEventList;
  }



  CleanFilter(){
    this.filteredEventList = this.events;
    this.nameFilter = '';
    this.localizationFilter = '';
    this.dateStartFilter = null;
    this.dateEndFilter = null;
    this.distanceFilter = 0;
    this.selectedCategories = [];

    const geocoderInput = document.querySelector('.mapboxgl-ctrl-geocoder input');
    if (geocoderInput instanceof HTMLInputElement) {
      geocoderInput.value = ''; // Wyczyść input geokodera
    }
  }


    // Metoda do obsługi zaznaczania kategorii
  toggleCategory(index: number) {
    console.log(this.selectedCategories);
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


  calculateBbox(cityBbox : number[], distanceFilter: number) : void {
    const R = 6371; // Średnica Ziemi w kilometrach
    const latPerKm = 1 / (R * (Math.PI / 180)); // Przybliżona liczba stopni szerokości na jeden kilometr
    const lonPerKm = latPerKm / Math.cos(cityBbox[1] * (Math.PI / 180)); // Przybliżona liczba stopni długości na jeden kilometr

    // Obliczasz nowe współrzędne bbox z uwzględnieniem odległości
    const newMinLon = cityBbox[0] - (lonPerKm * distanceFilter);
    const newMinLat = cityBbox[1] - (latPerKm * distanceFilter);
    const newMaxLon = cityBbox[2] + (lonPerKm * distanceFilter);
    const newMaxLat = cityBbox[3] + (latPerKm * distanceFilter);
    console.log("jestem calculateBbox");

    //cityBbox = [newMinLon, newMinLat, newMaxLon, newMaxLat];
    this.cityBbox = [newMinLon, newMinLat, newMaxLon, newMaxLat];
  }

}
