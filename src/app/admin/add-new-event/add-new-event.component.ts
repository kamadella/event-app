import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormArray  } from '@angular/forms';
import { Event } from 'src/event';
import { AngularFirestore, AngularFirestoreCollection  } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-add-new-event',
  templateUrl: './add-new-event.component.html',
  styleUrls: ['./add-new-event.component.css']
})
export class AddNewEventComponent implements OnInit {
  formModel!: FormGroup;
  eventss = this.store.collection('events').valueChanges({ idField: 'id' }) as Observable<Event[]>;


  constructor(private router: Router,  private store: AngularFirestore) { }

  ngOnInit(): void {
    this.formModel = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('',[Validators.required]),
      localization: new FormControl('', [Validators.required, Validators.minLength(3)]),
      organizator: new FormControl('', [Validators.required, Validators.minLength(3)]),
      img: new FormControl('', [Validators.required]),
      date_start: new FormControl('', [Validators.required]),
      date_end: new FormControl('',[Validators.required]),
      category: new FormControl(''),
      tickets: new FormControl(''),
    });
  }

  get name(){
    return this.formModel.get('name');
  }

  get description(){
    return this.formModel.get('description');
  }

  get localization(){
    return this.formModel.get('localization');
  }

  get organizator(){
    return this.formModel.get('organizator');
  }

  get img(){
    return this.formModel.get('img');
  }

  get date_start(){
    return this.formModel.get('date_start');
  }

  get date_end(){
    return this.formModel.get('date_end');
  }

  get category(){
    return this.formModel.get('category');
  }

  get tickets(){
    return this.formModel.get('tickets');
  }



  addEvent(){
    console.warn(this.formModel.value);
    //let event = new Event(0, this.formModel.value.name, this.formModel.value.description, this.formModel.value.localization, this.formModel.value.organizator, this.formModel.value.img, this.formModel.value.date_start,this.formModel.value.date_end, this.formModel.value.category, this.formModel.value.tickets);
    //this.store.collection('events').add(result.task);
  }

}
