import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsArchiveComponent } from './events-archive.component';

describe('EventsArchiveComponent', () => {
  let component: EventsArchiveComponent;
  let fixture: ComponentFixture<EventsArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventsArchiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
