import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
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
    private storage: AngularFireStorage, // Wstrzyknięcie AngularFireStorage
    private dialog: MatDialog
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user && !this.userData) {
        this.loadUserData(user);
      } else {
        this.clearUserData();
      }
    });
  }

  private loadUserData(user: any) {
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
        };
        if (userWithRole.emailVerified) {
          this.setUserData(userWithRole);
          this.router.navigate(['events/list']);
        } else {
          this.signOut();
          this.showAlertDialog('Twój email nie jest zweryfikowany. Sprawdź skrzynkę odbiorczą i zweryfikuj swój email, aby się zalogować.');
        }
      });
  }

  private setUserData(user: any) {
    this.userData = user;
    localStorage.setItem('user', JSON.stringify(this.userData));
  }

  private clearUserData() {
    localStorage.setItem('user', 'null');
  }

  // Sign in with email/password
  signIn(email: string, password: string) {
    return this.afAuth
    .signInWithEmailAndPassword(email, password)
    .then((result) => {
      this.loadUserData(result.user!);
    })
    .catch((error) => {
      this.showAlertDialog(error.message);
    });
  }

  // Sign up with email/password
  signUp(email: string, password: string, displayName: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        this.sendVerificationMail();

        // Ustawienie nazwy użytkownika (displayName)
        return result.user
          ?.updateProfile({
            displayName: displayName,
            photoURL:
              'https://firebasestorage.googleapis.com/v0/b/event-app-4eaf2.appspot.com/o/userProfileImages%2Fdefault_img.jpg?alt=media&token=fc0e9ead-7c55-4121-9790-8e4823a0aa10',
          })
          .then(() => {
            this.setUserData(result.user);
            this.updateUserRole(result.user!.uid, 'user');
          });
      })
      .catch((error) => {
        this.showAlertDialog(error.message);
      });
  }

  updateUserRole(uid: string, role: string): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
    return userRef.update({ role: role });
  }

  // Send email verfificaiton when new user sign up
  sendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      }).catch((error)=> {
        this.showAlertDialog(error.message);
      });
  }

  // Reset Forggot password
  forgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        this.showAlertDialog('Email z linkiem resetującym haslo zostal wysłany. Sprawdż swój mail');
      })
      .catch((error) => {
        this.showAlertDialog(error.message);
      });
  }

  showAlertDialog(error: string){
    this.dialog.open(AlertDialogComponent, {
      width: '400px',
      data: error,
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




  // Sign out
  signOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.userData = null; // Ustawienie userData na null lub inny początkowy stan
      this.router.navigate(['sign-in']);
    });
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
}
