import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../common/common.service';
import {NGXLogger} from 'ngx-logger';

import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DashboardService} from '../dashboard.service';
import {OrgService} from "../../org/common/org.service";
import {Organization} from "../../model/organization";
import {SpaceService} from "../../space/space.service";
import {Space} from '../../model/space';
import {SecurityService} from "../../auth/security.service";

declare var $: any;
declare var jQuery: any;


@Component({
  selector: 'app-dashboard-produce',
  templateUrl: './dashboard-produce.component.html',
  styleUrls: ['./dashboard-produce.component.css']
})
export class DashboardProduceComponent implements OnInit {

  constructor(private commonService: CommonService,
              private dashboardService: DashboardService,
              private orgService: OrgService,
              private spaceService : SpaceService,
              private log: NGXLogger,
              private security: SecurityService,
              router: Router, private http: HttpClient) {
    if (commonService.getToken() == null) {
      router.navigate(['/']);
    }

  }

  ngOnInit() {
    console.log('ngOnInit fired');

    $(document).ready(() => {
      // TODO 임시로...
      $.getScript('../../assets/resources/js/common.js')
        .done(function(script, textStatus) {
          // console.log( textStatus );
        })
        .fail(function(jqxhr, settings, exception) {
          console.log(exception);
        });
    });
  }

}
