import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpComponent } from './sign-up.component';
import { AuthService } from '../../shared/services/auth.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { MatDialogModule } from '@angular/material/dialog';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignUpComponent ],
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

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
