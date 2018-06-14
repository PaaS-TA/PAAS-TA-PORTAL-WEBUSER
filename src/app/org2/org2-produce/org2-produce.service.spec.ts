import { TestBed, inject } from '@angular/core/testing';

import { Org2ProduceService } from './org2-produce.service';

describe('Org2ProduceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Org2ProduceService]
    });
  });

  it('should be created', inject([Org2ProduceService], (service: Org2ProduceService) => {
    expect(service).toBeTruthy();
  }));
});
