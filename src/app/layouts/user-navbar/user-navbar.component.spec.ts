import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNavbarComponent } from './user-navbar.component';
// Import AngularFire and AngularFireModule if needed
import { AuthService } from '../../shared/services/auth.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { MatDialogModule } from '@angular/material/dialog';

describe('UserNavbarComponent', () => {
  let component: UserNavbarComponent;
  let fixture: ComponentFixture<UserNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserNavbarComponent ],
      providers: [
        AuthService, // Provide the AuthService here
      ],
      imports: [
        // Import and configure AngularFireModule and AngularFirestoreModule here
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        MatDialogModule,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
