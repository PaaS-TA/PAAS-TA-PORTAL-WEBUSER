import { TestBed, inject } from '@angular/core/testing';

import { ExternalcommonService } from './externalcommon.service';

describe('ExternalcommonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExternalcommonService]
    });
  });

  it('should be created', inject([ExternalcommonService], (service: ExternalcommonService) => {
    expect(service).toBeTruthy();
  }));
});
