import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFilterArchiveComponent } from './search-filter-archive.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment'

describe('SearchFilterArchiveComponent', () => {
  let component: SearchFilterArchiveComponent;
  let fixture: ComponentFixture<SearchFilterArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchFilterArchiveComponent ],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFilterArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
