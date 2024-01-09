import { Injectable, NgZone } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/components/dialogs/alert-dialog/alert-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    private storage: AngularFireStorage,
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
              role: userData.get('role'),
              likedEvents: userData.get('likedEvents'),
            };

            this.setUserDataInLocalStorage(userWithRole);
            this.SetUserData(userWithRole);

            if (result.user!.emailVerified) {
              this.router.navigate(['events/list']);
            } else {
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
    if (password !== confirmPassword) {
      this.showAlertDialog('Passwords do not match.');
      return;
    }
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {

        this.SendVerificationMail();

        return result.user
          ?.updateProfile({
            displayName: displayName,
            photoURL:
              'https://firebasestorage.googleapis.com/v0/b/event-app-4eaf2.appspot.com/o/userProfileImages%2Fdefault_img.jpg?alt=media&token=fc0e9ead-7c55-4121-9790-8e4823a0aa10',
          })
          .then(() => {
            this.SetUserData(result.user);
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

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }


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
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      likedEvents: user.likedEvents || [],
      role: user.role || "user",
    };

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
      this.userData = null;
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
            this.userData.displayName = newDisplayName;
            localStorage.setItem('user', JSON.stringify(this.userData));
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
              this.userData.photoURL = downloadURL;
              localStorage.setItem('user', JSON.stringify(this.userData));

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

  private updateUser(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    return userRef.update({ likedEvents: user.likedEvents })
      .then(() => {
        userRef.get().subscribe((userData) => {
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
      });
  }


}
