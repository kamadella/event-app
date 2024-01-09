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
      .getFilteredEvents(true)
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
          }))
        ),
        map((data) => {
          const sortedEvents = data.sort((a, b) => {
            const dateA = a.date_start ? new Date(a.date_start) : null;
            const dateB = b.date_start ? new Date(b.date_start) : null;

            if (!dateA && !dateB) return 0;
            if (!dateA) return 1;
            if (!dateB) return -1;

            return dateB.getTime() - dateA.getTime();
          });

          return sortedEvents;
        })
      )
      .subscribe((data) => {
        this.events = data;
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
    const R = 6371;
    const latPerKm = 1 / (R * (Math.PI / 180));
    const lonPerKm = latPerKm / Math.cos(cityBbox[1] * (Math.PI / 180));

    const newMinLon = cityBbox[0] - lonPerKm * distanceFilter;
    const newMinLat = cityBbox[1] - latPerKm * distanceFilter;
    const newMaxLon = cityBbox[2] + lonPerKm * distanceFilter;
    const newMaxLat = cityBbox[3] + latPerKm * distanceFilter;

    return [newMinLon, newMinLat, newMaxLon, newMaxLat];
  }

  handleFilterChange(filters: any) {
    if (filters.isFiltersCleared) {
      this.filteredEventList = this.events;
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

      let isInsideBbox = true;

      if (filters.cityBbox && event.lng && event.lat) {
        const isPointInsideBbox =
          event.lng >= filters.cityBbox[0] &&
          event.lat >= filters.cityBbox[1] &&
          event.lng <= filters.cityBbox[2] &&
          event.lat <= filters.cityBbox[3];

          console.log("event.lng: " + event.lng);
          console.log("event.lat: " + event.lat );
        isInsideBbox = isPointInsideBbox;
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
