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


  constructor(private common: CommonService, private router: Router, private log: NGXLogger) {
    if (common.getToken() == null) {
      common.isLogin = false;
      this.isLogin  = false;

    } else {
      common.isLogin = true;
      this.isLogin  = true;
    }
  }


}

