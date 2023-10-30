import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { map } from 'rxjs/operators';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css'],
})
export class AddEventComponent implements OnInit {
  eventForm!: FormGroup;
  categories?: Category[];

  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat: number = 53.1322;
  lng: number = 23.1687;

  selectedImageFile: File | null = null;
  addingEvent: boolean = false;
  imageURL: string = '';
  minDate?: Date;
  maxDate?: Date;

  constructor(
    private eventService: EventService,
    private categoryService: CategoryService,
    private router: Router,
    public fb: FormBuilder,
    private ng2ImgMaxService: Ng2ImgMaxService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.retrieveCategory();
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
      organizator: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
      date_start: ['', [Validators.required]],
      date_end: ['', [Validators.required]],
      category: ['', [Validators.required]],
      tickets: ['', [Validators.max(100000)]],
      ticketsLeft: [''],
      img: ['', [Validators.required]],
      lat: ['', [Validators.required]],
      lng: ['', [Validators.required]],
      place_name: ['', [Validators.required]],
      published: [''],
      createdAt: ['']
    });

    this.initializeGeocoder();

    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 2, 0, 1, 0, 0, 0); // 2 lata temu
    this.maxDate = new Date(currentYear + 2, 11, 31, 23, 59, 59); // Za 2 lata
  }

  initializeGeocoder() {
    const geocoder = new MapboxGeocoder({
      accessToken: environment.mapbox.accessToken,
      mapboxgl: mapboxgl,
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
        place_name: place_name,
      });
    });
  }

  get name() {
    return this.eventForm.get('name');
  }

  get description() {
    return this.eventForm.get('description');
  }

  get tickets() {
    return this.eventForm.get('tickets');
  }

  get organizator() {
    return this.eventForm.get('organizator');
  }

  get date_start() {
    return this.eventForm.get('date_start');
  }

  get date_end() {
    return this.eventForm.get('date_end');
  }

  get place_name() {
    return this.eventForm.get('place_name');
  }

  onImageSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const selectedImageFile = event.target.files[0];

      // Sprawdź, czy plik jest obrazkiem
    if (selectedImageFile.type.startsWith('image/')) {
      // Kontynuuj przetwarzanie tylko dla plików obrazków
      this.selectedImageFile = selectedImageFile;

      this.ng2ImgMaxService
        .resizeImage(selectedImageFile, 900, 506)
        .subscribe((result) => {
          this.selectedImageFile = new File([result], selectedImageFile.name, { type: result.type });
          console.log("skalowanie obrazu");
        });

      // Preview zdjęcia
      const reader = new FileReader();
      reader.onload = () => {
        this.imageURL = reader.result as string;
      };
      reader.readAsDataURL(selectedImageFile);
    } else {
      // Wyświetl komunikat w przypadku nieprawidłowego formatu pliku
      this.dialog.open(AlertDialogComponent, {
        width: '400px',
        data: 'Wybrany plik nie jest obrazkiem.'
      });
    }
    }
  }

  saveEvent(): void {
    this.eventForm.value.published = false;

    if (this.eventForm.value.tickets == '' || this.eventForm.value.tickets == null) {
      this.eventForm.value.tickets = 0;
    }

    this.eventForm.value.ticketsLeft = this.eventForm.value.tickets;
    this.eventForm.value.createdAt = new Date();
    this.addingEvent = true;

    // Zamień znaki nowej linii w opisie na znaczniki HTML <br>
    this.eventForm.value.description = this.eventForm.value.description.replace(/\n/g, '<br>');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: 'Czy na pewno chcesz dodać nowe wydarzenie?',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Użytkownik kliknął "OK" w potwierdzeniu
        this.eventService
          .create(this.eventForm.value, this.selectedImageFile!)
          .then(() => {
            this.dialog.open(AlertDialogComponent, {
              width: '400px',
              data: 'udało ci sie dodać nowe wydarznie, poczekaj na potwierdzenie przez Admina',
            });
            this.router.navigate(['/events/list']);
          })
          .finally(() => {
            this.addingEvent = false; // Odblokowanie przycisku po zakończeniu procesu
          });
      } else {
        // Użytkownik kliknął "Anuluj" lub zamknął dialog
        this.addingEvent = false; // Odblokowanie przycisku po zakończeniu procesu
      }
    });
  }

  retrieveCategory(): void {
    this.categoryService
      .getAll()
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
        this.categories = data;
      });
  }


  isDateEndInvalid(): boolean {
    const today = new Date();
    const dateEnd = this.eventForm.get('date_end')?.value;
    return new Date(dateEnd) < today;
  }

  isDateInRange(date: Date): boolean {
    const dateTyped = new Date(date);
    if(this.minDate &&  this.maxDate){
      return dateTyped >= this.minDate && dateTyped <= this.maxDate;
    }
    else
      return false;
  }
}
