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


@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {
  categoriess?: Category[];
  event: Event = new Event();
  submitted = false;
  categories: string[] = ['kat1', 'kat2', 'kat3', 'kat4'];

  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat: number = 53.1322;
  lng: number = 23.1687;

  constructor(private eventService: EventService, private categoryService: CategoryService, private router: Router) { }

  ngOnInit(): void {
    this.retrieveCategory();
    const geocoder = new MapboxGeocoder({
      accessToken: environment.mapbox.accessToken,
      types: 'country,place,postcode,locality,neighborhood,address',
      mapboxgl: mapboxgl
    });

    geocoder.addTo('#geocoder');

    // Add geocoder result to container.
    geocoder.on('result', (e) => {
      var latitude = e.result.center[1];
      var longitude = e.result.center[0];
      var place_name = e.result.place_name;
      console.log(place_name);

      this.event.lat = latitude;
      this.event.lng = longitude;
      this.event.place_name = place_name;
      });

    // Clear results container when search is cleared.
    geocoder.on('clear', () => {
      this.event.lat = undefined;
      this.event.lng = undefined;
    });
  }

  saveEvent(): void {
    this.event.published = false;


    if(confirm("Czy na pewno chcesz dodać nowe wydarzenie? ")){
      this.eventService.create(this.event).then(() => {
        console.log('Created new item successfully!');
        this.submitted = true;
      });

      this.router.navigate(['/events']);
    }


  }

  newEvent(): void {
    this.submitted = false;
    this.event = new Event();
  }

  retrieveCategory(): void {
    this.categoryService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.categoriess = data;
    });
  }


}
