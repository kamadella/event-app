import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEventsToPublishComponent } from './admin-events-to-publish.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment'

describe('AdminEventsToPublishComponent', () => {
  let component: AdminEventsToPublishComponent;
  let fixture: ComponentFixture<AdminEventsToPublishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminEventsToPublishComponent ],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEventsToPublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
