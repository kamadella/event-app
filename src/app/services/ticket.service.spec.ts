import { TestBed } from '@angular/core/testing';

import { TicketService } from './ticket.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment'

describe('TicketService', () => {
  let service: TicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
      ],
    });
    service = TestBed.inject(TicketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
