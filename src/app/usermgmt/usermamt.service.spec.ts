import { TestBed, inject } from '@angular/core/testing';

import { UsermamtService } from './usermamt.service';

describe('UsermamtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsermamtService]
    });
  });

  it('should be created', inject([UsermamtService], (service: UsermamtService) => {
    expect(service).toBeTruthy();
  }));
});
