import { TestBed } from '@angular/core/testing';

import { FirebaseServerService } from './firebase-server.service';

describe('FirebaseServerService', () => {
  let service: FirebaseServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
