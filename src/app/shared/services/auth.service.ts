import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any; // Save logged in user data

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user && !this.userData) {
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
            this.userData = userWithRole;
            localStorage.setItem('user', JSON.stringify(this.userData));
            JSON.parse(localStorage.getItem('user')!);
          });
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log("signIN " + result.user?.displayName);
        this.SetUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['events-list']);
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Sign up with email/password
  SignUp(email: string, password: string, displayName: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        this.SendVerificationMail();


        // Ustawienie nazwy użytkownika (displayName)
        return result.user?.updateProfile({
          displayName: displayName
        }).then(() => {
          this.SetUserData(result.user);
          this.UpdateUserRole(result.user!.uid, 'user');
        });
      })
      .catch((error) => {
        window.alert(error.message);
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
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
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
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    console.log( "SetUserData " +user.displayName);
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }

  UpdateUserRole(uid: string, role: string): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);
    return userRef.update({ role: role });
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
        return result!.updateProfile({ displayName: newDisplayName }).then(() => {
          // Aktualizacja danych użytkownika w local storage
          this.userData.displayName = newDisplayName;
          localStorage.setItem('user', JSON.stringify(this.userData));

          // Aktualizacja nazwy użytkownika w bazie danych Firestore
          return this.afs.doc(`users/${result!.uid}`).update({ displayName: newDisplayName });
        });
      });
    } else {
      return Promise.reject('Nie można znaleźć zalogowanego użytkownika.');
    }
  }

}
