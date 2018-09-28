import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import {CommonService} from '../../common/common.service';

@Injectable()
export class AppMainService {

  constructor(private commonService: CommonService) { }

  private getToken() {
    return this.commonService.getToken();
  }

  getOrgSummary(orgId: string) {
    return this.commonService.doGet('/portalapi/v2/orgs/' + orgId + '/summary', this.commonService.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getAppSummary(guid: string) {
    return this.commonService.doGet('/portalapi/v2/apps/'+guid+'/summary', this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getAppStats(guid: string) {
    return this.commonService.doGet('/portalapi/v2/apps/'+guid+'/stats', this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getImg(filename : string){
    return this.commonService.doStorageGet('/storageapi/v2/swift/' + filename, this.getToken()).map((res : any) => {
      return res;
    }).do(console.log);
  }

  startApp(params: any) {
    return this.commonService.doPost('/portalapi/v3/apps/startApp', params, this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  stopApp(params: any) {
    return this.commonService.doPost('/portalapi/v3/apps/stopApp', params, this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  restageApp(params: any) {
    return this.commonService.doPost('/portalapi/v2/apps/restageApp', params, this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  updateApp(params: any) {
    return this.commonService.doPost('/portalapi/v2/apps/updateApp', params, this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  delApp(guid: string) {
    return this.commonService.doDelete('/portalapi/v2/apps/'+guid , null, this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getAppEvents(guid: string) {
    return this.commonService.doGet('/portalapi/v2/apps/app-usage-events/'+guid, this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getAppEnv(guid: string) {
    return this.commonService.doGet('/portalapi/v2/apps/'+guid+'/env', this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getAppRecentLogs(guid: string) {
    return this.commonService.doGet('/portalapi/v2/apps/'+guid+'/recentlogs', this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  terminateInstance(guid: string, index: string, params: any) {
    return this.commonService.doDelete('/portalapi/v2/apps/'+guid+'/instances/'+index, params, this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }cpuUsage

  addAppRoute(params: any) {
    return this.commonService.doPost('/portalapi/v2/routes', params, this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  delAppRoute(guid: string, route_guid: string, params: any) {
    return this.commonService.doDelete('/portalapi/v2/apps/'+guid+'/routes/'+route_guid, params, this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getSpaceSummary(guid: string) {
    return this.commonService.doGet('/portalapi/v2/spaces/'+guid+'/summary', this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getServicesInstances(guid: string) {
    return this.commonService.doGet('/portalapi/v2/service-instances/space/'+guid+'', this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getServicepacks() {
    return this.commonService.doGet('/commonapi/v2/servicepacks', this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getBuildPacks() {
    return this.commonService.doGet('/commonapi/v2/developpacks', this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  bindService(params: any) {
    return this.commonService.doPost('/portalapi/v2/service-bindings', params, this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  userProvideCredentials(guid : string){
    return this.commonService.doGet('/portalapi/v2/apps/' + guid + '/credentials',  this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  unbindService(applicationId: string, serviceInstanceId: string, params: any) {
    return this.commonService.doDelete('/portalapi/v2/service-bindings/'+serviceInstanceId+'/apps/'+applicationId, params, this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  unbindUserProvideService(applicationId: string, serviceInstanceId: string, params: any) {
    return this.commonService.doDelete('/portalapi/v2/user-provide-service-bindings/'+serviceInstanceId+'/apps/'+applicationId, params, this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getAlarms(appGuid: string, pageItems: number, pageIndex: number, resourceType: string, alarmLevel: string) {
    return this.commonService.doGet('/portalapi/app/alarm/list?appGuid='+appGuid+'&pageItems='+pageItems+'&pageIndex='+pageIndex+'&resourceType='+resourceType+'&alarmLevel='+alarmLevel, this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }


  getAlarm(appGuid: string) {
    return this.commonService.doGet('/portalapi/app/alarm/policy?appGuid='+appGuid, this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  updateAlarm(params: any) {
    return this.commonService.doPost('/portalapi/app/alarm/policy', params, this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getAutoscaling(appGuid: string) {
    return this.commonService.doGet('/portalapi/app/autoscaling/policy?appGuid='+appGuid, this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  updateAutoscaling(params: any) {
    return this.commonService.doPost('/portalapi/app/autoscaling/policy', params, this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getCpuUsage(guid: string, idx: string, defaultTimeRange: string, groupBy: string, type: string) {
    return this.commonService.doGet('/portalapi/app/'+guid+'/'+idx+'/cpuUsage?defaultTimeRange='+defaultTimeRange+'&groupBy='+groupBy+'&type='+type, this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getMemoryUsage(guid: string, idx: string, defaultTimeRange: string, groupBy: string, type: string) {
    return this.commonService.doGet('/portalapi/app/'+guid+'/'+idx+'/memoryUsage?defaultTimeRange='+defaultTimeRange+'&groupBy='+groupBy+'&type='+type, this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getNetworkByte(guid: string, idx: string, defaultTimeRange: string, groupBy: string, type: string) {
    return this.commonService.doGet('/portalapi/app/'+guid+'/'+idx+'/getNetworkByte?defaultTimeRange='+defaultTimeRange+'&groupBy='+groupBy+'&type='+type, '').map((res: Response) => {
      return res;
    }).do(console.log);
  }
}
