import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayNameDialogComponent } from './display-name-dialog.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('DisplayNameDialogComponent', () => {
  let component: DisplayNameDialogComponent;
  let fixture: ComponentFixture<DisplayNameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayNameDialogComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} }, // Provide a mock MatDialogRef
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      imports: [MatDialogModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
