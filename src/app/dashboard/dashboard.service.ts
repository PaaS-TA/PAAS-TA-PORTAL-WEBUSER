import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommonService} from '../common/common.service';
import {NGXLogger} from 'ngx-logger';
import 'rxjs/add/operator/map';
import {Jsonp} from '@angular/http';


@Injectable()
export class DashboardService {

  constructor(private commonService: CommonService, private http: HttpClient, private log: NGXLogger, private jsonp: Jsonp) {
    console.log(this.commonService.getToken());
  }

  // @RequestMapping(value = {Constants.V2_URL+"/spaces/{spaceid}/summary"}, method = RequestMethod.GET)
  getAppSummary(spaceid: string) {
    return this.commonService.doGet('/portalapi/v2/spaces/' + spaceid + '/summary', '').map((res: Response) => {
      console.log(res);
      return res;
    }).do(console.log);
  }

  // @RequestMapping(value = {Constants.V2_URL + "/apps/{guid}/rename"}, method = RequestMethod.PUT)
  renameApp(params: any) {
    return this.commonService.doPut('/portalapi/v2/apps/' + params.guid + '/rename', params,'').map((res: Response) => {
      console.log(res);
      return res;
    }).do(console.log);
  }

  // @RequestMapping(value = {Constants.V2_URL +"/apps"}, method = RequestMethod.DELETE)
  delApp(params: any) {
    return this.commonService.doDelete('/portalapi/v2/apps/'+ params.guid , null,'').map((res: Response) => {
      return res;
    }).do(console.log);
  }

  // @RequestMapping(value = {Constants.V3_URL + "/apps/startApp"}, method = RequestMethod.POST)
  startApp(params: any) {
    return this.commonService.doPost('/portalapi/v3/apps/startApp', params, '').map((res: Response) => {
      return res;
    }).do(console.log);
  }


  // @RequestMapping(value = {Constants.V2_URL + "/service/{guid}/rename"}, method = RequestMethod.PUT)
  renameInstance(params: any) {
    return this.commonService.doPut('/portalapi/v2/service/' + params.guid + '/rename', params,'').map((res: Response) => {
      console.log(res);
      return res;
    }).do(console.log);
  }

  // @RequestMapping(value = {Constants.V2_URL + "/service/{guid}"}, method = RequestMethod.DELETE)
  delInstance(params: any) {
    return this.commonService.doDelete('/portalapi/v2/service/'+ params.guid , null,'').map((res: Response) => {
      return res;
    }).do(console.log);
  }

}//


