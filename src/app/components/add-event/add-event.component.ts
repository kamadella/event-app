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


@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {
  eventForm!: FormGroup;
  categories?: Category[];

  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat: number = 53.1322;
  lng: number = 23.1687;

  selectedImageFile: File | null = null;


  constructor(private eventService: EventService, private categoryService: CategoryService, private router: Router, public fb: FormBuilder) { }

  ngOnInit(): void {
    this.retrieveCategory();
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      organizator: [''],
      date_start: [''],
      date_end: [''],
      category: [''],
      tickets: [''],
      img: [''],
      lat: [''],         // New form control for latitude
      lng: [''],         // New form control for longitude
      place_name: [''],  // New form control for place_name
      published: [''],
    });


    const geocoder = new MapboxGeocoder({
      accessToken: environment.mapbox.accessToken,
      mapboxgl: mapboxgl
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
        place_name: place_name
      });

    });

  }






  onImageSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedImageFile = event.target.files[0];
    }
  }

  saveEvent(): void {
    this.eventForm.patchValue({ published: false });

    console.log(this.eventForm.value.date_start);

    if (confirm('Czy na pewno chcesz dodać nowe wydarzenie? ')) {
      this.eventService
        .create(this.eventForm.value, this.selectedImageFile!)
        .then(() => {
          console.log('Created new item successfully!');
          this.router.navigate(['/events-list']);
        });
    }

  }




  retrieveCategory(): void {
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


}
