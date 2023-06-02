import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
	model: NgbDateStruct | undefined;
	date!: { year: number; month: number; };

  constructor(private calendar: NgbCalendar) { }

  ngOnInit(): void {
  }

  selectToday() {
		this.model = this.calendar.getToday();
	}

}
