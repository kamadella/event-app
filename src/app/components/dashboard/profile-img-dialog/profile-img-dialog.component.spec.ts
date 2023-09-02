import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileIMGDialogComponent } from './profile-img-dialog.component';

describe('ProfileIMGDialogComponent', () => {
  let component: ProfileIMGDialogComponent;
  let fixture: ComponentFixture<ProfileIMGDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileIMGDialogComponent ]
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
