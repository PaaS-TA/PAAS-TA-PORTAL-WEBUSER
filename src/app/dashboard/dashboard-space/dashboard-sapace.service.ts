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
  constructor(private http: HttpClient, private commonService: CommonService, private logger: NGXLogger,) {}

// @RequestMapping(value = {Constants.V2_URL+"/spaces/{spaceid}/summary"}, method = RequestMethod.GET)
  getAppSummary(guid: string) {
    return this.commonService.doGet('/portalapi/v2/apps/'+guid+'/summary', '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

}
