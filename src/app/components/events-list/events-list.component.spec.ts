import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsListComponent } from './events-list.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';

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

const mockUserData = {
  likedEvents: ['1', '3'], // Assuming the user has liked Event 1 and Event 3
};

describe('EventsListComponent', () => {
  let component: EventsListComponent;
  let fixture: ComponentFixture<EventsListComponent>;

  beforeEach(async () => {
    let authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      userData: mockUserData,
    });
    await TestBed.configureTestingModule({
      declarations: [EventsListComponent],
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        MatDialogModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsListComponent);
    component = fixture.componentInstance;
    component.events = mockEvents;
    component.categories = mockCategories;
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

  it('should show only liked events when toggleShowOnlyLikedEvents is called', () => {
    component.filteredEventList = [...component.events!];

    component.toggleShowOnlyLikedEvents();
    fixture.detectChanges();

    expect(component.filteredEventList.length).toBe(2);

    const likedEventIds = mockUserData.likedEvents;
    const allLiked = component.filteredEventList.every(event => likedEventIds.includes(event.id ?? ''));
    expect(allLiked).toBeTrue();
    expect(component.filteredEventList.some(event => event.id === '1')).toBeTrue();
    expect(component.filteredEventList.some(event => event.id === '3')).toBeTrue();
  });

  it('should display no events when filters match no events', () => {
    const noResultFilter = {
      selectedCategories: [],
      nameFilter: 'NonExistingEvent',
      dateStartFilter: null,
      dateEndFilter: null,
      cityBbox: undefined,
      distanceFilter: 0,
    };
    component.handleFilterChange(noResultFilter);
    fixture.detectChanges();
    expect(component.filteredEventList!.length).toBe(0);
  });

  it('should handle invalid category IDs gracefully', () => {
    component.filterEventsByCategory('invalid-category-id');
    fixture.detectChanges();
    expect(component.filteredEventList?.length).toBe(0);
  });

});
