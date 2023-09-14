import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment'
import { MatDialogModule } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertDialogComponent } from 'src/app/components/alert-dialog/alert-dialog.component';
import { RouterTestingModule } from '@angular/router/testing'; // Dodaj RouterTestingModule
import { Router } from '@angular/router'; // Import Router
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; // Dodaj AngularFireAuthModule

describe('AuthService', () => {
  let service: AuthService;
  let router: Router; // Dodaj Router

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        MatDialogModule,
        RouterTestingModule
      ],
      providers: [
        AngularFireAuth,
        AuthService
      ],
      declarations: [AlertDialogComponent], // Dodajemy AlertDialogComponent do deklaracji

    });
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router); // Zainicjuj Router

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('creates an account', async () => {
    const email = "testtest@test.example";
    const password = "password";
    const displayName = "name";
    try {
      const result = await service.SignUp(email, password, displayName);

      // Spodziewamy się, że rezultat zostanie zwrócony i będzie zawierać użytkownika
      expect(result).toBeDefined();

      // Jeśli rezultat istnieje, sprawdź, czy zawiera użytkownika
      if (result) {
        expect(result.user).toBeDefined(); // Upewnij się, że obiekt user jest dostępny

        // Możesz również sprawdzić inne właściwości użytkownika, jeśli to konieczne
        expect(result.user?.email).toBe(email);
        expect(result.user?.displayName).toBe(displayName);
        // itd.
      }

      // Teraz możesz śledzić nawigację i sprawdzić, czy próbowano przekierować na 'verify-email-address'
      const spy = spyOn(router, 'navigateByUrl'); // Śledzenie próby nawigacji

      // Teraz wywołujemy funkcję SendVerificationMail
      await service.SendVerificationMail();

      // Sprawdź próbę nawigacji
      expect(spy).toHaveBeenCalledWith('/verify-email-address');

      // Pobieramy UID użytkownika, który został dodany
      const uid = service.getUserId();

      // Usuwamy dane użytkownika po zakończeniu testu
      await service.deleteUser(uid);
    } catch (error) {
      // W przypadku błędu, wypisz go lub zfailuj test
      fail(`An error occurred: ${error}`);
    }
  });







});
