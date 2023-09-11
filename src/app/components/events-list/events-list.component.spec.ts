import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsListComponent } from './events-list.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment'

describe('EventsListComponent', () => {
  let component: EventsListComponent;
  let fixture: ComponentFixture<EventsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventsListComponent ],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
