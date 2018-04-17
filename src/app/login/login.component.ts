import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommonService} from '../common/common.service';
import {authConfig, UaaSecurityService} from '../auth/uaa-security.service';
import {HttpHeaders} from '@angular/common/http';
import {NGXLogger} from 'ngx-logger';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private loading: boolean;
  private username: string;
  private password: string;
  private token: string;


  constructor(private router: Router, private common: CommonService, private uaa: UaaSecurityService, private log: NGXLogger) {
    this.loading = false;
    this.username = '';
    this.password = '';
    this.token = '';
    this.log.debug("DEBUG LOGIN")
    // uaa.doAuthorization();
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

  oAuthLogin(){
    this.uaa.doAuthorization();
  }

}


