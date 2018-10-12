import { TestBed, inject } from '@angular/core/testing';

import { OrgProduceService } from './org-produce.service';

describe('OrgProduceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrgProduceService]
    });
  });

  it('should be created', inject([OrgProduceService], (service: OrgProduceService) => {
    expect(service).toBeTruthy();
  }));
});
