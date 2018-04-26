import {Component, OnInit} from '@angular/core';
import {UaaSecurityService} from "../auth/uaa-security.service";
import {CommonService} from "../common/common.service";
import {NGXLogger} from "ngx-logger";
import {ActivatedRoute, Router} from "@angular/router";
import {LoginService} from "./login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error: boolean;
  returnUrl: string;
  public username: string;
  public password: string;


  constructor(public common: CommonService, private router: Router, private route: ActivatedRoute, private log: NGXLogger, private uaa: UaaSecurityService, private loginService: LoginService) {

  }

  ngOnInit() {
    this.error = false;
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if (this.common.getToken() != null) {
      this.doGo();
    }
  }


  apiLogin() {
    this.common.isLoading = true;
    let isLogin = this.loginService.apiLogin(this.username, this.password).subscribe(data => {
      this.common.isLoading = false;
      this.log.debug(data);
      this.doGo();
    }, error => {
      this.error = true;
      this.common.isLoading = false;
    });

  }


  oAuthLogin() {
    this.loginService.oAuthLogin();
  }


  reEnter(type: string) {
    this.error = false;
  }


  doGo() {
    if (this.returnUrl == null || this.returnUrl == '/') {
      let params = {name: 'github-test-app', guid: '80dd102d-8068-4997-b518-c3f04bcdd00f'};
      this.router.navigate(['appMain'], {queryParams: params});
    } else {
      let params = this.common.setParams(this.returnUrl);
      this.router.navigate([this.common.setUrl(this.returnUrl)], {queryParams: params});
    }
  }


}

export interface Param {
  [name: string]: any;
}
