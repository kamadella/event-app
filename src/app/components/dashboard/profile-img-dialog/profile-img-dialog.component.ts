import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Ng2ImgMaxService } from 'ng2-img-max';


@Component({
  selector: 'app-profile-img-dialog',
  templateUrl: './profile-img-dialog.component.html',
  styleUrls: ['./profile-img-dialog.component.css']
})
export class ProfileIMGDialogComponent {
  selectedProfileImage: File | null = null;

  constructor(
    public dialogRef: MatDialogRef<ProfileIMGDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ng2ImgMaxService: Ng2ImgMaxService

  ) {}

      // Metoda wywoływana po wybraniu obrazka przez użytkownika
      onImageSelected(event: any): void {
        if (event.target.files && event.target.files.length > 0) {
          const selectedImage = event.target.files[0];
          const imageSizeLimit = 3 * 1024 * 1024; // Przykładowy limit wielkości obrazka (3 MB)
/*
          if (selectedImage.size > imageSizeLimit) {
            alert('Zdjęcie jest za duże. Maksymalny rozmiar to 3MB.');

            this.selectedProfileImage = null; // Wyczyść wybrany plik
            event.target.value = null; // Wyczyść pole input typu plik

          } else {
            this.selectedProfileImage = selectedImage;
          }
*/
          this.selectedProfileImage = selectedImage;
          this.ng2ImgMaxService
          .resizeImage(selectedImage, 200, 200) // 16x9 ratio for 900 width
          .subscribe((result) => {
            this.selectedProfileImage = new File([result], selectedImage.name, { type: result.type });
            console.log("skalowanie obrazu");

          });
        }
      }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
