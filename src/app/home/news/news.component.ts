import { Component, OnInit, Input } from '@angular/core';
import { Event } from 'src/event';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  @Input() event!: Event;

  constructor() { }

  ngOnInit(): void {
  }

}
