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


@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {
  message = '';
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

  constructor(private route: ActivatedRoute,private eventService: EventService, private categoryService: CategoryService, private router: Router) { }

  ngOnInit(): void {
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
      console.log(place_name);

      this.currentEvent.lat = latitude;
      this.currentEvent.lng = longitude;
      this.currentEvent.place_name = place_name;
      });

    // Clear results container when search is cleared.
    geocoder.on('clear', () => {
      this.currentEvent.lat = this.previousLocalization.lat;
      this.currentEvent.lng =  this.previousLocalization.lng;
      this.currentEvent.place_name =  this.previousLocalization.place_name;
    });

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
    const data = {
      name: this.currentEvent.name,
      description: this.currentEvent.description,
      lat:  this.currentEvent.lat,
      lng: this.currentEvent.lng,
      place_name: this.currentEvent.place_name,
      organizator: this.currentEvent.organizator,
      img: this.currentEvent.img,
      date_start: this.currentEvent.date_start,
      date_end: this.currentEvent.date_end,
      category: this.currentEvent.category,
      tickets: this.currentEvent.tickets,
      published: false
    };

    if (this.currentEvent.id) {
      this.eventService.update(this.currentEvent.id, data)
        .then(() => this.message = 'The tutorial was updated successfully!')
        .catch(err => console.log(err));
    }
    this.router.navigate(['/admin/events']);
  }

}
