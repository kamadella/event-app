import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsListComponent } from './comments-list.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment'
import { MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute

describe('CommentsListComponent', () => {
  let component: CommentsListComponent;
  let fixture: ComponentFixture<CommentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentsListComponent ],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        MatDialogModule
      ],
      providers: [
        // Provide the mock ActivatedRoute
        { provide: ActivatedRoute, useValue: {} },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
