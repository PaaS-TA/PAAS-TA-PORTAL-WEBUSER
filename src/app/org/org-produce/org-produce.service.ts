import { Injectable } from '@angular/core';
import {CommonService} from "../../common/common.service";
import {ActivatedRoute, Router} from "@angular/router";
@Injectable()
export class OrgProduceService {

  constructor(private common : CommonService, private router : Router) {}

  public getOrgNameList(url : string){
    return this.common.doGet(url, this.common.getToken()).map((res: any) => {
      return res;
    });
  }

  public getOrgQuota(url : string){
    return this.common.doGet(url, this.common.getToken()).map((res: Response) => {
      return res;
    });
  }

  public getOrgName(url : string){
    return this.common.doGet(url, this.common.getToken()).map((res: any) => {
      return res;
    });
  }
  public postOrg(url : string, body : any){
    return this.common.doPost(url, body, this.common.getToken()).map((res: any) => {
      return res;
    });
  }

  public alertSetting(msg, result){
    this.common.alertMessage(msg, result);
  }
  public back(){
    this.router.navigate(['org']);
  }

  public isLoding(value : boolean){
    this.common.isLoading = value;
  }

  public getuserId() : string{
    return this.common.getUserGuid()
  }
}
