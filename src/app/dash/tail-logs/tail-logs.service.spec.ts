import { TestBed, inject } from '@angular/core/testing';

import { TailLogsService } from './tail-logs.service';

describe('TailLogsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TailLogsService]
    });
  });

  it('should be created', inject([TailLogsService], (service: TailLogsService) => {
    expect(service).toBeTruthy();
  }));
});
