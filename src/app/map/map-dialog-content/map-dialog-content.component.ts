import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-map-dialog-content',
  templateUrl: './map-dialog-content.component.html',
  styleUrls: ['./map-dialog-content.component.css']
})
export class MapDialogContentComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public event: any) { }

}
