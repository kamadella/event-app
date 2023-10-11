import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { map } from 'rxjs/operators';
import { Category } from 'src/app/models/category.model';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import 'moment/locale/pl';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class SearchFilterComponent implements OnInit {
  @Output() filterChanged = new EventEmitter<any>();

  categories!: Category[]; // tu przechowuje wszystki kategorie

  nameFilter: string = '';
  distanceFilter: number = 0;
  dateStartFilter: Date | null = new Date();
  dateEndFilter: Date | null = new Date();
  selectedCategoriesIndexes: number[] = []; // Tablica do przechowywania zaznaczonych indeksów kategorii
  cityBbox?: number[];

  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat: number = 53.1322;
  lng: number = 23.1687;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) {}

  ngOnInit(): void {
    this.retrieveCategories();
    this.dateStartFilter = null;
    this.dateEndFilter = null;
    this.route.params.subscribe((params) => {
      const categoryId = params['category'];
      if (categoryId && this.categories) {
        const categoryIndex = this.categories.findIndex(
          (category) => category.id === categoryId
        );
        if (categoryIndex !== -1) {
          this.toggleCategory(categoryIndex);
        }
      }
    });

  }

  ngAfterViewInit() {
    // Opóźnij inicjalizację mapy, aby Angular miał więcej czasu
    setTimeout(() => {
      this.initializeGeocoder();
    }, 50);
  }

  initializeGeocoder() {
    const geocoderFilter = new MapboxGeocoder({
      accessToken: environment.mapbox.accessToken,
      mapboxgl: mapboxgl,
      types: 'country,place,postcode,locality,neighborhood',
    });

    geocoderFilter.addTo('#geocoderFilter');

    // Add geocoder result to container.
    geocoderFilter.on('result', (e) => {
      this.cityBbox = e.result.bbox;
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

        this.route.params.subscribe((params) => {
          const categoryId = params['category'];
          if (categoryId && this.categories) {
            const categoryIndex = this.categories.findIndex(
              (category) => category.id === categoryId
            );
            if (categoryIndex !== -1) {
              this.toggleCategory(categoryIndex);
            }
          }
        });
      });
  }

  applyFilter() {
    const filters = {
      nameFilter: this.nameFilter,
      distanceFilter: this.distanceFilter,
      dateStartFilter: this.dateStartFilter,
      dateEndFilter: this.dateEndFilter,
      selectedCategories: this.selectedCategoriesIndexes,
      cityBbox: this.cityBbox,
    };

    this.filterChanged.emit(filters);
  }

  CleanFilter() {
    // Przywróć filtrowaną listę do pierwotnej listy wydarzeń
    this.nameFilter = '';
    this.dateStartFilter = null;
    this.dateEndFilter = null;
    this.distanceFilter = 0;
    this.selectedCategoriesIndexes = [];
    this.cityBbox = undefined;

    const geocoderInput = document.querySelector(
      '.mapboxgl-ctrl-geocoder input'
    );
    if (geocoderInput instanceof HTMLInputElement) {
      geocoderInput.value = ''; // Wyczyść input geokodera
    }

    // Emituj zdarzenie, że filtry zostały wyczyszczone
    this.filterChanged.emit({
      nameFilter: '',
      distanceFilter: 0,
      dateStartFilter: null,
      dateEndFilter: null,
      selectedCategories: [],
      cityBbox: undefined,
      isFiltersCleared: true,
    });
    // Przenieś do /events/list po wyczyszczeniu filtrów
    this.router.navigate(['/events/list']);
  }

  // Metoda do obsługi zaznaczania i odznaczania kategorii
  //Ta metoda jest wywoływana, gdy użytkownik zmienia stan checkboxa poprzez kliknięcie.
  toggleCategory(categoryIndex: number) {
    const selectedIndex = this.selectedCategoriesIndexes.indexOf(categoryIndex);

    if (selectedIndex === -1) {
      //Kategoria nie jest w tablicy, dodaj ją
      this.selectedCategoriesIndexes.push(categoryIndex);
    } else {
      //Kategoria jest już w tablicy, usuń ją
      this.selectedCategoriesIndexes.splice(selectedIndex, 1);
    }
  }

  //sprawdza, czy dany indeks kategorii znajduje się w tablicy
  //jest po to by odznaczało przy czyszczeniu filtrów
  isSelectedCategory(index: number): boolean {
    return this.selectedCategoriesIndexes.includes(index);
  }

  setLocale(locale: string) {
    this._locale = locale;
    this._adapter.setLocale(this._locale);
  }
}
