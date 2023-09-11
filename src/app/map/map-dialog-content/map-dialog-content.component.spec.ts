import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapDialogContentComponent } from './map-dialog-content.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('MapDialogContentComponent', () => {
  let component: MapDialogContentComponent;
  let fixture: ComponentFixture<MapDialogContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapDialogContentComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      imports: [MatDialogModule],
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
