import { Injectable } from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {CommonService} from "../../common/common.service";
import {CATALOGURLConstant} from "../common/catalog.constant";

@Injectable()
export class CatalogService {

  buildpacks : Array<BuildPack> = Array<BuildPack>();
  starterpacks : Array<StarterPack> = Array<StarterPack>();
  recentpacks : Array<any> = Array<any>();
  servicepacks : Array<ServicePack> = Array<ServicePack>();
  lasttime : number;
  viewstartpack : boolean = true;
  viewbuildpack : boolean = true;
  viewservicepack : boolean = true;

  viewstarterpacks : Array<StarterPack>;
  viewbuildpacks  : Array<BuildPack>;
  viewservicepacks  : Array<ServicePack>;


  buildPackfilter : string = '';
  servicePackfilter : string = '';
  constructor(private common: CommonService, private log: NGXLogger) {
  }

  viewPacks(value, value2, value3){
    this.viewstartpack  = value;
    this.viewbuildpack  = value2;
    this.viewservicepack  = value3;
    if(this.viewstartpack){
      this.viewstarterpacks = this.starterpacks;
    }
    if(this.viewbuildpack){
      this.viewbuildpacks = this.buildpacks;
    }
    if(this.viewservicepack){
      this.viewservicepacks = this.servicepacks;
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

  getUserid() : string{
    return this.common.getUserid();
  }

  getRecentPacks(url : string) {
    return this.common.doGet(url, null).map((res: Response) => {
      return res;
    });
  }

  getRoutes(url : string) {
    return this.common.doGet(url, null).map((res: Array<string>) => {
      return res;
    });
  }

  getStarterPacks(url : string) {
    return this.common.doGet(url, null).map((res: Response) => {
      return res;
    });
  }

  getBuildPacks(url : string) {
    return this.common.doGet(url, null).map((res: Response) => {
      return res;
    });
  }

  getServicePacks(url : string) {
    return this.common.doGet(url, null).map((res: Response) => {
      return res;
    });
  }

  getSearchPack(url : string) {
    return this.common.doGet(url, null).map((res: Response) => {
      return res;
    });
  }

  CatalogDetailInit(no : number){
    return this.common.doGet(CATALOGURLConstant.GETSTARTERRELATION +no ,null).map((res: Response) => {
      return res;
    });
  }

  getOrglist() {
    return this.common.doGet('/portalapi/v2/orgs', this.common.getToken()).map((res: Response) => {
      return res;
    });
  }

  getSpacelist(orgid : string) {
    return this.common.doGet('/portalapi/v2/orgs/' + orgid + '/spaces', this.common.getToken()).map((res: Response) => {
      return res;
    });
  }
  getDomain() {
      return this.common.doGet('/portalapi/v2/domains/shared', this.common.getToken()).map((res: Response) => {
        return res;
      });
    }

  getRouteCheck(url : string){
    return this.common.doGet(url, null).map((res: Response) => {
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
    return this.common.doPost(url,param, this.common.getToken()).map((res: Response) => {
      return res;
    });
  }

  putAppStart(url : string, param : string){
    return this.common.doPut(url,param, this.common.getToken()).map((res: Response) => {
      return res;
    });
  }

  upload(){
    return this.common.doGet('/commonapi/v2/app/uploadsfile', null).map((res: Response) => {
      return res;
    });
  }


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
