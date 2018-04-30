import { TestBed, inject } from '@angular/core/testing';

import { OrgQuotaService } from './org-quota.service';

describe('OrgQuotaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrgQuotaService]
    });
  });

  it('should be created', inject([OrgQuotaService], (service: OrgQuotaService) => {
    expect(service).toBeTruthy();
  }));
});
