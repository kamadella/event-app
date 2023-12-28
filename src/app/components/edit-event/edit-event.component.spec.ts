import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventComponent } from './edit-event.component';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment'
import { ReactiveFormsModule } from '@angular/forms';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatRadioModule } from '@angular/material/radio';
import { of } from 'rxjs';


describe('EditEventComponent', () => {
  let component: EditEventComponent;
  let fixture: ComponentFixture<EditEventComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    const mockActivatedRoute = {
      params: of({ id: 'mock-event-id' }) // Provide a mock event ID
    };

    await TestBed.configureTestingModule({
      declarations: [ EditEventComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        ReactiveFormsModule,
        MatRadioModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
