import {Component} from '@angular/core';
import {UaaSecurityService} from './auth/uaa-security.service';
import {CommonService} from './common/common.service';
import {Router} from '@angular/router';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  isLogin: boolean;
  loading: boolean;
  username: string;
  password: string;
  token: string;
  user: object;
  error: boolean;

  constructor(private common: CommonService, private router: Router, private log: NGXLogger, private uaa: UaaSecurityService) {
    this.error = false;
    if (common.getToken() == null) {
      common.isLogin = false;
      this.isLogin = false;
    } else {
      common.isLogin = true;
      this.isLogin = true;
    }
  }


  Login() {
    this.loading = true;
    console.log(this.username + " " + this.password);

    let params = {id: this.username, password: this.password};
    this.common.doPost('/portalapi/login', params, '').subscribe(data => {
      this.loading = false;
      this.common.isLogin = true;
      this.common.saveUserInfo('', data['name'], '', '');
      this.common.saveToken('', data['token'], '', '', '');
      this.isLogin = true;
      this.router.navigate(['appMain']);
      this.log.debug(data);
    }, error => {
      this.error = true;
    });
  }

  oAuthLogin() {
    this.uaa.doAuthorization();
  }

}

