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
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { AuthGuard } from './shared/guard/auth.guard';
import { AdminGuard } from './shared/guard/admin.guard';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { EventsArchiveComponent } from './components/events-archive/events-archive.component';


const routes: Routes = [
    {
      path: '', component: UserLayoutComponent,
      children: [
        { path: '', redirectTo: '/events/list', pathMatch: 'full'},
        { path: 'event/:id', component: EventPageComponent },
        { path: 'events/list', component: EventsListComponent },
        { path: 'add-event', component: AddEventComponent, canActivate: [AuthGuard] },
        { path: 'map', component: MapComponent },
        { path: 'sign-in', component: SignInComponent },
        { path: 'register-user', component: SignUpComponent },
        { path: 'forgot-password', component: ForgotPasswordComponent },
        { path: 'verify-email-address', component: VerifyEmailComponent },
        { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
        { path: 'events/archive', component: EventsArchiveComponent },
      ]
    },

    {
      path: 'admin', component: UserLayoutComponent,
      children: [
        { path: '', redirectTo: '/events', pathMatch: 'full'},
        { path: 'category', component: CategoryComponent, canActivate: [AdminGuard] },
        { path: 'events', component: AdminEventsToPublishComponent, canActivate: [AdminGuard] },
        { path: 'event/edit/:id', component: EditEventComponent, canActivate: [AdminGuard] },
        { path: 'event/tickets/:id', component: TicketListComponent, canActivate: [AdminGuard] },
      ]
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
