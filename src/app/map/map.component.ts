import { environment } from '../../environments/environment';
import { Component, OnInit, Input } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { EventService } from 'src/app/services/event.service';
import { map } from 'rxjs/operators';
import { Event } from 'src/app/models/event.model';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MapDialogContentComponent } from './map-dialog-content/map-dialog-content.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat: number = 53.1322;
  lng: number = 23.1687;
  events?: Event[];
  @Input() centerEvent: Event | undefined; // Nowy input


  constructor(private eventService: EventService, public dialog: MatDialog) { }

  ngOnInit() {
    this.retrieveEvents();
    this.map = new mapboxgl.Map({
       accessToken: environment.mapbox.accessToken,
       container: 'map',
       style: this.style,
       zoom: 11,
       center: [this.lng, this.lat]
     });
     this.map.addControl(
        new MapboxGeocoder({
        accessToken: environment.mapbox.accessToken,
        mapboxgl: mapboxgl
      })
      );

      if (this.centerEvent) {
        this.centerMapOnEvent(this.centerEvent);
      }

  }

  centerMapOnEvent(event: Event): void {
    if (this.map) {
      this.map.flyTo({
        center: [event.lng!, event.lat!],
        zoom: 13
      });
    }
  }

  retrieveMarkers(): void {
    this.events?.filter(e => e.lng !== undefined && e.lat !== undefined)
      .forEach(e => {
        // create MapBox Marker
        const marker = new mapboxgl.Marker().setLngLat([e.lng! , e.lat!]).addTo(this.map!);
        // use GetElement to get HTML Element from marker and add event
        marker.getElement().addEventListener('click', () => {
          //this.createPopUp(e);
          this.openDialog(e);
        });
      });
  }

  openDialog(e: Event) {
    const dialogRef = this.dialog.open(MapDialogContentComponent, {data: e,});

    dialogRef.afterClosed().subscribe(result => {
    });
  }


  retrieveEvents(): void {
    this.eventService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
      ).subscribe(data => {
        const currentDate = new Date();
        this.events = data.filter(event =>
          event.published === true && (event.date_end ? new Date(event.date_end) > currentDate : false)
        );
        this.retrieveMarkers();
      });
  }



  flyToStore(event: Event) : void{
    this.map!.flyTo({
      center: [event.lng!, event.lat!],
      zoom: 13
    });
  }


  createPopUp(event: Event) {
    const popUps = document.getElementsByClassName('mapboxgl-popup');
    /** Check if there is already a popup on the map and if so, remove it */
    if (popUps[0]) popUps[0].remove();

    const popup = new mapboxgl.Popup({ closeOnClick: true })
    .setLngLat([event.lng!, event.lat!])
    .setHTML(`

      <button class="btn-open-dialog btn btn-primary">Informacje</button>
    `)
    .addTo(this.map!);

    // Get the popup's content element
    const popupContent = popup.getElement();

    // Attach a click event listener to the button using event delegation
    popupContent.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('btn-open-dialog')) {
        this.openDialog(event);
      }
    });

  }

}
