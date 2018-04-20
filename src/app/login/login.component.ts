import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommonService} from '../common/common.service';
import {authConfig, UaaSecurityService} from '../auth/uaa-security.service';
import {HttpHeaders} from '@angular/common/http';
import {NGXLogger} from 'ngx-logger';
import {LoginService, User} from './login.service';
import construct = Reflect.construct;
import {Observable} from 'rxjs/Observable';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading: boolean;
  username: string;
  password: string;
  token: string;
  user: Observable<User>;

  constructor(private router: Router, private common: CommonService, private uaa: UaaSecurityService, private log: NGXLogger, private loginService: LoginService) {
    this.loading = false;
    this.username = '';
    this.password = '';
    this.token = '';
    this.log.debug('DEBUG LOGIN');
    // uaa.doAuthorization();

    this.test();
  }


  ngOnInit() {
  }

  Login(username: string, password: string) {

    this.loading = true;
    let params = {id: this.username, password: this.password};
    this.common.doPost('/portalapi/login', params, '').subscribe(data => {
      this.router.navigate(['dashboard']);
      this.loading = false;
      this.common.isLogin = true;
      this.common.saveToken('',data['token'],'','','');
      this.log.debug( data);
    });
  }

  oAuthLogin() {
    this.uaa.doAuthorization();
  }

  test() {
    this.loginService.test('swmoon').subscribe(data => {
      this.user = data;
      return data;
    });
  }

}


