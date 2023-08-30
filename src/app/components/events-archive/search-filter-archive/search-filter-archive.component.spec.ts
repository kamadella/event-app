import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFilterArchiveComponent } from './search-filter-archive.component';

describe('SearchFilterArchiveComponent', () => {
  let component: SearchFilterArchiveComponent;
  let fixture: ComponentFixture<SearchFilterArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchFilterArchiveComponent ]
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
