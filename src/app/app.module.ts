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
import { SearchComponent } from './search/search.component';
import { JsonPipe } from '@angular/common';
import { CalendarComponent } from './home/calendar/calendar.component';
import { environment } from '../environments/environment';
import { EventPageComponent } from './event/event-page/event-page.component';
import { AddEventComponent } from './components/add-event/add-event.component';
import { EventsListComponent } from './components/events-list/events-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatRadioModule} from '@angular/material/radio';
import { CategoryComponent } from './components/category/category.component';




@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    SearchComponent,
    CalendarComponent,
    EventPageComponent,
    AddEventComponent,
    EventsListComponent,
    CategoryComponent
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
    MatRadioModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
