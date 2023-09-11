import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// Firebase services + environment module
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe } from '@angular/common';
import { EventPageComponent } from './components/event-page/event-page.component';
import { AddEventComponent } from './components/add-event/add-event.component';
import { EventsListComponent } from './components/events-list/events-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRadioModule } from '@angular/material/radio';
import { CategoryComponent } from './components/category/category.component';
import { MapComponent } from './map/map.component';
import { EventCardComponent } from './components/event-card/event-card.component';

import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';


import { MapDialogContentComponent } from './map/map-dialog-content/map-dialog-content.component';
import { AdminEventsToPublishComponent } from './components/admin-events-to-publish/admin-events-to-publish.component';
import { AddCommentComponent } from './components/add-comment/add-comment.component';
import { CommentsListComponent } from './components/comments-list/comments-list.component';
import { EditEventComponent } from './components/edit-event/edit-event.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserNavbarComponent } from './layouts/user-navbar/user-navbar.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { EventsArchiveComponent } from './components/events-archive/events-archive.component';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { SearchFilterComponent } from './components/events-list/search-filter/search-filter.component';
import { SearchFilterArchiveComponent } from './components/events-archive/search-filter-archive/search-filter-archive.component';
import { ContactComponent } from './components/contact/contact.component';
import { ProfileIMGDialogComponent } from './components/dashboard/profile-img-dialog/profile-img-dialog.component';
import { DisplayNameDialogComponent } from './components/dashboard/display-name-dialog/display-name-dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';

import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
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
    VerifyEmailComponent,
    DashboardComponent,
    UserNavbarComponent,
    UserLayoutComponent,
    TicketComponent,
    TicketListComponent,
    EventsArchiveComponent,
    LoginDialogComponent,
    FooterComponent,
    SearchFilterComponent,
    SearchFilterArchiveComponent,
    ContactComponent,
    ProfileIMGDialogComponent,
    DisplayNameDialogComponent,
    ConfirmDialogComponent,
    AlertDialogComponent
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
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    BrowserAnimationsModule, // for firestore
    MatRadioModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatDialogModule,
    MatExpansionModule,
    BrowserModule,
    MatDatepickerModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
