import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventComponent } from './add-event.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { ReactiveFormsModule } from '@angular/forms';

describe('AddEventComponent', () => {
  let component: AddEventComponent;
  let fixture: ComponentFixture<AddEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventComponent ],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        MatDialogModule,
        ReactiveFormsModule,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
