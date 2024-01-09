import { environment } from '../../environments/environment';
import { Component, OnInit, Input } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { EventService } from 'src/app/services/event.service';
import { map } from 'rxjs/operators';
import { Event } from 'src/app/models/event.model';
import { MatDialog } from '@angular/material/dialog';
import { MapDialogContentComponent } from './map-dialog-content/map-dialog-content.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat: number = 53.1322;
  lng: number = 23.1687;
  events?: Event[];
  @Input() centerEvent: Event | undefined;
  @Input() hideSideBar: boolean = false;

  constructor(private eventService: EventService, public dialog: MatDialog) {}

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.retrieveEvents();
      this.initializeMap();
    }, 50);
  }

  initializeMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      zoom: 11,
      center: [this.lng, this.lat],
    });

    this.map.addControl(
      new MapboxGeocoder({
        accessToken: environment.mapbox.accessToken,
        countries: 'pl',
        mapboxgl: mapboxgl,
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
        zoom: 14,
      });
    }
  }

  retrieveMarkers(): void {
    this.events
      ?.filter((e) => e.lng !== undefined && e.lat !== undefined)
      .forEach((e) => {
        const marker = new mapboxgl.Marker()
          .setLngLat([e.lng!, e.lat!])
          .addTo(this.map!);
        marker.getElement().addEventListener('click', () => {
          this.openDialog(e);
        });
      });
  }

  openDialog(event: Event) {
    this.dialog.open(MapDialogContentComponent, {
      width: '500px',
      data: event,
    });
  }

  retrieveEvents(): void {
    this.eventService
      .getFilteredEvents()
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
        this.events = data;
        this.retrieveMarkers();
      });
  }

  flyToStore(event: Event): void {
    this.map!.flyTo({
      center: [event.lng!, event.lat!],
      zoom: 13,
    });
  }
}
