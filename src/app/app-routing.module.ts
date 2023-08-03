import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { EventPageComponent } from './components/event-page/event-page.component';
import { EventsListComponent } from './components/events-list/events-list.component';
import { AddEventComponent } from './components/add-event/add-event.component';
import { CategoryComponent } from './components/category/category.component';
import { MapComponent } from './map/map.component';
import { AdminEventsToPublishComponent } from './components/admin-events-to-publish/admin-events-to-publish.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  { path: 'event/:id', component: EventPageComponent },
  { path: 'events', component: EventsListComponent },
  { path: 'add', component: AddEventComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'map', component: MapComponent },
  { path: 'admin/events', component: AdminEventsToPublishComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
