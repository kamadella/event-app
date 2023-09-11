import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileIMGDialogComponent } from './profile-img-dialog.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ProfileIMGDialogComponent', () => {
  let component: ProfileIMGDialogComponent;
  let fixture: ComponentFixture<ProfileIMGDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileIMGDialogComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} }, // Provide a mock MatDialogRef
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      imports: [MatDialogModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileIMGDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
