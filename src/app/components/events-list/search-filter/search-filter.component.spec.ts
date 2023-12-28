import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFilterComponent } from './search-filter.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment'
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('SearchFilterComponent', () => {
  let component: SearchFilterComponent;
  let fixture: ComponentFixture<SearchFilterComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const mockActivatedRoute = {
      params: of({ id: 'test-id' }) // Mock parameter 'id'
    };
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);


    await TestBed.configureTestingModule({
      declarations: [ SearchFilterComponent ],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: routerSpy }
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly toggle category selection', () => {
    expect(component.selectedCategoriesIndexes).toEqual([]);

    component.toggleCategory(1);
    expect(component.selectedCategoriesIndexes).toContain(1);

    component.toggleCategory(1);
    expect(component.selectedCategoriesIndexes).not.toContain(1);
  });


  it('should emit correct filter data when applyFilter is called', () => {
    spyOn(component.filterChanged, 'emit');

    component.nameFilter = 'Test Event';
    component.distanceFilter = 10;
    component.dateStartFilter = new Date('2023-01-01');
    component.dateEndFilter = new Date('2023-01-10');
    component.selectedCategoriesIndexes = [1, 2];
    component.cityBbox = [0, 0, 10, 10];

    component.applyFilter();

    expect(component.filterChanged.emit).toHaveBeenCalledWith({
      nameFilter: 'Test Event',
      distanceFilter: 10,
      dateStartFilter: new Date('2023-01-01'),
      dateEndFilter: new Date('2023-01-10'),
      selectedCategories: [1, 2],
      cityBbox: [0, 0, 10, 10],
    });
  });

  it('should clear all filters and emit event when CleanFilter is called', () => {
    spyOn(component.filterChanged, 'emit');

    component.nameFilter = 'Test Event';
    component.distanceFilter = 10;

    component.CleanFilter();

    expect(component.nameFilter).toBe('');
    expect(component.distanceFilter).toBe(0);
    expect(component.dateStartFilter).toBeNull();
    expect(component.dateEndFilter).toBeNull();
    expect(component.selectedCategoriesIndexes).toEqual([]);
    expect(component.cityBbox).toBeUndefined();

    expect(component.filterChanged.emit).toHaveBeenCalledWith({
      nameFilter: '',
      distanceFilter: 0,
      dateStartFilter: null,
      dateEndFilter: null,
      selectedCategories: [],
      cityBbox: undefined,
      isFiltersCleared: true,
    });
  });

});
