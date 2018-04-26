import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CommonService} from "../common/common.service";
import {UaaSecurityService} from "../auth/uaa-security.service";
import {NGXLogger} from "ngx-logger";

@Injectable()
export class LoginService {


  constructor(public common: CommonService, private router: Router, private route: ActivatedRoute, private log: NGXLogger, private uaa: UaaSecurityService) {
  }


  apiLogin(username: string, password: string) {
    this.common.isLoading = true;
    console.log(username + " " + password);
    let params = {id: username, password: password};
    return this.common.doPost('/portalapi/login', params, '').map(data => {
      this.common.saveUserInfo('', data['name'], '', '', '', '', '', '', '');
      this.common.saveToken('', data['token'], '', '', '');
      return data;
    });
  }


  oAuthLogin() {
    this.log.debug('oAuth Login');
    this.uaa.doAuthorization();
  }
}
