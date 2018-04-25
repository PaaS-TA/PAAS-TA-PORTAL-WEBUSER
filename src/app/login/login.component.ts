import {Component, OnInit} from '@angular/core';
import {UaaSecurityService} from "../auth/uaa-security.service";
import {CommonService} from "../common/common.service";
import {NGXLogger} from "ngx-logger";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  error: boolean;

  constructor(public common: CommonService, private router: Router, private log: NGXLogger, private uaa: UaaSecurityService) {
  }

  ngOnInit() {
    this.error = false;
    if (this.common.getToken() == null) {
      this.common.isLogin = false;
    } else {
      this.common.isLogin = true;
      this.go();
    }
  }


  Login() {
    this.common.isLoading = true;
    console.log(this.username + " " + this.password);
    let params = {id: this.username, password: this.password};
    this.common.doPost('/portalapi/login', params, '').subscribe(data => {
      this.common.isLogin = true;
      this.common.isLoading = false;
      this.common.saveUserInfo('', data['name'], '', '');
      this.common.saveToken('', data['token'], '', '', '');
      /*
      * 임시 나중에 지워야함
       */
      this.go();
      this.log.debug(data);

    }, error => {
      this.error = true;
      this.common.isLoading = false;
    });
  }

  oAuthLogin() {
    this.uaa.doAuthorization();
  }


  go() {
    let params = {name: 'github-test-app', guid: '80dd102d-8068-4997-b518-c3f04bcdd00f'};
    this.router.navigate(['appMain'], {queryParams: params});
  }

}
