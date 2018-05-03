import { TestBed, inject } from '@angular/core/testing';

import { DashboardSapaceService } from './dashboard-sapace.service';

describe('DashboardSapaceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardSapaceService]
    });
  });

  it('should be created', inject([DashboardSapaceService], (service: DashboardSapaceService) => {
    expect(service).toBeTruthy();
  }));
});
