import { environment } from '../../environments/environment';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  constructor(private eventService: EventService, public dialog: MatDialog) { }

  ngOnInit() {
    this.retrieveEvents();
    this.map = new mapboxgl.Map({
       accessToken: environment.mapbox.accessToken,
       container: 'map',
       style: this.style,
       zoom: 13,
       center: [this.lng, this.lat]
     });
     this.map.addControl(
        new MapboxGeocoder({
        accessToken: environment.mapbox.accessToken,
        mapboxgl: mapboxgl
      })
      );
  }

  retrieveMarkers(): void {
    this.events?.filter(e => e.lng !== undefined && e.lat !== undefined)
      .forEach(e => {
        // create MapBox Marker
        const marker = new mapboxgl.Marker().setLngLat([e.lng! , e.lat!]).addTo(this.map!);
        // use GetElement to get HTML Element from marker and add event
        marker.getElement().addEventListener('click', () => {
          this.openDialog(e);
        });
      });
  }

  openDialog(e: Event) {
    const dialogRef = this.dialog.open(MapDialogContentComponent, {data: e,});

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
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
        this.events = data;
        this.retrieveMarkers();
      });
   }

}
