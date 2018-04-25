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

  loading: boolean;
  username: string;
  password: string;
  token: string;
  user: object;
  error: boolean;

  constructor(public common: CommonService, private router: Router, private log: NGXLogger, private uaa: UaaSecurityService) {

  }

  ngOnInit() {
    //this.router.navigate(['index']);
  }



}

