import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommonService} from '../common/common.service';
import {CatalogService} from '../catalog/main/catalog.service';
import {NGXLogger} from 'ngx-logger';
import 'rxjs/add/operator/map';
import {Jsonp} from '@angular/http';
import {CATALOGURLConstant} from "../catalog/common/catalog.constant";


declare var require: any;
let appConfig = require('assets/resources/env/config.json');

@Injectable()
export class DashboardService {

  apiversion = appConfig['apiversion'];

  constructor(private commonService: CommonService, private catalogService: CatalogService, private http: HttpClient, private log: NGXLogger, private jsonp: Jsonp) {
  }

  // @RequestMapping(value = {Constants.V2_URL+"/spaces/{spaceid}/summary"}, method = RequestMethod.GET)
  getAppSummary(spaceid: string) {
    return this.commonService.doGet('/portalapi/' + this.apiversion + '/spaces/' + spaceid + '/summarylist', this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  // @RequestMapping(value = {Constants.V2_URL + "/apps/{guid}/rename"}, method = RequestMethod.PUT)
  renameApp(params: any) {
    return this.commonService.doPut('/portalapi/' + this.apiversion + '/apps/' + params.guid + '/rename', params, this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  // @RequestMapping(value = {Constants.V2_URL +"/apps"}, method = RequestMethod.DELETE)
  delApp(params: any) {
    return this.commonService.doDelete('/portalapi/' + this.apiversion + '/apps/' + params.guid, null, this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  // @RequestMapping(value = {Constants.V3_URL + "/apps/startApp"}, method = RequestMethod.POST)
  startApp(params: any) {
    return this.commonService.doPost('/portalapi/' + this.apiversion + '/apps/startApp', params, '').map((res: any) => {
      return res;
    });
  }

  // @RequestMapping(value = {Constants.V2_URL + "/service/{guid}/rename"}, method = RequestMethod.PUT)
  renameInstance(params: any) {
    return this.commonService.doPut('/portalapi/' + this.apiversion + '/service/' + params.guid + '/rename', params, this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  // @RequestMapping(value = {Constants.V2_URL + "/service/{guid}"}, method = RequestMethod.DELETE)
  delInstance(params: any) {
    return this.commonService.doDelete('/portalapi/' + this.apiversion + '/service/' + params.guid, null, this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  getBinding(guid: string) {
    return this.commonService.doGet('/portalapi/' + this.apiversion + '/service/' + guid + '/binding', this.commonService.getToken()).map((res: any) => {
      return res;
    })
  }

// @RequestMapping(value = {Constants.V2_URL + "/service/userprovidedserviceinstances/{guid}"}, method = RequestMethod.GET)
  userProvidedInfo(guid: string) {
    return this.commonService.doGet('/portalapi/' + this.apiversion + '/service/userprovidedserviceinstances/' + guid, this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  // @RequestMapping(value = {Constants.V2_URL + "/service/userprovidedserviceinstances"}, method = RequestMethod.POST)
  createUserProvided(params: any) {
    return this.commonService.doPost('/portalapi/' + this.apiversion + '/service/userprovidedserviceinstances', params, this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  // @RequestMapping(value = {Constants.V2_URL + "/service/userprovidedserviceinstances/{guid}"}, method = RequestMethod.PUT)
  updateUserProvided(params: any) {
    return this.commonService.doPut('/portalapi/' + this.apiversion + '/service/userprovidedserviceinstances/' + params.guid, params, this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  getServicePacks() {
    return this.commonService.doGet('/commonapi/v2/servicepacks', this.commonService.getToken()).map((res: any) => {
      return res;
    })
  }

  getBuildPacks() {
    return this.commonService.doGet('/commonapi/v2/developpacks', this.commonService.getToken()).map((res: any) => {
      return res;
    })
  }

  // @GetMapping(V2_URL + "/orgs")
  getOrgList() {
    return this.commonService.doGet('/portalapi/' + this.apiversion + '/orgs', this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  // @GetMapping(V2_URL + "/orgs/{orgId}/spaces")
  getOrgSpaceList(orgId: string) {
    return this.commonService.doGet('/portalapi/' + this.apiversion + '/orgs/' + orgId + '/spaces', this.commonService.getToken()).map((res: any) => {
      return res['spaceList'];
    });
  }

  // @GetMapping(V2_URL + "/orgs/{orgId}/summary")
  getOrgSummary(orgId: string) {
    return this.commonService.doGet('/portalapi/' + this.apiversion + '/orgs/' + orgId + '/summary', this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  RecentInit(data: any) {
    this.catalogService.recentpacks = [];
    this.catalogService.recentpacks = data['list'];
  }

  getCodeMax(groudid: string) {
    return this.commonService.doGet('/commonapi/v2/' + groudid + '/codedetail', this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  getCaasCommonUser(){
    return this.commonService.doGetCaas(":3334/users").map((res: any) => {
      return res;
    });
  }

  getCaasAPI(rest: string){
    return this.commonService.doGetCaas(":3333/" + rest).map((res: any) => {
      return res;
    });
  }

}//

export class Service {
  servicePlan: string;
  boundAppCount: string;
  serviceLabel: string;
  servicePlanName: string;
  spaceName: string;
  orgName: string;
  summary: string;
  newName: string;
  name: string;
  serviceName: string;
  dashboardUrl: string;
  dashboardUseYn: string;
  newServiceInstanceName: string;
  serviceInstanceName: string;
  credentialsStr: string;
  classification: string;
  syslogDrainUrl: string;
  docFileUrl: string;
  type: string;
}

