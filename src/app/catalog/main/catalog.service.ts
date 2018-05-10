import { Injectable } from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {CommonService} from "../../common/common.service";

@Injectable()
export class CatalogService {
  COMMONAPI : string = '/commonapi';
  V2_URL : string = '/v2';
  DEVELOPGET : string = this.COMMONAPI + this.V2_URL +'/developpacks';
  TEMPLATEGET : string = this.COMMONAPI + this.V2_URL + '/starterpacks';
  SEARCHGET : string = this.COMMONAPI + this.V2_URL + '/packs';
  HISTORYGET : string = this.COMMONAPI + this.V2_URL + '/history/';
  STARTERGET : string = this.COMMONAPI + this.V2_URL + '/packrelation/';


  userid : string;
  buildpacks : Array<BuildPack> = Array<BuildPack>();
  templates : Array<Template> = Array<Template>();
  recentpacks : Array<BuildPack|Template> = Array<BuildPack|Template>();
  constructor(private common: CommonService, private log: NGXLogger) {
    this.userid = common.getUserid();
  }

  developInit()
  {
    this.common.doGET(this.DEVELOPGET, null).subscribe(data => {
      this.BuildPackInit(data['list']);
    });
    this.common.doGET(this.TEMPLATEGET, null).subscribe(data =>{
        this.TemplateInit(data['list']);
    })
    this.common.doGET(this.HISTORYGET+this.userid+'?searchKeyword=', null).subscribe(data =>{
     let lenght = data['list'].length;
      for(let i =0; i < lenght; i++) {
        let dev = data['list'][i];
        this.recentpacks[i] = dev;
        console.log(this.recentpacks[i]);
      }

    })
  }

  Search(searchKeyword : string)
  {
    this.common.doGET(this.SEARCHGET+'?searchKeyword='+searchKeyword, null).subscribe(data => {this.BuildPackInit(data['BuildPackList']); this.TemplateInit(data['TemplateList']);});
    this.recentpacks = new Array<BuildPack|Template>();
    this.common.doGET(this.HISTORYGET+this.userid+'?searchKeyword='+searchKeyword, null).subscribe(data =>{
      let lenght = data['list'].length;
      for(let i =0; i < lenght; i++) {
        let dev = data['list'][i];
        this.recentpacks[i] = dev;
        console.log(this.recentpacks[i]);
      }})
  }

  BuildPackInit(data : any) {
    this.buildpacks = new Array<BuildPack>();
    for(let i = 0 ; i < data.length ; i++) {
      this.buildpacks[i] = data[i];
    }
  }

  TemplateInit(data : any) {
    this.templates = new Array<Template>();
    for(let i = 0 ; i < data.length ; i++) {
      this.templates[i] = data[i];
    }
  }

  CatalogDetailInit(no : number){
    return this.common.doGET(this.STARTERGET+no ,null).map((res: Response) => {
      return res;
    });
  }

  getOrglist() {
    return this.common.doGET('/portalapi/v2/orgs', this.common.getToken()).map((res: Response) => {
      return res;
    });
  }

  getSpacelist(orgid : String) {
    return this.common.doGET('/portalapi/v2/orgs/' + orgid + '/spaces', this.common.getToken()).map((res: Response) => {
      return res;
    });
  }
  getDomain() {
      return this.common.doGET('/portalapi/v2/domains/shared', this.common.getToken()).map((res: Response) => {
        return res;
      });
    }
  postApp(url : string, param : any){
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
    return this.common.doGET('/commonapi/v2/app/uploadsfile', null).map((res: Response) => {
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

export class Template
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
