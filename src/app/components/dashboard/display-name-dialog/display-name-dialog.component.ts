import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-display-name-dialog',
  templateUrl: './display-name-dialog.component.html',
  styleUrls: ['./display-name-dialog.component.css']
})
export class DisplayNameDialogComponent  {
  displayName: string = '';

  constructor(
    public dialogRef: MatDialogRef<DisplayNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }



}
