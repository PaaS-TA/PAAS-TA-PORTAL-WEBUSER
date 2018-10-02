import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import {CommonService} from '../../common/common.service';

@Injectable()
export class AppMainService {

  constructor(private commonService: CommonService) { }

  private getToken() {
    return this.commonService.getToken();
  }

  getCodeMax(groudid : string){
    return this.commonService.doGet('/commonapi/v2/'+groudid+'/codedetail' , this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  getOrgSummary(orgId: string) {
    return this.commonService.doGet('/portalapi/v2/orgs/' + orgId + '/summary', this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  getAppSummary(guid: string) {
    return this.commonService.doGet('/portalapi/v2/apps/'+guid+'/summary', this.getToken()).map((res: any) => {
      return res;
    });
  }

  getAppStats(guid: string) {
    return this.commonService.doGet('/portalapi/v2/apps/'+guid+'/stats', this.getToken()).map((res: any) => {
      return res;
    });
  }

  getImg(filename : string){
    return this.commonService.doStorageGet('/storageapi/v2/swift/' + filename, this.getToken()).map((res : any) => {
      return res;
    });
  }

  startApp(params: any) {
    return this.commonService.doPost('/portalapi/v3/apps/startApp', params, this.getToken()).map((res: any) => {
      return res;
    });
  }

  stopApp(params: any) {
    return this.commonService.doPost('/portalapi/v3/apps/stopApp', params, this.getToken()).map((res: any) => {
      return res;
    });
  }

  restageApp(params: any) {
    return this.commonService.doPost('/portalapi/v2/apps/restageApp', params, this.getToken()).map((res: any) => {
      return res;
    });
  }

  updateApp(params: any) {
    return this.commonService.doPost('/portalapi/v2/apps/updateApp', params, this.getToken()).map((res: any) => {
      return res;
    });
  }

  delApp(guid: string) {
    return this.commonService.doDelete('/portalapi/v2/apps/'+guid , null, this.getToken()).map((res: any) => {
      return res;
    });
  }

  getAppEvents(guid: string) {
    return this.commonService.doGet('/portalapi/v2/apps/app-usage-events/'+guid, this.getToken()).map((res: any) => {
      return res;
    });
  }

  getAppEnv(guid: string) {
    return this.commonService.doGet('/portalapi/v2/apps/'+guid+'/env', this.getToken()).map((res: any) => {
      return res;
    });
  }

  getAppRecentLogs(guid: string) {
    return this.commonService.doGet('/portalapi/v2/apps/'+guid+'/recentlogs', this.getToken()).map((res: any) => {
      return res;
    });
  }

  terminateInstance(guid: string, index: string, params: any) {
    return this.commonService.doDelete('/portalapi/v2/apps/'+guid+'/instances/'+index, params, this.getToken()).map((res: any) => {
      return res;
    });
  }cpuUsage

  addAppRoute(params: any) {
    return this.commonService.doPost('/portalapi/v2/routes', params, this.getToken()).map((res: any) => {
      return res;
    });
  }

  delAppRoute(guid: string, route_guid: string, params: any) {
    return this.commonService.doDelete('/portalapi/v2/apps/'+guid+'/routes/'+route_guid, params, this.getToken()).map((res: any) => {
      return res;
    });
  }

  getSpaceSummary(guid: string) {
    return this.commonService.doGet('/portalapi/v2/spaces/'+guid+'/summary', this.getToken()).map((res: any) => {
      return res;
    });
  }

  getServicesInstances(guid: string) {
    return this.commonService.doGet('/portalapi/v2/service-instances/space/'+guid+'', this.getToken()).map((res: any) => {
      return res;
    });
  }

  getServicepacks() {
    return this.commonService.doGet('/commonapi/v2/servicepacks', this.getToken()).map((res: any) => {
      return res;
    });
  }

  getBuildPacks() {
    return this.commonService.doGet('/commonapi/v2/developpacks', this.getToken()).map((res: any) => {
      return res;
    });
  }

  bindService(params: any) {
    return this.commonService.doPost('/portalapi/v2/service-bindings', params, this.getToken()).map((res: any) => {
      return res;
    });
  }

  userProvideCredentials(guid : string){
    return this.commonService.doGet('/portalapi/v2/apps/' + guid + '/credentials',  this.getToken()).map((res: any) => {
      return res;
    });
  }

  unbindService(applicationId: string, serviceInstanceId: string, params: any) {
    return this.commonService.doDelete('/portalapi/v2/service-bindings/'+serviceInstanceId+'/apps/'+applicationId, params, this.getToken()).map((res: any) => {
      return res;
    });
  }

  unbindUserProvideService(applicationId: string, serviceInstanceId: string, params: any) {
    return this.commonService.doDelete('/portalapi/v2/user-provide-service-bindings/'+serviceInstanceId+'/apps/'+applicationId, params, this.getToken()).map((res: any) => {
      return res;
    });
  }

  getAlarms(appGuid: string, pageItems: number, pageIndex: number, resourceType: string, alarmLevel: string) {
    return this.commonService.doGet('/portalapi/app/alarm/list?appGuid='+appGuid+'&pageItems='+pageItems+'&pageIndex='+pageIndex+'&resourceType='+resourceType+'&alarmLevel='+alarmLevel, this.getToken()).map((res: any) => {
      return res;
    });
  }


  getAlarm(appGuid: string) {
    return this.commonService.doGet('/portalapi/app/alarm/policy?appGuid='+appGuid, this.getToken()).map((res: any) => {
      return res;
    });
  }

  updateAlarm(params: any) {
    return this.commonService.doPost('/portalapi/app/alarm/policy', params, this.getToken()).map((res: any) => {
      return res;
    });
  }

  getAutoscaling(appGuid: string) {
    return this.commonService.doGet('/portalapi/app/autoscaling/policy?appGuid='+appGuid, this.getToken()).map((res: any) => {
      return res;
    });
  }

  updateAutoscaling(params: any) {
    return this.commonService.doPost('/portalapi/app/autoscaling/policy', params, this.getToken()).map((res: any) => {
      return res;
    });
  }

  getCpuUsage(guid: string, idx: string, defaultTimeRange: string, groupBy: string, type: string) {
    return this.commonService.doGet('/portalapi/app/'+guid+'/'+idx+'/cpuUsage?defaultTimeRange='+defaultTimeRange+'&groupBy='+groupBy+'&type='+type, this.getToken()).map((res: any) => {
      return res;
    });
  }

  getMemoryUsage(guid: string, idx: string, defaultTimeRange: string, groupBy: string, type: string) {
    return this.commonService.doGet('/portalapi/app/'+guid+'/'+idx+'/memoryUsage?defaultTimeRange='+defaultTimeRange+'&groupBy='+groupBy+'&type='+type, this.getToken()).map((res: any) => {
      return res;
    });
  }

  getNetworkByte(guid: string, idx: string, defaultTimeRange: string, groupBy: string, type: string) {
    return this.commonService.doGet('/portalapi/app/'+guid+'/'+idx+'/getNetworkByte?defaultTimeRange='+defaultTimeRange+'&groupBy='+groupBy+'&type='+type, '').map((res: any) => {
      return res;
    });
  }
}
