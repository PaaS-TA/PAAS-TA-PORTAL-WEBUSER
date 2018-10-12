import { TestBed, inject } from '@angular/core/testing';

import { OrgMainService } from './org-main.service';

describe('OrgMainService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrgMainService]
    });
  });

  it('should be created', inject([OrgMainService], (service: OrgMainService) => {
    expect(service).toBeTruthy();
  }));
});
