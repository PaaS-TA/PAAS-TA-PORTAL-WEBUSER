import { TestBed, inject } from '@angular/core/testing';

import { UaaSecurityService } from './uaa-security.service';

describe('UaaSecurityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UaaSecurityService]
    });
  });

  it('should be created', inject([UaaSecurityService], (service: UaaSecurityService) => {
    expect(service).toBeTruthy();
  }));
});
