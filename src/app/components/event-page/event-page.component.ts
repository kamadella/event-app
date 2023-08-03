import { Component, OnInit, Input} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';;
import { EventService } from 'src/app/services/event.service';
import { map } from 'rxjs/operators';
import { Event } from 'src/app/models/event.model';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';


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
  message = '';


  constructor(private route: ActivatedRoute, private eventService: EventService,private categoryService: CategoryService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe( params=> this.eventId = params['id']);
    this.getCurrentEvent(this.eventId);

    this.message = '';
  }

  getCurrentCategory(id: string) : void{
    this.categoryService.getOne(id).snapshotChanges().pipe(
      map(c =>{
        const categoryData = c.payload.data() as Category;
        const categoryId = c.payload.id;
        return { id: categoryId, ...categoryData };
  })
    ).subscribe(data => {
      console.log("KATEGORIA = " + data.name); // Możesz tutaj użyć danych w dalszej części kodu
      this.currentCategory = data;
    });
  }


  getCurrentEvent(id: string) : void{
    this.eventService.getOne(id).snapshotChanges().pipe(
      map(c =>{
        const eventData = c.payload.data() as Event;
        const eventId = c.payload.id;
        return { id: eventId, ...eventData };
  })
    ).subscribe(data => {
      console.log("EVENT = "+ data.category); // Możesz tutaj użyć danych w dalszej części kodu
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
            this.message = 'The tutorial was updated successfully!';
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
          this.message = 'The status was updated successfully!';
        })
        .catch(err => console.log(err));
      }
    }
    this.router.navigate(['/events']);
  }

}
