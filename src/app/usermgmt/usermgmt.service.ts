import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CommonService} from "../common/common.service";
import {NGXLogger} from "ngx-logger";
import {Observable} from "rxjs/Observable";
import {OrgService} from "../org/org.service";
import {Organization} from "../model/organization";
import {OrgURLConstant} from "../org/org.constant";

@Injectable()
export class UsermgmtService {

   constructor(private http: HttpClient, private common: CommonService,  private logger: NGXLogger, private orgService: OrgService,) {
    console.log(this.common.getToken());
    console.log(this.common.getUserid());
  }

  userinfo(usernmae:string) {
    return this.common.doGET('/commonapi/user/getUser/' + usernmae, this.common.getToken()).map((res: Response) => {
      return res['User'];
    });
  }

  userSave(userId: string, param) {
    return this.common.doPut('/commonapi/user/updateUser/' + userId, param ,this.common.getToken()).map((res: Response) => {
        return res['result'];
    });
  }

}

export class User {
  address: string;
  addressDetail: string;
  adminYn: boolean;
  authAccessCnt: string;
  authAccessTime: string;
  imgPath: string;
  refreshToken: string;
  status: string;
  tellPhone: string;
  userId: string;
  zipCode: string;
  userName: string;
}
