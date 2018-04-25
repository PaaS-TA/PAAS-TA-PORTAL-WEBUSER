import {TestBed, inject} from '@angular/core/testing';

import {UsermgmtService} from './usermgmt.service';
import {UsermgmtComponent} from "./usermgmt.component";

describe('UsermamtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsermgmtService]
    });
  });

  it('should be created', inject([UsermgmtService], (service: UsermgmtService) => {
    expect(service).toBeTruthy();
  }));
});
