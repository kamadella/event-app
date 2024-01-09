import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { CategoryService } from 'src/app/services/category.service';
import { map } from 'rxjs/operators';
import { Event } from 'src/app/models/event.model';
import { Category } from 'src/app/models/category.model';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoginDialogComponent } from '../dialogs/login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css'],
})
export class EventsListComponent implements OnInit {
  categories!: Category[];
  events?: Event[];
  filteredEventList?: Event[] = [];
  originalEventList: Event[] = [];
  isSearchFilterVisible = false;
  isShowOnlyLikedEventsClicked = false;

  constructor(
    private eventService: EventService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private authService: AuthService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.retrieveEvents();
    this.retrieveCategories();
    this.route.params.subscribe((params) => {
      const categoryId = params['category'];
      if (categoryId) {
        this.filterEventsByCategory(categoryId);
      } else {
        this.filteredEventList = this.events;
      }
    });
  }


  retrieveEvents(): void {
    this.eventService
      .getFilteredEvents()
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

            return dateA.getTime() - dateB.getTime();
          });

          return sortedEvents;
        })
      )
      .subscribe((data) => {
        this.events = data;
        this.filteredEventList = this.events;
        this.route.params.subscribe((params) => {
          const categoryId = params['category'];
          if (categoryId) {
            this.filterEventsByCategory(categoryId);
          } else {
            this.filteredEventList = this.events;
          }
        });
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

  filterEventsByCategory(categoryId: string): void {
    this.filteredEventList = this.events?.filter(
      (event) => event.category === categoryId
    );
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
      if(this.isShowOnlyLikedEventsClicked){
        this.showOnlyLikedEvents()
      }
      return;
    }

    const dateStartFilter = filters.dateStartFilter ?? new Date(0);
    const dateEndFilter = filters.dateEndFilter ?? new Date(9999, 11, 31);

    const selectedCategoryObjects = this.getSelectedCategories(
      filters.selectedCategories
    );
    if (filters.cityBbox && filters.distanceFilter) {
      filters.cityBbox = this.calculateBbox(
        filters.cityBbox,
        filters.distanceFilter
      );
    }

    this.filteredEventList = this.events!.filter((event) => {
      const isWithinDateRange =
        event?.date_end &&
        event?.date_start &&
        new Date(event.date_end) >= dateStartFilter &&
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

        isInsideBbox = isPointInsideBbox;
      }


      return (
        isInsideBbox &&
        isWithinDateRange &&
        isMatchingCategory &&
        isMatchingName
      );
    });
    if(this.isShowOnlyLikedEventsClicked){
      this.showOnlyLikedEvents()
    }
  }

  toggleSearchFilter() {
    this.isSearchFilterVisible = !this.isSearchFilterVisible;
  }

  toggleShowOnlyLikedEvents() {
    this.isShowOnlyLikedEventsClicked = !this.isShowOnlyLikedEventsClicked;
    this.showOnlyLikedEvents();
  }

  showOnlyLikedEvents(){
    if(this.isShowOnlyLikedEventsClicked && this.filteredEventList){
      this.originalEventList = this.filteredEventList;
      if(this.authService.userData){
        console.log(this.authService.userData.likedEvents);
        const likedEvents = this.authService.userData.likedEvents;
        this.filteredEventList = this.filteredEventList!.filter((event) => {
          return likedEvents.includes(event.id);
        });
      }
    }
    else{
      this.filteredEventList = this.originalEventList;
    }
  }

  openLoginDialog() {
    this.dialog.open(LoginDialogComponent, {
      width: '500px',
    });
  }

  isLoggedIn() {
    return this.authService.isLoggedIn;
  }

  isAdmin() {
    return this.authService.isAdmin;
  }

}
