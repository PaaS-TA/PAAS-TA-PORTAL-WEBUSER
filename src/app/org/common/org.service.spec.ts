import { TestBed, inject } from '@angular/core/testing';

import { OrgService } from './org.service';

describe('OrgService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrgService]
    });
  });

  it('should be created', inject([OrgService], (service: OrgService) => {
    expect(service).toBeTruthy();
  }));
});
