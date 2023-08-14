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


@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {
  eventForm!: FormGroup;

  eventId:string = "-1";
  currentEvent: Event = {};
  previousLocalization = {
    lat: 0,
    lng: 0,
    place_name: '',
  };
  currentCategory: Category = {};
  categories?: Category[];

  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat: number = 53.1322;
  lng: number = 23.1687;

  constructor(private route: ActivatedRoute,private eventService: EventService, private categoryService: CategoryService, private router: Router, public fb: FormBuilder) { }

  ngOnInit(): void {
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

    this.route.params.subscribe( params=> this.eventId = params['id']);
    this.getCurrentEvent(this.eventId);
    this.retrieveCategory();




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
      this.eventForm.patchValue({
        lat: this.previousLocalization.lat,
        lng: this.previousLocalization.lng,
        place_name: this.previousLocalization.place_name
      });
    });

    console.log( this.eventForm.value);
    console.log( this.eventForm.value.name);


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

  getCurrentCategory(id: string) : void{
    this.categoryService.getOne(id).snapshotChanges().pipe(
      map(c =>{
        const categoryData = c.payload.data() as Category;
        const categoryId = c.payload.id;
        return { id: categoryId, ...categoryData };
  })
    ).subscribe(data => {
      this.currentCategory = data;
    });
  }


  getCurrentEvent(id: string) : void{
    this.eventService.getOne(id).snapshotChanges().pipe(
      map(c =>{
        const eventData = c.payload.data() as Event;
        const eventId = c.payload.id;
        return { id: eventId, ...eventData };
  })
    ).subscribe(data => {
      this.currentEvent = data;

      this.previousLocalization.lat = data.lat!;
      this.previousLocalization.lng = data.lng!;
      this.previousLocalization.place_name = data.place_name!;

      this.eventForm.patchValue({
        name: data.name,
        description: data.description,
        organizator:data.organizator,
        img: data.img,
        date_start:data.date_start,
        date_end: data.date_end,
        category: data.category,
        tickets: data.tickets,
        lat: data.lat,
        lng: data.lng,
        place_name: data.place_name
      });

      this.getCurrentCategory(this.currentEvent.category!);
    });
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

  updateEvent(): void {
    this.eventForm.patchValue({ published: false }); // Set published to false

    if (this.currentEvent.id) {
      this.eventService.update(this.currentEvent.id, this.eventForm.value)
        .catch(err => console.log(err));
    }
    this.router.navigate(['/admin/events']);

  }


}
