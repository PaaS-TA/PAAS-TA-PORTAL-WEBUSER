import { TestBed, inject } from '@angular/core/testing';

import { QuantityMainService } from './quantity-main.service';

describe('QuantityMainService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuantityMainService]
    });
  });

  it('should be created', inject([QuantityMainService], (service: QuantityMainService) => {
    expect(service).toBeTruthy();
  }));
});
