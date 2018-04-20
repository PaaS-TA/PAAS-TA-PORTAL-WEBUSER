import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import {CommonService} from '../../common/common.service';

@Injectable()
export class AppMainService {

  constructor(private commonService: CommonService) { }

  getAppSummary(guid: string) {
    return this.commonService.doGET('/portalapi/v2/apps/'+guid+'/summary', '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getAppStats(guid: string) {
    return this.commonService.doGET('/portalapi/v2/apps/'+guid+'/stats', '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  updateApp(params: any) {
    return this.commonService.doPost('/portalapi/v2/apps/updateApp', params, '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getAppEvents(guid: string) {
    return this.commonService.doGET('/portalapi/v2/apps/app-usage-events/'+guid, '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getAppEnv(guid: string) {
    return this.commonService.doGET('/portalapi/v2/apps/'+guid+'/env', '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getAppRecentLogs(guid: string) {
    return this.commonService.doGET('/portalapi/v2/apps/'+guid+'/recentlogs', '').map((res: Response) => {
      return res;
    }).do(console.log);
  }
}
