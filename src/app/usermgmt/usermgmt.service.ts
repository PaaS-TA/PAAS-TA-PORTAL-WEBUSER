import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../common/common.service';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs/Observable';
import { OrgService } from '../org/common/org.service';
import { Organization } from '../model/organization';
import { OrgURLConstant } from '../org/common/org.constant';
import {SecurityService} from "../auth/security.service";

@Injectable()
export class UsermgmtService {
  constructor(
    private http: HttpClient, private common: CommonService, private logger: NGXLogger,
    private orgService: OrgService, private log: NGXLogger, private sec: SecurityService) {
    console.log(this.common.getToken());
    console.log(this.common.getUserid());
  }

  userinfo(username: string) {
    return this.common.doGet('/commonapi/v2/user/' + username, this.common.getToken()).map((res: Response) => {return res['User'];});
  }

  userSave(userId: string, param:any) {
    return this.common.doPut('/commonapi/v2/user/' + userId, param, this.common.getToken()).map((res: Response) => {return res['result'];});
  }

  updateUserPassword(userId:string ,param:any){
    console.log('TOKEN ::: ' + this.common.getToken());
    return this.common.doPut('/portalapi/v2/users/' +userId + '/password/update', param, this.common.getToken()).map((res: Response) => {return res['result'];});
  }

  // @DeleteMapping(V2_URL + "/user/{guid}/all")  ::CF&DB
  userAllDelete(guid: string, param:any){
    return this.common.doDelete('/commonapi/v2/user/' + guid+ '/all', '', this.common.getToken()).map((res: Response) => {this.log.debug(res); return res;});
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
