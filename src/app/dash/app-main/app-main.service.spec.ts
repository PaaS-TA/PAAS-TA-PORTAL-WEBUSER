import { TestBed, inject } from '@angular/core/testing';

import { AppMainService } from './app-main.service';

describe('AppMainService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppMainService]
    });
  });

  it('should be created', inject([AppMainService], (service: AppMainService) => {
    expect(service).toBeTruthy();
  }));
});
