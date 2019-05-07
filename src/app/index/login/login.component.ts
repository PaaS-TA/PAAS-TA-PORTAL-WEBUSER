import {Component, OnInit} from '@angular/core';
import {SecurityService} from "../../auth/security.service";
import {CommonService} from "../../common/common.service";
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
  errorMsg: string;
  returnUrl: string;
  public username: string;
  public password: string;


  constructor(public common: CommonService, private router: Router, private route: ActivatedRoute, private log: NGXLogger, private loginService: LoginService) {
    this.log.debug("login()");
    this.error = false;
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if (this.common.getToken() != null) {
      this.loginService.doGo(this.returnUrl);
    }else{
      this.common.isLoading = true;
      this.oAuthLogin();
    }
    let err = this.route.snapshot.queryParams['error'];
    //this.log.debug('ERROR : ' + err);
    if (err != null) {
      this.showMsg(err);
    }
  }

  ngOnInit() {

  }


  apiLogin() {
    this.common.signOut();
    this.common.isLoading = true;
    this.loginService.apiLogin(this.username, this.password).subscribe(data => {
    }, error => {
      this.showMsg('');
      this.common.isLoading = false;
    });

  }


  oAuthLogin() {
    this.common.signOut();
    this.loginService.oAuthLogin();
  }


  showMsg(msg: string) {
    this.common.signOut();
    this.common.isLoading = false;
    if (msg == '') {
      this.errorMsg = '사용자 계정 또는 비밀번호가 틀렸습니다.';
    }
    else if (msg == '1') {
      this.errorMsg = '로그인 과정에 문제가 발생하였습니다. 관리자에게 문의 하시길 바랍니다.';
    } else {
      this.errorMsg = msg;
    }
    //this.log.debug('ERROR');
    this.error = true;
  }

  hideMsg() {
    this.error = false;
  }

}

export interface Param {
  [name: string]: any;
}
