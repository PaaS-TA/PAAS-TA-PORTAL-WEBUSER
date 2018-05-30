import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommonService} from '../common/common.service';
import {CatalogService} from '../catalog/main/catalog.service';
import {NGXLogger} from 'ngx-logger';
import 'rxjs/add/operator/map';
import {Jsonp} from '@angular/http';


@Injectable()
export class DashboardService {

  constructor(private commonService: CommonService, private catalogService: CatalogService,private http: HttpClient, private log: NGXLogger, private jsonp: Jsonp) {
  }

  // @RequestMapping(value = {Constants.V2_URL+"/spaces/{spaceid}/summary"}, method = RequestMethod.GET)
  getAppSummary(spaceid: string) {
    return this.commonService.doGet('/portalapi/v2/spaces/' + spaceid + '/summary', '').map((res: Response) => {
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

  // @RequestMapping(value = {Constants.V2_URL + "/service/userprovidedserviceinstances"}, method = RequestMethod.POST)
  userProvidedServiceInstances(params: any) {
    return this.commonService.doPost('/portalapi/v2/service/userprovidedserviceinstances', params, '').map((res: Response) => {
      return res;
    }).do(console.log);
  }


  StarterInit(data:any) {
    this.catalogService.starterpacks = new Array<StarterPack>();
    this.catalogService.starterpacks = data;
    this.catalogService.viewstarterpacks = this.catalogService.starterpacks;
  }

  BuildInit(data:any) {
    this.catalogService.buildpacks = new Array<BuildPack>();
    this.catalogService.buildpacks = data;
    this.catalogService.viewbuildpacks = this.catalogService.buildpacks;
  }

  ServiceInit(data:any) {
    this.catalogService.servicepacks = new Array<ServicePack>();
    this.catalogService.servicepacks = data;
    this.catalogService.viewservicepacks = this.catalogService.servicepacks;
  }

  RecentInit(data : any) {
    this.catalogService.recentpacks = [];
    this.catalogService.recentpacks = data['list'];
  }

}//

export class StarterPack
{
  buildPackCategoryNo : string;
  classification : string;
  classificationSummary : string;
  classificationValue : string;
  created : string;
  description : string;
  lastmodified : string;
  name : string;
  no : string;
  servicePackCategoryNoList : string;
  summary : string;
  thumbImgName : string;
  thumbImgPath : string;
  useYn : string;
  userId : string;
}

export class ServicePack
{
  num : number;
  appBindParameter : string;
  appBindYn : string;
  app_bind_parameter : string;
  classification : string;
  classificationSummary : string;
  classificationValue : string;
  created : string;
  dashboardUseYn : string;
  description : string;
  lastmodified : string;
  name : string;
  no : string;
  parameter : string;
  servicePackName : string;
  summary : string;
  thumbImgName : string;
  thumbImgPath : string;
  useYn : string;
  userId : string;
}

export class BuildPack
{
  appSampleFileName : string;
  appSampleFilePaht : string;
  appSampleFilePath : string;
  appSampleFileSize : string;
  buildPackName : string;
  classification : string;
  classificationSummary : string;
  classificationValue : string;
  created : string;
  description : string;
  lastmodified : string;
  name : string;
  no : string;
  summary : string;
  thumbImgName : string;
  thumbImgPath : string;
  useYn : string;
  userId : string;
}

export class Service
{
  servicePlan : string;
  boundAppCount : string;
  serviceLabel : string;
  servicePlanName : string;
  spaceName : string;
  orgName : string;
  summary : string;
  newName : string;
  name : string;
  serviceName : string;
  dashboardUrl : string;
  dashboardUseYn : string;
  serviceInstanceName : string;
  credentialsStr : string;
  classification : string;
  syslogDrainUrl : string;
}

