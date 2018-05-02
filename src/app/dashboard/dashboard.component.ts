import {Component, OnInit} from '@angular/core';
import {CommonService} from '../common/common.service';
import {NGXLogger} from 'ngx-logger';
import {UaaSecurityService} from '../auth/uaa-security.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DashboardService} from './dashboard.service';
import {OrgService} from "../org/common/org.service";
import {Organization} from "../model/organization";
import {SpaceService} from "../space/space.service";
import {Space} from '../model/space';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {

  public userid: string;
  public token: string;


  orgs: Array<Organization>;
  spaces: Array<Space>;

  constructor(private commonService: CommonService,
              private dashboardService: DashboardService,
              private orgService: OrgService,
              private spaceService : SpaceService,
              private log: NGXLogger,
              private uaa: UaaSecurityService,

              router: Router, private http: HttpClient) {
    if (commonService.getToken() == null) {
      router.navigate(['/']);
    }
    this.userid = this.commonService.getUserid();
    this.token = this.commonService.getToken();

    this.orgs = orgService.getOrgList();
    this.spaces =spaceService.getOrgSpaceList();
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

