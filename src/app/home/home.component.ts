import { Component, OnInit } from '@angular/core';
import { Event } from 'src/event';
import { AngularFirestore  } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private store: AngularFirestore) { }

  ngOnInit(): void {
  }



}
