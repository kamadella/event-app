import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsArchiveComponent } from './events-archive.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment'

describe('EventsArchiveComponent', () => {
  let component: EventsArchiveComponent;
  let fixture: ComponentFixture<EventsArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventsArchiveComponent ],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
