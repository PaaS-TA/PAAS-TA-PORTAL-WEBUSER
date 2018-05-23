import { Injectable } from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {CommonService} from "../../common/common.service";

@Injectable()
export class CatalogService {
  COMMONAPI : string = '/commonapi';
  V2_URL : string = '/v2';
  STARTERGET : string = this.COMMONAPI + this.V2_URL + '/packrelation/';
  buildpacks : Array<BuildPack> = Array<BuildPack>();
  starterpacks : Array<StarterPack> = Array<StarterPack>();
  recentpacks : Array<any> = Array<any>();
  servicepacks : Array<Service> = Array<Service>();
  lasttime : number;
  constructor(private common: CommonService, private log: NGXLogger) {
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
    return this.common.doGet(this.STARTERGET+no ,null).map((res: Response) => {
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

export class Service
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
