import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsListComponent } from './events-list.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';

const mockActivatedRoute = {
  params: of({ category: 'test-category' }),
};

const mockEvents = [
  {
    id: '1',
    name: 'Event 1',
    category: '1',
    date_start: new Date('2023-01-01'),
    date_end: new Date('2023-01-01'),
    lat: 56.1,
    lng: 24.1,
  },
  {
    id: '2',
    name: 'Event 2',
    category: '2',
    date_start: new Date('2023-03-04'),
    date_end: new Date('2023-03-05'),
    lat: 14.1,
    lng: 124.1,
  },
  {
    id: '3',
    name: 'Event 3',
    category: '3',
    date_start: new Date('2023-01-15'),
    date_end: new Date('2023-02-01'),
    lat: 53.1687,
    lng: 23.1322,
  },
];

const mockCategories = [
  { id: '1', name: 'music' },
  { id: '2', name: 'theater' },
  { id: '3', name: 'art' },
];

describe('EventsListComponent', () => {
  let component: EventsListComponent;
  let fixture: ComponentFixture<EventsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventsListComponent],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        MatDialogModule,
      ],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsListComponent);
    component = fixture.componentInstance;
    component.events = mockEvents; // Set the mock events
    component.categories = mockCategories; // Set the mock categories
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter events by category id', () => {
    component.filterEventsByCategory('1');
    if (component.filteredEventList) {
      expect(component.filteredEventList.length).toBe(1);
      expect(component.filteredEventList[0].id).toEqual('1');
    } else {
      fail('filteredEventList is undefined');
    }
  });

  it('should filter events by a specific date range', () => {
    const mockFilter = {
      selectedCategories: [],
      nameFilter: '',
      dateStartFilter: new Date('2023-01-01'),
      dateEndFilter: new Date('2023-01-20'),
      cityBbox: null,
      distanceFilter: 0,
    };

    component.handleFilterChange(mockFilter);
    fixture.detectChanges();
    if (component.filteredEventList) {
      expect(component.filteredEventList.length).toBe(2);
      expect(component.filteredEventList[0].id).toBe('1');
      expect(component.filteredEventList[1].id).toBe('3');
    } else {
      fail('filteredEventList is undefined');
    }
  });

  it('should filter events by location', () => {
    const mockFilter = {
      selectedCategories: [],
      nameFilter: '',
      dateStartFilter: null,
      dateEndFilter: null,
      cityBbox: [20, 50, 30, 56],
      distanceFilter: 0,
    };

    component.handleFilterChange(mockFilter);
    fixture.detectChanges();
    if (component.filteredEventList) {
      expect(component.filteredEventList.length).toBe(1);
      expect(component.filteredEventList[0].id).toBe('3');
    } else {
      fail('filteredEventList is undefined');
    }
  });

  it('should filter events by location and range', () => {
    const mockFilter = {
      selectedCategories: [],
      nameFilter: '',
      dateStartFilter: null,
      dateEndFilter: null,
      cityBbox: [20, 50, 30, 56],
      distanceFilter: 100,
    };

    component.handleFilterChange(mockFilter);
    fixture.detectChanges();
    if (component.filteredEventList) {
      expect(component.filteredEventList.length).toBe(2);
      expect(component.filteredEventList[0].id).toBe('1');
      expect(component.filteredEventList[1].id).toBe('3');
    } else {
      fail('filteredEventList is undefined');
    }
  });

  it('should filter events by a name', () => {
    const mockFilter = {
      selectedCategories: [],
      nameFilter: 'Event 3',
      dateStartFilter: null,
      dateEndFilter: null,
      cityBbox: undefined,
      distanceFilter: 0,
    };

    component.handleFilterChange(mockFilter);
    fixture.detectChanges();
    if (component.filteredEventList) {
      expect(component.filteredEventList.length).toBe(1);
      expect(component.filteredEventList[0].id).toBe('3');
    } else {
      fail('filteredEventList is undefined');
    }
  });

  it('should filter events by multiple category', () => {
    const mockFilter = {
      selectedCategories: [0, 1],
      nameFilter: '',
      dateStartFilter: null,
      dateEndFilter: null,
      cityBbox: undefined,
      distanceFilter: 0,
    };

    component.handleFilterChange(mockFilter);
    fixture.detectChanges();
    if (component.filteredEventList) {
      expect(component.filteredEventList.length).toBe(2);
      expect(component.filteredEventList[0].id).toBe('1');
      expect(component.filteredEventList[1].id).toBe('2');
    } else {
      fail('filteredEventList is undefined');
    }
  });
});
