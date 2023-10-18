import { Injectable, NgZone } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage'; // Import AngularFireStorage
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/components/alert-dialog/alert-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private storage: AngularFireStorage, // Wstrzyknięcie AngularFireStorage
    private dialog: MatDialog
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.afs
          .doc(`users/${user.uid}`)
          .get()
          .subscribe((userData) => {
            const userWithRole = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              emailVerified: user.emailVerified,
              role: userData.get('role'),
              likedEvents: userData.get('likedEvents'),
            };
            this.setUserDataInLocalStorage(userWithRole);
          });

      } else {
        this.clearUserData();
      }

    });
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.afs
          .doc(`users/${result.user!.uid}`)
          .get()
          .subscribe((userData) => {
            const userWithRole = {
              uid: result.user!.uid,
              email: result.user!.email,
              displayName: result.user!.displayName,
              photoURL: result.user!.photoURL,
              emailVerified: result.user!.emailVerified,
              role: userData.get('role'), // Pobranie roli z bazy danych
              likedEvents: userData.get('likedEvents'),
            };

            this.setUserDataInLocalStorage(userWithRole);
            this.SetUserData(userWithRole);

            if (result.user!.emailVerified) {
              // Jeśli adres e-mail jest zweryfikowany, przekieruj na stronę 'events/list'
              this.router.navigate(['events/list']);
            } else {
              // Jeśli adres e-mail nie jest zweryfikowany, wyświetl informację użytkownikowi
              this.showAlertDialog(
                'Adres e-mail nie został zweryfikowany. Proszę sprawdź swoją skrzynkę odbiorczą.'
              );
            }
          });
      })
      .catch((error) => {
        this.showAlertDialog(error.message);
      });
  }

  // Sign up with email/password
  SignUp(
    email: string,
    password: string,
    displayName: string,
    confirmPassword: string
  ) {
    // Check if passwords match
    if (password !== confirmPassword) {
      this.showAlertDialog('Passwords do not match.');
      return;
    }
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        this.SendVerificationMail();

        // Ustawienie nazwy użytkownika (displayName)
        return result.user
          ?.updateProfile({
            displayName: displayName,
            photoURL:
              'https://firebasestorage.googleapis.com/v0/b/event-app-4eaf2.appspot.com/o/userProfileImages%2Fdefault_img.jpg?alt=media&token=fc0e9ead-7c55-4121-9790-8e4823a0aa10',
          })
          .then(() => {
            this.SetUserData(result.user);
            //this.UpdateUserRole(result.user!.uid, 'user');
          });
      })
      .catch((error) => {
        this.showAlertDialog(error.message);
      });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        this.showAlertDialog(
          'Email z linkiem resetującym haslo zostal wysłany. Sprawdż swój mail'
        );
      })
      .catch((error) => {
        this.showAlertDialog(error.message);
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  // W serwisie AuthService
  // Sprawdź, czy użytkownik ma określoną rolę
  get isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.role === 'admin';
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    // Sprawdź, czy pole role istnieje w obiekcie user
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      likedEvents: user.likedEvents || [],
      role: user.role || "user",
    };

    console.log('userData before set/update:', userData);

    return userRef.set(userData, {
      merge: true,
    });
  }

  UpdateUserRole(uid: string, role: string): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
    return userRef.update({ role: role });
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.userData = null; // Ustawienie userData na null lub inny początkowy stan
      this.router.navigate(['sign-in']);
    });
  }

  showAlertDialog(message: string) {
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: message,
    });
  }

  private setUserDataInLocalStorage(user: any) {
    this.userData = user;
    localStorage.setItem('user', JSON.stringify(this.userData));
  }

  private clearUserData() {
    localStorage.setItem('user', 'null');
    JSON.parse(localStorage.getItem('user')!);
  }

  // Pobierz identyfikator użytkownika
  getUserId(): string {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user ? user.uid : '';
  }

  updateDisplayName(newDisplayName: string) {
    const user = this.afAuth.currentUser;

    if (user) {
      return user.then((result) => {
        return result!
          .updateProfile({ displayName: newDisplayName })
          .then(() => {
            // Aktualizacja danych użytkownika w local storage
            this.userData.displayName = newDisplayName;
            localStorage.setItem('user', JSON.stringify(this.userData));
            // Aktualizacja nazwy użytkownika w bazie danych Firestore
            return this.afs
              .doc(`users/${result!.uid}`)
              .update({ displayName: newDisplayName });
          });
      });
    } else {
      return Promise.reject('Nie można znaleźć zalogowanego użytkownika.');
    }
  }

  updateProfileImage(newImageFile: File) {
    const user = this.afAuth.currentUser;

    if (user) {
      return user.then((result) => {
        return this.uploadImageToStorage(result!.uid, newImageFile).then(
          (downloadURL) => {
            return result!.updateProfile({ photoURL: downloadURL }).then(() => {
              // Aktualizacja danych użytkownika w local storage
              this.userData.photoURL = downloadURL;
              localStorage.setItem('user', JSON.stringify(this.userData));

              // Nie jest już potrzebna aktualizacja URL obrazka w bazie danych Firestore,
              // ponieważ Firebase Authentication już przechowuje URL obrazka profilowego.
              // Możesz go pobrać bezpośrednio z obiektu użytkownika.

              return downloadURL;
            });
          }
        );
      });
    } else {
      return Promise.reject('Nie można znaleźć zalogowanego użytkownika.');
    }
  }

  private uploadImageToStorage(
    userId: string,
    imageFile: File
  ): Promise<string> {
    const storageRef = this.storage.ref(`userProfileImages/${userId}`);
    const uploadTask = storageRef.put(imageFile);

    return uploadTask.task.then(() => {
      return storageRef.getDownloadURL().toPromise();
    });
  }

  // Dodaj wydarzenie do listy polubionych
  addLikedEvent(eventId: string) {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (user) {
      user.likedEvents = user.likedEvents || [];
      if(user.likedEvents.indexOf(eventId) == -1){
        user.likedEvents.push(eventId);
        this.updateUser(user);
      }

    }
  }

  // Usuń wydarzenie z listy polubionych
  removeLikedEvent(eventId: string) {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (user && user.likedEvents) {
      user.likedEvents = user.likedEvents.filter((id: string) => id !== eventId);
      this.updateUser(user);
    }
  }

  isEventLiked(eventId: string): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);

    if (user && user.likedEvents) {
      return user.likedEvents.includes(eventId);
    }

    return false;
  }

  // Aktualizuj dokument użytkownika w bazie danych Firestore
  private updateUser(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    return userRef.update({ likedEvents: user.likedEvents })
      .then(() => {
        // Update local storage after Firestore update
        localStorage.setItem('user', JSON.stringify(user));
      });
  }


}
