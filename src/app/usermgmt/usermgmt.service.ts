import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../common/common.service';
import {NGXLogger} from 'ngx-logger';
import {SecurityService} from "../auth/security.service";
import {Router} from "@angular/router";



declare var require: any;
let appConfig = require('assets/resources/env/config.json');

@Injectable()
export class UsermgmtService {
  constructor(
    private http: HttpClient, private common: CommonService, private logger: NGXLogger, private sec: SecurityService, private router: Router) {
  }

  apiversion = appConfig['apiversion'];

  userInfoAll(url, authorization) {
    return this.common.doGetMulti(url+'/commonapi/v2/users', authorization,'').map((res: any) => {
      return res;
    });
  }

  userInfo(username: string, url, authorization) {
    return this.common.doGetMulti(url+'/commonapi/v2/user/' + username, authorization,'').map((res: any) => {
      return res;
    });
  }


  userinfo(username: string) {
    return this.common.doGet('/commonapi/v2/user/' + username, this.common.getToken()).map((res: Response) => {
      return res['User'];
    });
  }


  userSave(userId: string, param: any) {
    return this.common.doPut('/commonapi/v2/user/' + userId, param, this.common.getToken()).map((res: Response) => {
      return res['result'];
    })
  }


  orgMembers(orgId: string) {
    return this.common.doGet('/portalapi/' + this.apiversion + '/orgs/' + encodeURI(orgId) + '/member',  this.common.getToken()).map((res: any) => {
      return res;
    });
  }


  updateUserPassword(userId: string, param: any) {
    return this.common.doPut('/portalapi/' + this.apiversion + '/users/' + encodeURI(userId) + '/password/update', param, this.common.getToken()).map((res: any) => {
      return res;
    });
  }

  // @DeleteMapping(V2_URL + "/user/{guid}/all")  ::CF&DB
  userAllDelete(guid: string, param: any) {
    return this.common.doDelete('/commonapi/v2/user/' + guid + '/all', '', this.common.getToken()).map((res: Response) => {
      return res;
    });
  }

  // @DeleteMapping(V2_URL + "/user/{guid}/all")  ::CF&DB
  userAllDeleteMuti(url, guid: string, authorization,  param: any) {
    return this.common.doDeleteMulti(url+'/commonapi/v2/user/' + guid+ '/all', authorization, '', '').map((res: Response) => {
      return res;
    });
  }


  // storageApiUrl + "/v2/" + storageApiType + '/';
  photoRegistration(params: any) {
    return this.common.doFilePost('/storageapi/v2/swift/', params, '').map((res: any) => {
      return res;
    });
  }

  getImg(url: string) {
    return this.common.doStorageGet(url, null).map((res: any) => {
      return res;
    });
  }

  getOrgList() {
    return this.common.doGet('/portalapi/' + this.apiversion + '/orgs', this.common.getToken()).map((res: any) => {
      return res;
    });
  }

  public back(){
    this.router.navigate(['/usermgmt']);
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
