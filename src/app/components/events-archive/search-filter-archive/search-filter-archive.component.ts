import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { map } from 'rxjs/operators';
import { Category } from 'src/app/models/category.model';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { environment } from '../../../../environments/environment';
import 'moment/locale/pl';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
  selector: 'app-search-filter-archive',
  templateUrl: './search-filter-archive.component.html',
  styleUrls: ['./search-filter-archive.component.css'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class SearchFilterArchiveComponent implements OnInit {
  @Output() filterChanged = new EventEmitter<any>();

  categories!: Category[];

  nameFilter: string = '';
  distanceFilter: number = 0;
  dateStartFilter: Date | null = new Date();
  dateEndFilter: Date | null = new Date();
  selectedCategories: number[] = []; // Tablica do przechowywania zaznaczonych indeksów kategorii
  cityBbox?: number[];

  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat: number = 53.1322;
  lng: number = 23.1687;

  constructor(
    private categoryService: CategoryService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) {}

  ngOnInit(): void {
    this.retrieveCategories();
    this.dateStartFilter = null;
    this.dateEndFilter = null;
    this.initializeGeocoder();

  }

  initializeGeocoder() {
    const geocoderFilter = new MapboxGeocoder({
      accessToken: environment.mapbox.accessToken,
      mapboxgl: mapboxgl,
      types: 'country,place,postcode,locality,neighborhood',
    });

    geocoderFilter.addTo('#geocoderFilterArchive');

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
      });
  }

  applyFilter() {
    const filters = {
      nameFilter: this.nameFilter,
      distanceFilter: this.distanceFilter,
      dateStartFilter: this.dateStartFilter,
      dateEndFilter: this.dateEndFilter,
      selectedCategories: this.selectedCategories,
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
    this.selectedCategories = [];
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
      isFiltersCleared: true
    });
  }

  // Metoda do obsługi zaznaczania kategorii
  toggleCategory(index: number) {
    console.log(this.selectedCategories);
    if (this.selectedCategories.includes(index)) {
      this.selectedCategories = this.selectedCategories.filter(
        (i) => i !== index
      );
    } else {
      this.selectedCategories.push(index);
    }
  }

  setLocale(locale: string) {
    this._locale = locale;
    this._adapter.setLocale(this._locale);
  }

}
