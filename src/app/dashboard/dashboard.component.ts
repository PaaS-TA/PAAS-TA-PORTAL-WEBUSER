import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from '../common/common.service';
import {NGXLogger} from 'ngx-logger';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DashboardService} from './dashboard.service';
import {OrgService} from "../org/common/org.service";
import {Organization} from "../model/organization";
import {SpaceService} from "../space/space.service";
import {Space} from '../model/space';
import {count} from "rxjs/operator/count";
import {AppMainService} from '../dash/app-main/app-main.service';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  public isEmpty: boolean;
  public isSpace: boolean;
  public isMessage: boolean;
  private isLoadingSpaces = false;

  orgs: Array<Organization>;
  org: Organization;
  spaces: Array<Space>;


  public token: string;
  public userid: string;
  public orgGuid: string;
  public spaceGuid: string;
  public orgName: string;
  public spaceName: string;
  private service: string;
  public current_popmenu_id: string;
  public appName: string;
  public appNewName: string;
  public appDelName: string;
  public appSummaryGuid: string; // app guid value

  public appSummaryEntities: Observable<any[]>;
  public appEntities: Observable<any[]>;
  public servicesEntities: Observable<any[]>;


  constructor(private commonService: CommonService,
              private dashboardService: DashboardService,
              private orgService: OrgService,
              private spaceService: SpaceService,
              private log: NGXLogger,
              private appMainService: AppMainService,
              private route: ActivatedRoute,
              private router: Router, private http: HttpClient) {
    if (commonService.getToken() == null) {
      router.navigate(['/']);
    }
    this.userid = this.commonService.getUserid();
    this.token = this.commonService.getToken();
    this.spaceGuid = this.commonService.getUserGuid();

    this.orgs = orgService.getOrgList();

    this.org = null;
    this.spaces = [];

    this.isEmpty = true;
    this.isSpace = false;
    this.isMessage = true;

    this.current_popmenu_id = '';
    this.appName = '';
    this.appNewName = null;
    this.appDelName = '';
  }

  getOrg(value: string, org: Organization) {

    console.log('::::::::::::::::: ' + value + '::::::::::::::::: ');
    this.org = this.orgs.find(org => org.name === value);
    this.isLoadingSpaces = true;

    this.isEmpty = true;
    this.isSpace = false;

    this.appSummaryEntities = null;

    if (this.org != null && this.isLoadingSpaces && this.spaces.length <= 0) {
      this.isLoadingSpaces = false;
      this.spaces = this.spaceService.getOrgSpaceList(this.org.guid);
    }
    console.log('::::::::::::::::: find org is ', org, '::::::::::::::::: ');
  }

  //애플리케이션 및 서비스 목록 확인
  getAppSummary(value: string) {
    this.dashboardService.getAppSummary(value).subscribe(data => {
      console.log(data);
      this.appEntities = data.apps;
      this.servicesEntities = data.services;
          return data;
    });
  }

  getApps(value: string) {
    this.log.debug(value);
    this.isEmpty = false;
    this.isSpace = true;
    this.isMessage = false;

    this.getAppSummary(value);
  }

  //앱 이름변경
  renameApp() {
    console.log(this.appName);
    let params = {
      guid: this.org.guid,
      name: this.appName,
      newName: this.appName,
    };
    this.dashboardService.renameApp(params).subscribe(data => {
      if (data == 1) {
        console.log('success');
      } else {
        console.log('Name modification failed.');
      }
      console.log(data);
      return data;
    });
  }

  delApp(guidParam: string) {

    let params = {
      guid : guidParam
    };

    this.dashboardService.delApp(params).subscribe(data => {
      if (data == 1) {
        console.log('success');
      } else {
        console.log('failed.');
      }
      console.log(data);
      return data;
    });

  }

  startApp() {
    console.log(this.appSummaryGuid);
    let params = {
      guid: this.appSummaryGuid
    };
    this.dashboardService.startApp(params).subscribe(data => {
      return data;
    });
  }


  ngOnInit() {
    console.log('ngOnInit fired');
    $(document).ready(() => {
      //TODO 임시로...
      $.getScript("../../assets/resources/js/common2.js")
        .done(function (script, textStatus) {
          //console.log( textStatus );
        })
        .fail(function (jqxhr, settings, exception) {
          console.log(exception);
        });
    });

    // this.route.queryParams.subscribe(params => {
    //   if (params != null) {
    //     setTimeout(() => this.showLoading(), 0);
    //
    //     this.getAppSummary(params['guid']);
    //
    //     // this.getAppEvents(params['guid']);
    //     // this.getAppEnv(params['guid']);
    //     // this.getAppRecentLogs(params['guid']);
    //   } else {
    //     this.router.navigate(['dashMain']);
    //   }
    // });
  }

  showPopEnvDelClick(eventID: string) {
    this.appDelName = eventID;
    $("#layerpop_env_del").modal("show");
  }

  showLoading() {
    this.commonService.isLoading = true;
  }

  dashTabClick(id: string) {
    $("[id^='dashTab_']").hide();
    $("#" + id).show();

    if (id == "dashTab_1") {
      $('.monitor_tabs li:nth-child(1)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_on');
      $('.monitor_tabs li:nth-child(2)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
    } else if (id == "dashTab_2") {
      $('.monitor_tabs li:nth-child(1)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
      $('.monitor_tabs li:nth-child(2)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_on');
      $("[id^='popclick_01']").hide();
    }
  }

  popclick(id: string) {
    $('.space_pop_submenu').hide();
    if (this.current_popmenu_id != id) {
      $("#" + id).show();
      this.current_popmenu_id = id;
    } else {
      this.current_popmenu_id = '';
    }
  }

}//

