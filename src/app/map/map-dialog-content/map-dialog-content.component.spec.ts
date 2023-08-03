import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapDialogContentComponent } from './map-dialog-content.component';

describe('MapDialogContentComponent', () => {
  let component: MapDialogContentComponent;
  let fixture: ComponentFixture<MapDialogContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapDialogContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapDialogContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
