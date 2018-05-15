import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import {CommonService} from '../../common/common.service';

@Injectable()
export class AppMainService {

  constructor(private commonService: CommonService) { }

  getAppSummary(guid: string) {
    return this.commonService.doGet('/portalapi/v2/apps/'+guid+'/summary', '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getAppStats(guid: string) {
    return this.commonService.doGet('/portalapi/v2/apps/'+guid+'/stats', '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  startApp(params: any) {
    return this.commonService.doPost('/portalapi/v3/apps/startApp', params, '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  stopApp(params: any) {
    return this.commonService.doPost('/portalapi/v3/apps/stopApp', params, '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  restageApp(params: any) {
    return this.commonService.doPost('/portalapi/v2/apps/restageApp', params, '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  updateApp(params: any) {
    return this.commonService.doPost('/portalapi/v2/apps/updateApp', params, '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getAppEvents(guid: string) {
    return this.commonService.doGet('/portalapi/v2/apps/app-usage-events/'+guid, '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getAppEnv(guid: string) {
    return this.commonService.doGet('/portalapi/v2/apps/'+guid+'/env', '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getAppRecentLogs(guid: string) {
    return this.commonService.doGet('/portalapi/v2/apps/'+guid+'/recentlogs', '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  terminateInstance(guid: string, index: string, params: any) {
    return this.commonService.doDelete('/portalapi/v2/apps/'+guid+'/instances/'+index, params, '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  addAppRoute(params: any) {
    return this.commonService.doPost('/portalapi/v2/routes', params, '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  delAppRoute(guid: string, route_guid: string, params: any) {
    return this.commonService.doDelete('/portalapi/v2/apps/'+guid+'/routes/'+route_guid, params, '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getSpaceSummary(guid: string) {
    return this.commonService.doGet('/portalapi/v2/spaces/'+guid+'/summary', '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getServicesInstances(guid: string) {
    return this.commonService.doGet('/portalapi/v2/service-instances/space/'+guid+'', '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getServicepacks() {
    return this.commonService.doGet('/commonapi/v2/servicepacks', '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  bindService(params: any) {
    return this.commonService.doPost('/portalapi/v2/service-bindings', params, '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  unbindService(applicationId: string, serviceInstanceId: string, params: any) {
    return this.commonService.doDelete('/portalapi/v2/service-bindings/'+serviceInstanceId+'/apps/'+applicationId, params, '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getAlarms(appGuid: string, pageItems: number, pageIndex: number, resourceType: string, alarmLevel: string) {
    return this.commonService.doGet('/portalapi/app/alarm/list?appGuid='+appGuid+'&pageItems='+pageItems+'&pageIndex='+pageIndex+'&resourceType='+resourceType+'&alarmLevel='+alarmLevel, '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getAlarm(appGuid: string) {
    return this.commonService.doGet('/portalapi/app/alarm/policy?appGuid='+appGuid, '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  updateAlarm(params: any) {
    return this.commonService.doPost('/portalapi/app/alarm/policy', params, '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getAutoscaling(appGuid: string) {
    return this.commonService.doGet('/portalapi/app/autoscaling/policy?appGuid='+appGuid, '').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  updateAutoscaling(params: any) {
    return this.commonService.doPost('/portalapi/app/autoscaling/policy', params, '').map((res: Response) => {
      return res;
    }).do(console.log);
  }
}
