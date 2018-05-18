import { TestBed, inject } from '@angular/core/testing';

import { CreateuserService } from './createuser.service';

describe('CreateuserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateuserService]
    });
  });

  it('should be created', inject([CreateuserService], (service: CreateuserService) => {
    expect(service).toBeTruthy();
  }));
});
