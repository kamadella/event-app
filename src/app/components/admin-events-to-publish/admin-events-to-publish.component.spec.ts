import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEventsToPublishComponent } from './admin-events-to-publish.component';

describe('AdminEventsToPublishComponent', () => {
  let component: AdminEventsToPublishComponent;
  let fixture: ComponentFixture<AdminEventsToPublishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminEventsToPublishComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEventsToPublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
