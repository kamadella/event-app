import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { CategoryService } from 'src/app/services/category.service';
import { map } from 'rxjs/operators';
import { Event } from 'src/app/models/event.model';
import { Category } from 'src/app/models/category.model';

@Component({
  selector: 'app-events-archive',
  templateUrl: './events-archive.component.html',
  styleUrls: ['./events-archive.component.css'],
})
export class EventsArchiveComponent implements OnInit {
  categories!: Category[];
  events?: Event[];
  filteredEventList?: Event[] = [];
  isSearchFilterVisible = false;


  constructor(
    private eventService: EventService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.retrieveEvents();
    this.retrieveCategories();
  }

  retrieveEvents(): void {
    this.eventService
      .getAll()
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
          }))
        ),
        map((data) => {
          const currentDate = new Date();
          const filteredEvents = data.filter(
            (event) =>
              event.published === true &&
              (event.date_end ? new Date(event.date_end) < currentDate : false)
          );
          //sortowanie po dacie rozpoczęcia
          return filteredEvents.sort((a, b) => {
            const dateA = a.date_start ? new Date(a.date_start) : null;
            const dateB = b.date_start ? new Date(b.date_start) : null;

            if (!dateA && !dateB) return 0;
            if (!dateA) return 1;
            if (!dateB) return -1;

            return dateB.getTime() - dateA.getTime();
          });
        })
      )
      .subscribe((sortedEvents) => {
        this.events = sortedEvents;
        this.filteredEventList = this.events;
      });
  }

  retrieveCategories(): void {
    this.categoryService
      .getAll()
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
          }))
        )
      )
      .subscribe((data) => {
        this.categories = data;
      });
  }

  getSelectedCategories(selectedCategoryIndices: number[]) {
    const selectedCategoryObjects = selectedCategoryIndices.map(
      (index) => this.categories[index]
    );
    return selectedCategoryObjects;
  }

  calculateBbox(cityBbox: number[], distanceFilter: number) {
    const R = 6371; // Średnica Ziemi w kilometrach
    const latPerKm = 1 / (R * (Math.PI / 180)); // Przybliżona liczba stopni szerokości na jeden kilometr
    const lonPerKm = latPerKm / Math.cos(cityBbox[1] * (Math.PI / 180)); // Przybliżona liczba stopni długości na jeden kilometr

    // Obliczasz nowe współrzędne bbox z uwzględnieniem odległości
    const newMinLon = cityBbox[0] - lonPerKm * distanceFilter;
    const newMinLat = cityBbox[1] - latPerKm * distanceFilter;
    const newMaxLon = cityBbox[2] + lonPerKm * distanceFilter;
    const newMaxLat = cityBbox[3] + latPerKm * distanceFilter;
    console.log('jestem calculateBbox');

    //cityBbox = [newMinLon, newMinLat, newMaxLon, newMaxLat];
    return [newMinLon, newMinLat, newMaxLon, newMaxLat];
  }

  // Metoda obsługująca zmiany filtrów z komponentu SearchFilterComponent
  handleFilterChange(filters: any) {
    // Logika filtrowania
    if (filters.isFiltersCleared) {
      this.filteredEventList = this.events; // Przywróć pierwotny stan, jeśli filtry są puste
      return;
    }

    const dateStartFilter = filters.dateStartFilter ?? new Date(0);
    const dateEndFilter = filters.dateEndFilter ?? new Date(9999, 11, 31);

    const selectedCategoryObjects = this.getSelectedCategories(filters.selectedCategories);
    console.log('bbox: ' + filters.cityBbox);
    if (filters.cityBbox && filters.distanceFilter) {
      filters.cityBbox = this.calculateBbox(filters.cityBbox, filters.distanceFilter);
      console.log('nowy bbox: ' + filters.cityBbox);
    }

    this.filteredEventList = this.events!.filter((event) => {
      const isWithinDateRange =
        event?.date_start &&
        new Date(event.date_start) >= dateStartFilter &&
        new Date(event.date_start) <= dateEndFilter;

      const isMatchingCategory =
        selectedCategoryObjects.length === 0 ||
        selectedCategoryObjects.some(
          (category) => category.id === event?.category
        );

      const isMatchingName = event?.name
        ?.toLowerCase()
        .includes(filters.nameFilter.toLowerCase());

      let isInsideBbox = true; // Domyślnie załóż, że punkt jest wewnątrz bbox

      if (filters.cityBbox && event.lng && event.lat) {
        const isPointInsideBbox =
          event.lng >= filters.cityBbox[0] &&
          event.lat >= filters.cityBbox[1] &&
          event.lng <= filters.cityBbox[2] &&
          event.lat <= filters.cityBbox[3];

          console.log("event.lng: " + event.lng);
          console.log("event.lat: " + event.lat );
        isInsideBbox = isPointInsideBbox; // Ustaw wartość na podstawie sprawdzenia punktu w bbox
      }
      console.log("isInsideBbox: " + isInsideBbox);

      return (
        isInsideBbox &&
        isWithinDateRange &&
        isMatchingCategory &&
        isMatchingName
      );
    });
  }
  toggleSearchFilter() {
    this.isSearchFilterVisible = !this.isSearchFilterVisible;
  }
}
