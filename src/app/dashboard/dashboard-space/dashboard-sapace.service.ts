import { Injectable } from '@angular/core';
import {CommonService} from '../../common/common.service';
import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DashboardService} from '../dashboard.service';
import {SpaceService} from "../../space/space.service";
import {Space} from '../../model/space';


@Injectable()
export class DashboardSapaceService {
  constructor(private common: CommonService, private logger: NGXLogger) { }

  public getAppList(): Array<Apps> {
    return 0;
  }


}
