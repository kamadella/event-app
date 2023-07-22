import { environment } from '../../environments/environment';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';


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

  constructor() { }

  ngOnInit() {
    this.map = new mapboxgl.Map({
       accessToken: environment.mapbox.accessToken,
       container: 'map',
       style: this.style,
       zoom: 13,
       center: [this.lng, this.lat]
     });
 }

}
