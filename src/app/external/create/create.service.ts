import {Injectable} from '@angular/core';
import {CommonService} from "../../common/common.service";
import {UsermgmtService} from "../../usermgmt/usermgmt.service";

declare var require: any;
let appConfig = require('assets/resources/env/config.json');

@Injectable()
export class CreateService {

  apiversion = appConfig['apiversion'];

  constructor(private  commonService: CommonService, private userMgmtService: UsermgmtService) {
  }


  getUserTokenInfo(userId: string, token: string) {
    return this.commonService.doGet('/commonapi/v2/users/' + userId + '/search/refreshtoken?refreshToken=' + token, '');
  }


  createUser(param) {
    return this.commonService.doPost('/portalapi/' + this.apiversion + '/users', param, '');
  }

  updateToken(userId: string, param) {
    return this.commonService
      .doPut('/commonapi/v2/user/' + userId, param, '').map((res: Response) => {
        return res['result'];
      }).subscribe();
  }
}
