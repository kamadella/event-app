import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { JsonPipe } from '@angular/common';
import { CalendarComponent } from './home/calendar/calendar.component';
import { environment } from '../environments/environment';
import { EventPageComponent } from './components/event-page/event-page.component';
import { AddEventComponent } from './components/add-event/add-event.component';
import { EventsListComponent } from './components/events-list/events-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatRadioModule} from '@angular/material/radio';
import { CategoryComponent } from './components/category/category.component';
import { MapComponent } from './map/map.component';
import { EventCardComponent } from './components/events-list/event-card/event-card.component';

import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';


import { MapDialogContentComponent } from './map/map-dialog-content/map-dialog-content.component';
import { AdminEventsToPublishComponent } from './components/admin-events-to-publish/admin-events-to-publish.component';
import { AddCommentComponent } from './components/add-comment/add-comment.component';
import { CommentsListComponent } from './components/comments-list/comments-list.component';
import { EditEventComponent } from './components/edit-event/edit-event.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    CalendarComponent,
    EventPageComponent,
    AddEventComponent,
    EventsListComponent,
    CategoryComponent,
    MapComponent,
    EventCardComponent,
    MapDialogContentComponent,
    AdminEventsToPublishComponent,
    AddCommentComponent,
    CommentsListComponent,
    EditEventComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BrowserAnimationsModule, // for firestore
    MatRadioModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
