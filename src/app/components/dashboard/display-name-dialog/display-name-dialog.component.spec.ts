import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayNameDialogComponent } from './display-name-dialog.component';

describe('DisplayNameDialogComponent', () => {
  let component: DisplayNameDialogComponent;
  let fixture: ComponentFixture<DisplayNameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayNameDialogComponent ]
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
