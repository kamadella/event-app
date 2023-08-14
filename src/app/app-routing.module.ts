import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventPageComponent } from './components/event-page/event-page.component';
import { EventsListComponent } from './components/events-list/events-list.component';
import { AddEventComponent } from './components/add-event/add-event.component';
import { CategoryComponent } from './components/category/category.component';
import { MapComponent } from './map/map.component';
import { AdminEventsToPublishComponent } from './components/admin-events-to-publish/admin-events-to-publish.component';
import { EditEventComponent } from './components/edit-event/edit-event.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';

const routes: Routes = [
  { path: '', component: EventsListComponent },
  { path: 'event/:id', component: EventPageComponent },
  { path: 'events-list', component: EventsListComponent },
  { path: 'add-event', component: AddEventComponent },
  { path: 'map', component: MapComponent },
  { path: 'admin/category', component: CategoryComponent },
  { path: 'admin/events', component: AdminEventsToPublishComponent },
  { path: 'admin/event/edit/:id', component: EditEventComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'register-user', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email-address', component: VerifyEmailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
