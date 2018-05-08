import {Component, OnInit} from '@angular/core';
import {CommonService} from '../common/common.service';
import {Router} from '@angular/router';
import {NGXLogger} from 'ngx-logger';
import {SecurityService} from '../auth/security.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router, private common: CommonService,private log: NGXLogger) {
    this.LogOut();
    router.navigate(['/']);
  }

  ngOnInit() {
  }

  LogOut() {
    this.common.isLogin = false;
    this.log.debug('Logout:::::::::::::::::::::::::::::::::::::::');
    this.common.signOut();
    this.router.navigate(['/']);
  }

}
