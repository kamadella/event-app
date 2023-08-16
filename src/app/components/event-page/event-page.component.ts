import { Component, OnInit, Input} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';;
import { EventService } from 'src/app/services/event.service';
import { map } from 'rxjs/operators';
import { Event } from 'src/app/models/event.model';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { AuthService } from '../../shared/services/auth.service';


@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit {
  eventId:string = "-1";
  categoryId: string = "-1";
  currentEvent: Event = {
    name: '',
    description: '',
    place_name: '',
    organizator: '',
    img: '',
    date_start: new Date,
    date_end: new Date,
    category: '',
    tickets: 0
  };
  currentCategory: Category = {
    name: ''
  };


  constructor(private route: ActivatedRoute, private eventService: EventService,private categoryService: CategoryService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.route.params.subscribe( params=> this.eventId = params['id']);
    this.getCurrentEvent(this.eventId);

  }

  getCurrentCategory(id: string) : void{
    this.categoryService.getOne(id).snapshotChanges().pipe(
      map(c =>{
        const categoryData = c.payload.data() as Category;
        const categoryId = c.payload.id;
        return { id: categoryId, ...categoryData };
  })
    ).subscribe(data => {
      this.currentCategory = data;
    });
  }

  canActivateEvent(): boolean {
    // Sprawdź, czy użytkownik jest administratorem
    const isAdmin = this.authService.isAdmin;

    // Sprawdź, czy wydarzenie ma właściwość 'published' ustawioną na true
    const isEventPublished = this.currentEvent.published === true;

    // Zwróć true, jeśli użytkownik jest administratorem lub wydarzenie jest opublikowane
    // W przeciwnym przypadku zwróć false
    return isAdmin || isEventPublished;
  }


  getCurrentEvent(id: string) : void{
    this.eventService.getOne(id).snapshotChanges().pipe(
      map(c =>{
        const eventData = c.payload.data() as Event;
        const eventId = c.payload.id;
        return { id: eventId, ...eventData };
  })
    ).subscribe(data => {
      this.currentEvent = data;
      this.getCurrentCategory(this.currentEvent.category!);
    });
  }

  deleteEvent(): void {
    if(confirm("Czy na pewno chcesz usunąć? ")){
      if (this.currentEvent.id) {
        this.eventService.delete(this.currentEvent.id)
          .then(() => {
            //this.refreshList.emit();
          })
          .catch(err => console.log(err));
      }
    }
    this.router.navigate(['/events']);
  }


  publishEvent(status: boolean): void {
    if(confirm("Czy na pewno chcesz opublikowąc to wydarzenie? ")){
      if (this.currentEvent.id) {
        this.eventService.update(this.currentEvent.id, { published: status })
        .then(() => {
          this.currentEvent.published = status;
        })
        .catch(err => console.log(err));
      }
    }
    this.router.navigate(['/events']);
  }

  isAdmin() {
    return this.authService.isAdmin;
  }

}
