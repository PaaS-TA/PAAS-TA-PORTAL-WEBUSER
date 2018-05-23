import { TestBed, inject } from '@angular/core/testing';

import { IndexCommonService } from './index-common.service';

describe('IndexCommonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IndexCommonService]
    });
  });

  it('should be created', inject([IndexCommonService], (service: IndexCommonService) => {
    expect(service).toBeTruthy();
  }));
});
