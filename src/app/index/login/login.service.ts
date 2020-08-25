import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CommonService} from "../../common/common.service";
import {SecurityService} from "../../auth/security.service";
import {NGXLogger} from "ngx-logger";
import {Observable} from "rxjs/Observable";

declare  var require : any;
let appConfig = require('assets/resources/env/config.json');
@Injectable()
export class LoginService {


  constructor(public common: CommonService, private router: Router, private route: ActivatedRoute, private log: NGXLogger, private sec: SecurityService) {
  }

  observable: Observable<boolean>;

  apiLogin(username: string, password: string) {
    this.common.isLoading = true;
    let params = {id: username, password: password};
    return this.common.doPost('/portalapi/login', params, '').map(data => {
      //this.log.debug(data);
      this.common.saveToken(data['token_type'], data['token'], data['refresh_token'], data['expire_in'], data['scope'], 'API');

      this.sec.doUserInfoProvider(data['user_name']);
      return data;
    });
  }

  oAuthLogin() {
    this.sec.doAuthorization();
  }


  doGo(returnUrl: string) {
    if (returnUrl == null || returnUrl == '/' ) {
      returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
      this.router.navigate([ returnUrl ]);
    } else {
      let params = this.common.setParams(returnUrl);
      this.router.navigate([this.common.setUrl(returnUrl)], {queryParams: params});
    }
  }
}
