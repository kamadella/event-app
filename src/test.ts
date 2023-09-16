// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
// Import Firebase modules and initialize Firebase
import { FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getApps, initializeApp } from 'firebase/app';
import {
  connectFirestoreEmulator,
  Firestore,
  getFirestore,
} from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { connectAuthEmulator, getAuth } from 'firebase/auth';

import { environment } from './environments/environment';

declare const require: {
  context(
    path: string,
    deep?: boolean,
    filter?: RegExp
  ): {
    <T>(id: string): T;
    keys(): string[];
  };
};

// Initialize Firebase app only if using emulators
if (environment.useEmulators) {
  const firebaseConfig: FirebaseOptions = {
    apiKey: 'AIzaSyD4AgmzVggFzpuKJRQDVe6lersSw9LFj_8',
    authDomain: 'event-app-4eaf2.firebaseapp.com',
    projectId: 'event-app-4eaf2',
    storageBucket: 'event-app-4eaf2.appspot.com',
    messagingSenderId: '242618419210',
    appId: '1:242618419210:web:ff6c1da8085da8bd3677f3',
    measurementId: 'G-FNMGPE6R7C',
  };

  const app = initializeApp(firebaseConfig);

  // Połącz się z emulatorem Firebase Auth
  const auth = getAuth(app);
  connectAuthEmulator(auth, 'http://localhost:9099'); // Dostosuj adres i port emulatora

  // Connect to Firestore emulator
  const firestore = getFirestore(app);
  connectFirestoreEmulator(firestore, 'http://localhost', 8080);

  // Connect to Storage emulator
  const storage = getStorage(app);
  connectStorageEmulator(storage, 'localhost', 9199);
}

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().forEach(context);
