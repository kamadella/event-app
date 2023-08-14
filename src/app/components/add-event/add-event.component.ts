import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/models/event.model';
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

  constructor(private eventService: EventService, private categoryService: CategoryService, private router: Router, public fb: FormBuilder) { }

  ngOnInit(): void {
    this.retrieveCategory();
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      organizator: [''],
      img: [''],
      date_start: [''],
      date_end: [''],
      category: [''],
      tickets: [''],
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

    // Clear results container when search is cleared.
    geocoder.on('clear', () => {

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
  get img() {
    return this.eventForm.get('img');
  }
  get date_start() {
    return this.eventForm.get('date_start');
  }
  get date_end() {
    return this.eventForm.get('date_end');
  }
  get category() {
    return this.eventForm.get('category');
  }
  get tickets() {
    return this.eventForm.get('tickets');
  }


  saveEvent(): void {
    this.eventForm.patchValue({ published: false }); // Set published to false
    if(confirm("Czy na pewno chcesz dodać nowe wydarzenie? ")){
      this.eventService.create(this.eventForm.value).then(() => {
        console.log('Created new item successfully!');
      });

      this.router.navigate(['/events']);
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
