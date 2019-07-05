import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SecurityService} from '../auth/security.service';
import {NGXLogger} from 'ngx-logger';
import {CommonService} from '../common/common.service';

declare var require: any;
let appConfig = require('assets/resources/env/config.json');

@Component({
  selector: 'app-callback',
  template: '',
  styles: []
})
export class CallbackComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private commonService: CommonService, private sec: SecurityService, private log: NGXLogger) {
    // this.log.debug('callback');
    this.commonService.isLoading = true;


  }

  ngOnInit() {
    this.callback();
  }

  callback() {
    if (this.commonService.getToken() != null) {
      // this.sec.doUserInfo();
      this.sec.doCheckToken();
    } else {
      this.route.queryParams.subscribe(params => {
        this.commonService.isLoading = false;
        if (params != null) {
          if (params['code'] == 'undefined' || params['code'] == null) {
            this.router.navigate(['/login']);
          }
          if (params['error'] != null) {
            this.router.navigate(['/login']);
          } else {
            appConfig['code'] = params.code;
            this.sec.doToken();
          }
        } else {
          this.router.navigate(['/login']);
        }
      });

    }
  }

}
