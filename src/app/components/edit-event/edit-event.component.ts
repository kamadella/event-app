import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/models/event.model';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { map } from 'rxjs/operators';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Ng2ImgMaxService } from 'ng2-img-max';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css'],
})
export class EditEventComponent implements OnInit {
  eventForm!: FormGroup;

  eventId: string = '-1';
  currentEvent: Event = {};
  previousLocalization = {
    lat: 0,
    lng: 0,
    place_name: '',
  };
  reservedTickets: number = 0;
  previousImage: string = ''; // Nazwa lub ścieżka poprzedniego zdjęcia
  currentCategory: Category = {};
  categories?: Category[];

  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat: number = 53.1322;
  lng: number = 23.1687;
  selectedImageFile: File | null = null;
  imageURL: string = '';

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private categoryService: CategoryService,
    public fb: FormBuilder,
    private location: Location,
    private ng2ImgMaxService: Ng2ImgMaxService
  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
      organizator: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      date_start: ['', [Validators.required]],
      date_end: ['', [Validators.required]],
      category: ['', [Validators.required]],
      tickets: [''],
      ticketsLeft: [''],
      img: ['', [Validators.required]],
      lat: ['', [Validators.required]],
      lng: ['', [Validators.required]],
      place_name: ['', [Validators.required]],
      published: [''],
    });

    this.route.params.subscribe((params) => (this.eventId = params['id']));
    this.getCurrentEvent(this.eventId);
    this.retrieveCategory();
    this.initializeGeocoder();


  }

  initializeGeocoder() {
    const geocoder = new MapboxGeocoder({
      accessToken: environment.mapbox.accessToken,
      mapboxgl: mapboxgl,
    });
    geocoder.addTo('#geocoder');

    // Add geocoder result to container.
    geocoder.on('result', (e) => {
      var latitude = e.result.center[1];
      var longitude = e.result.center[0];
      var place_name = e.result.place_name;

      this.eventForm.patchValue({
        lat: latitude,
        lng: longitude,
        place_name: place_name,
      });
    });

    // Clear results container when search is cleared.
    geocoder.on('clear', () => {
      this.eventForm.patchValue({
        lat: this.previousLocalization.lat,
        lng: this.previousLocalization.lng,
        place_name: this.previousLocalization.place_name,
      });
    });
  }

  get name() {
    return this.eventForm.get('name');
  }
  get description() {
    return this.eventForm.get('description');
  }
  get organizator() {
    return this.eventForm.get('organizator');
  }
  get date_start() {
    return this.eventForm.get('date_start');
  }
  get date_end() {
    return this.eventForm.get('date_end');
  }
  get place_name() {
    return this.eventForm.get('place_name');
  }
  get tickets() {
    return this.eventForm.get('tickets');
  }

  getCurrentCategory(id: string): void {
    this.categoryService
      .getOne(id)
      .snapshotChanges()
      .pipe(
        map((c) => {
          const categoryData = c.payload.data() as Category;
          const categoryId = c.payload.id;
          return { id: categoryId, ...categoryData };
        })
      )
      .subscribe((data) => {
        this.currentCategory = data;
      });
  }

  getCurrentEvent(id: string): void {
    this.eventService
      .getOne(id)
      .snapshotChanges()
      .pipe(
        map((c) => {
          const eventData = c.payload.data() as Event;
          const eventId = c.payload.id;
          return { id: eventId, ...eventData };
        })
      )
      .subscribe((data) => {
        this.currentEvent = data;
        this.previousImage = data.img!;
        this.previousLocalization.lat = data.lat!;
        this.previousLocalization.lng = data.lng!;
        this.previousLocalization.place_name = data.place_name!;
        this.reservedTickets = data.tickets! - data.ticketsLeft!;

        this.eventForm.patchValue({
          name: data.name,
          description: data.description,
          organizator: data.organizator,
          img: data.img,
          date_start: data.date_start,
          date_end: data.date_end,
          category: data.category,
          tickets: data.tickets,
          lat: data.lat,
          lng: data.lng,
          place_name: data.place_name,
        });

        this.getCurrentCategory(this.currentEvent.category!);
      });
  }

  retrieveCategory(): void {
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

  updateEvent(): void {
    const newTicketsLeft = this.eventForm.value.tickets - this.reservedTickets;
    this.eventForm.patchValue({
      published: false,
      ticketsLeft: newTicketsLeft,
    }); // Ustaw published na false

    if (this.currentEvent.id) {
      this.eventService
        .updateIMG(
          this.currentEvent.id,
          this.eventForm.value,
          this.selectedImageFile
        )
        .then(() => {
          console.log('Wydarzenie zaktualizowane pomyślnie!');
          this.location.back(); // Wróć na poprzednią kartę
        })
        .catch((err) => console.log(err));
    }
  }

  onImageSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const selectedImageFile = event.target.files[0];
      this.selectedImageFile = selectedImageFile;
      this.ng2ImgMaxService
        .resizeImage(selectedImageFile, 900, 506) // 16x9 ratio for 900 width
        .subscribe((result) => {
          this.selectedImageFile = new File([result], selectedImageFile.name, {
            type: result.type,
          });
          console.log('skalowanie obrazu');
        });
      //previev zdjecia
      const reader = new FileReader();
      reader.onload = () => {
        this.imageURL = reader.result as string;
      };
      reader.readAsDataURL(selectedImageFile);
    }
  }

  isDateEndInvalid(): boolean {
    const today = new Date();

    const dateEnd = this.eventForm.get('date_end')?.value;
    return new Date(dateEnd) < today;
  }
}
