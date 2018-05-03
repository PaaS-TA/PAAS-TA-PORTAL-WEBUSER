import { TestBed, inject } from '@angular/core/testing';

import { DashboardProduceService } from './dashboard-produce.service';

describe('DashboardProduceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardProduceService]
    });
  });

  it('should be created', inject([DashboardProduceService], (service: DashboardProduceService) => {
    expect(service).toBeTruthy();
  }));
});
