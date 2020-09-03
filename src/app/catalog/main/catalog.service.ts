import { Injectable } from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {CommonService} from "../../common/common.service";
import {CATALOGURLConstant} from "../common/catalog.constant";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {isUndefined} from "util";
declare var $: any;


declare var require: any;
let appConfig = require('assets/resources/env/config.json');

@Injectable()
export class CatalogService {

  apiversion = appConfig['apiversion'];

  buildpacks : Array<any> = [];
  starterpacks : Array<any> = [];
  recentpacks : Array<any> = [];
  servicepacks : Array<any> = [];
  lasttime : number;
  check : boolean = true;
  viewstartpack : boolean = true;
  viewbuildpack : boolean = true;
  viewservicepack : boolean = true;

  viewstarterpacks : any = [];
  viewbuildpacks  : any = [];
  viewservicepacks  : any = [];


  buildPackfilter : string = '';
  servicePackfilter : string = '';
  first : string = 'cur';
  classname : string;
  navview : string;
  translateEntities : any;
  autoSearch : boolean = false;
  constructor(private common: CommonService, private log: NGXLogger, private translate: TranslateService ) {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateEntities = event.translations.catalog;
    });
    this.translate.get('catalog').subscribe((res: string) => {
      this.translateEntities = res;
    });
  }

  viewPacks(value, value2, value3){
    this.viewstartpack  = value;
    this.viewbuildpack  = value2;
    this.viewservicepack  = value3;
    if(this.viewstartpack){
      this.viewstarterpacks;
    }
    if(this.viewbuildpack){
      this.viewbuildpacks;
    }
    if(this.viewservicepack){
      this.viewservicepacks;
    }
  }

  buildPackFilter(){
    if(this.buildPackfilter !== ''){
      this.viewbuildpacks = this.buildpacks.filter(data => { if(data.classification === this.buildPackfilter){
      return data;
      }});
    }
    else {
      this.viewbuildpacks = this.buildpacks;
    }
  }

  set navView(value){
    this.navview = value;
  }



  get navView(){
    if(!isUndefined(this.translateEntities)) {
      if(!isUndefined(this.navview)){
      return this.translateEntities.nav[this.navview];
    } return this.translateEntities.nav.viewAll;
    } return '';
  }
  servicePackFilter(){
    if(this.servicePackfilter !== ''){
    this.viewservicepacks = this.servicepacks.filter(data => { if(data.classification === this.servicePackfilter){
      return data;
    }});
    }
    else{
      this.viewservicepacks = this.servicepacks;
    }
  }

  isLoading(value){
    this.common.isLoading = value;
  }

  alertMessage(value, result){
    this.common.alertMessage(value, result);
  }

  getUserId(){
    return this.common.getUserid();
  }

  getOrgName(){
    return this.common.getCurrentOrgName();
  }

  getSpaceName(){
    return this.common.getCurrentSpaceName();
  }

  getOrgGuid(){
    return this.common.getCurrentOrgGuid();
  }

  setCurrentOrg(name, guid){
    this.common.setCurrentOrgName(name);
    this.common.setCurrentOrgGuid(guid);
  }

  setCurrentSpace(name, guid){
    this.common.setCurrentSpaceName(name);
    this.common.setCurrentSpaceGuid(guid);
  }

  setCurrentCatalogNumber(number){
    this.common.setCurrentCatalogNumber(number);
  }

  getCurrentCatalogNumber(){
    return this.common.getCurrentCatalogNumber();
  }

  getUserid() : string{
    return this.common.getUserid();
  }

  getRecentPacks(url : string) {
    return this.common.doGet(url, "token").map((res: Response) => {
      return res;
    });
  }

  getRoutes(url : string) {
    return this.common.doGet(url, this.common.getToken()).map((res: Array<string>) => {
      return res;
    });
  }

  getStarterPacks(url : string) {
    return this.common.doGet(url, this.common.getToken()).map((res: Response) => {
      return res;
    });
  }

  getBuildPacks(url : string) {
    return this.common.doGet(url, this.common.getToken()).map((res: Response) => {
      return res;
    });
  }

  getServicePacks(url : string) {
    return this.common.doGet(url, this.common.getToken()).map((res: Response) => {
      return res;
    });
  }

  getSearchPack(url : string) {
    return this.common.doGet(url, this.common.getToken()).map((res: Response) => {
      return res;
    });
  }

  CatalogDetailInit(no : number){
    return this.common.doGet(CATALOGURLConstant.GETSTARTERRELATION +no ,this.common.getToken()).map((res: Response) => {
      return res;
    });
  }

  getOrglist() {
    return this.common.doGet('/portalapi/' + this.apiversion + '/orgs', this.common.getToken()).map((res: Response) => {
      return res;
    });
  }

  getSpacelist(orgid : string) {
    return this.common.doGet('/portalapi/' + this.apiversion + '/orgs/' + orgid + '/spaces', this.common.getToken()).map((res: Response) => {
      return res;
    });
  }
  getDomain(url : string) {
      return this.common.doGet(url, this.common.getToken()).map((res: Response) => {
        return res;
      });
    }

  getSecretDomain(){
    return this.common.doGet('/portalapi/' + this.apiversion + '/domains/private', this.common.getToken()).map((res: Response) => {
      return res;
    });
  }

  getRouteCheck(url : string){
    return this.common.doGet(url, this.common.getToken()).map((res: Response) => {
      return res;
    });
  }

  getServicePlan(url : string){
    return this.common.doGet(url, this.common.getToken()).map((res: Response) => {
      return res;
    });
  }

  getNameCheck(url : string){
    return this.common.doGet(url, this.common.getToken()).map((res: Response) => {
      return res;
    });
  }

  getAppNames(url : string){
    return this.common.doGet(url, this.common.getToken()).map((res: Response) => {
      return res;
    });
  }
  getServiceInstance(url : string){
    return this.common.doGet(url, this.common.getToken()).map((res: Response) => {
      return res;
    });
  }

  getOrgPrivateDomain(url : string){
    return this.common.doGet(url, this.common.getToken()).map((res: any) => {
      return res;
    });
  }

  getImg(url : string){
    return this.common.doStorageGet(url, null  ).map((res : any) => {
      return res;
    });
  }

  getDiskOption(){
    return this.common.doGet('/commonapi/v2/APP_DISK_SIZE/codegroup', null  ).map((res : any) => {
      return res;
    });
  }

  getMemoryOption(){
    return this.common.doGet('/commonapi/v2/APP_MEMORY_SIZE/codegroup', null  ).map((res : any) => {
      return res;
    });
  }

  postApp(url : string, param : any){
    return this.common.doPost(url,param, this.common.getToken()).map((res: Response) => {
      return res;
    });
  }


  postHistroy(url : string, param : any){
    return this.common.doCommonPost(url,param).map((res: Response) => {
      return res;
    });
  }

  postCreateService(url : string, param : any){
    return this.common.doPost(url,param, this.common.getToken()).map((res: any) => {
      return res;
    });
  }

  putAppStart(url : string, param : string){
    return this.common.doPut(url,param, this.common.getToken()).map((res: Response) => {
      return res;
    });
  }
  
  userAppRegistration(params: any) {
  	return this.common.doFilePost('/storageapi/v2/swift/', params, '').map((res: any) => {
      return res;
    });
  }
  
  userAppDelete(name : String) {
  	return this.common.doDelete('/storageapi/v2/swift/' + name, name, '').map((res: any) => {
      return res;
    });
  }

  upload(){
    return this.common.doGet('/commonapi/v2/app/uploadsfile', this.common.getToken()).map((res: Response) => {
      return res;
    });
  }
}
