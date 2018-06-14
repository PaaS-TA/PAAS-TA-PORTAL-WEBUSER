import { TestBed, inject } from '@angular/core/testing';

import { Org2MainService } from './org2-main.service';

describe('Org2MainService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Org2MainService]
    });
  });

  it('should be created', inject([Org2MainService], (service: Org2MainService) => {
    expect(service).toBeTruthy();
  }));
});
