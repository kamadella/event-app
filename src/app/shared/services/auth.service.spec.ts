import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment'
import { MatDialogModule } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertDialogComponent } from 'src/app/components/alert-dialog/alert-dialog.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; // Dodaj AngularFireAuthModule
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        MatDialogModule,
        NoopAnimationsModule
      ],
      providers: [
        AngularFireAuth,
        AuthService
      ],
      declarations: [AlertDialogComponent], // Dodajemy AlertDialogComponent do deklaracji

    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sign up with valid credentials', async  () => {
    try {
      await service.SignUp("example@gmail.com", "password", "exampletest");
      // Jeśli nie został rzucony błąd, to logowanie powiodło się
      expect(true).toBeTruthy();
    } catch (error) {
      // W przypadku błędu logowania, oczekuj że nie będzie błędu
      expect(false).toBeTruthy();
    }
  });
/*
  it('should sign in with valid credentials', async  () => {
    try {
      await service.SignIn('example@gmail.com', 'password');
      // Jeśli nie został rzucony błąd, to logowanie powiodło się
      expect(true).toBeTruthy();
    } catch (error) {
      // W przypadku błędu logowania, oczekuj że nie będzie błędu
      expect(false).toBeTruthy();
    }
  });
*/


});
