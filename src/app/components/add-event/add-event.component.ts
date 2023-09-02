import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { map } from 'rxjs/operators';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ng2ImgMaxService } from 'ng2-img-max';


@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css'],
})
export class AddEventComponent implements OnInit {
  eventForm!: FormGroup;
  categories?: Category[];

  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat: number = 53.1322;
  lng: number = 23.1687;

  selectedImageFile: File | null = null;

  constructor(
    private eventService: EventService,
    private categoryService: CategoryService,
    private router: Router,
    public fb: FormBuilder,
    private ng2ImgMaxService: Ng2ImgMaxService
  ) {}

  ngOnInit(): void {
    this.retrieveCategory();
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      organizator: ['', [Validators.required, Validators.minLength(3)]],
      date_start: ['', [Validators.required]],
      date_end: ['', [Validators.required]],
      category: [''],
      tickets: [''],
      ticketsLeft: [''],
      img: ['', [Validators.required]],
      lat: [''], // New form control for latitude
      lng: [''], // New form control for longitude
      place_name: ['', [Validators.required]], // New form control for place_name
      published: [''],
      createdAt: ['']
    });

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
  }

  get name() {
    return this.eventForm.get('name');
  }

  get description() {
    return this.eventForm.get('description');
  }

  get tickets() {
    return this.eventForm.get('tickets');
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

  onImageSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const selectedImageFile = event.target.files[0];
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
/*
      if (selectedImageFile.size > maxSizeInBytes) {
        alert('Zdjęcie jest za duże. Maksymalny rozmiar to 5MB.');

        // Wyczyść pole input, jeśli przekroczono limit
        const imgFormControl = this.eventForm.get('img');
        if (imgFormControl) {
          // Sprawdź, czy imgFormControl nie jest null
          imgFormControl.setValue(null);
          imgFormControl.markAsTouched();
        }

        return;
      }
*/
      this.selectedImageFile = selectedImageFile;
      this.ng2ImgMaxService
      .resizeImage(selectedImageFile, 900, 506) // 16x9 ratio for 900 width
      .subscribe((result) => {
        this.selectedImageFile = new File([result], selectedImageFile.name, { type: result.type });
        console.log("skalowanie obrazu");

      });
    }
  }

  saveEvent(): void {
    this.eventForm.value.published = false;

    if (this.eventForm.value.tickets == '') {
      this.eventForm.value.tickets = 0;
    }

    console.log(this.eventForm.value.date_end);


    this.eventForm.value.ticketsLeft = this.eventForm.value.tickets;
    this.eventForm.value.createdAt = new Date();

    if (confirm('Czy na pewno chcesz dodać nowe wydarzenie? ')) {
      this.eventService
        .create(this.eventForm.value, this.selectedImageFile!)
        .then(() => {
          console.log('Created new item successfully!');
          this.router.navigate(['/events/list']);
        });
    }

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


  isDateEndInvalid(): boolean {
    const today = new Date();

    const dateEnd = this.eventForm.get('date_end')?.value;
    return new Date(dateEnd) < today;
  }
}
