import {Injectable} from '@angular/core';
import {CommonService} from "../../common/common.service";
import {Router} from "@angular/router";
import {NGXLogger} from "ngx-logger";


declare var require: any;
let appConfig = require('assets/resources/env/config.json');

@Injectable()
export class ExternalcommonService {

  apiversion = appConfig['apiversion'];

  constructor(private commonService: CommonService, public log: NGXLogger) {
  }


  getUserTokenInfo(userId: string, token: string) {
    return this.commonService.doGet('/commonapi/v2/users/' + userId + '/search/refreshtoken?refreshToken=' + token,  '');
  }


  reset(param) {
    this.log.debug("reset >>" + param);
    return this.commonService.doPost('/portalapi/' + this.apiversion + '/users/password/reset', param, '');
  }


  reset_external(url, param) {
    this.log.debug("reset_external >>" + url);
    return this.commonService.doPost2(url + '/portalapi/' + this.apiversion + '/users/password/reset', param, '');
  }


  updateInfo(userId: string, param) {
    return this.commonService
      .doPut('/commonapi/v2/user/' + userId, param, '').map((res: Response) => {
        return res['result'];
      }).subscribe();
  }

  createUser(param) {
    return this.commonService.doPost('/portalapi/' + this.apiversion + '/users', param, '');
  }

  createUser_external(url,param) {
    return this.commonService.doPost2(url + '/portalapi/' + this.apiversion + '/users', param, '');
  }

}
