import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from '../common/common.service';
import {NGXLogger} from 'ngx-logger';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DashboardService} from './dashboard.service';
// import {User, UsermgmtService } from '../usermgmt/usermgmt.service';
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
  public isSpace: boolean = false;
  public isMessage: boolean;
  private isLoadingSpaces = false;

  orgs: Array<Organization>;
  org: Organization;
  spaces: Array<Space>;
  space: Space;

  public token: string;
  public userid: string;
  public orgGuid: string;
  public spaceGuid: string;
  public selectedSpaceId: string;
  public appStateParam: string;

  public current_popmenu_id: string;
  public appName: string;
  public instanceName: string;
  public appNewName: string;
  public appDelName: string;
  public appSummaryGuid: string; // app guid value
  public selectedGuid: string;
  public selectedType: string;
  public selectedName: string;

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

    this.log.debug(this.commonService.getToken());
    this.userid = this.commonService.getUserid();
    this.token = this.commonService.getToken();
    this.spaceGuid = this.commonService.getUserGuid();

    this.orgs = orgService.getOrgList();

    this.org = null;
    this.space = null;
    this.spaces = [];

    this.isEmpty = true;
    this.isSpace = false;
    this.isMessage = true;

    this.current_popmenu_id = '';
    this.appName = '';
    this.instanceName = '';
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
    console.log('::::::::::::::::: find org is ', this.org.guid, '::::::::::::::::: ');
  }

  //애플리케이션 및 서비스 목록 확인
  getAppSummary(value: string) {
    console.log("::::::::::::::::: getAppSummary:::::::::::::::::");
    this.showLoading();
    this.dashboardService.getAppSummary(value).subscribe(data => {
      this.commonService.isLoading = false;

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
    this.selectedSpaceId = value;


    // this.log.debug(space);
    this.getAppSummary(value);

  }

  renameApp(appName: string) {
    console.log(this.appName);
    let params = {
      guid: this.selectedGuid,
      newName: appName,
    };
    this.dashboardService.renameApp(params).subscribe(data => {
      if (data == 1) {
        console.log('success');
      } else {
        console.log('failed.');
      }
      console.log(data);
      return data;
    });
    //.then(this.getAppSummary(this.selectedSpaceId))
    return this.getAppSummary(this.selectedSpaceId);
  }

  delApp(guidParam: string) {
    let params = {
      guid: guidParam
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
    //.then(this.getAppSummary(this.selectedSpaceId))
    return this.getAppSummary(this.selectedSpaceId);
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

  renameInstance(instanceName: string) {
    console.log(this.instanceName);
    let params = {
      guid: this.selectedGuid,
      newName: instanceName,
    };
    this.dashboardService.renameInstance(params).subscribe(data => {
      if (data == 1) {
        console.log('success');
      } else {
        console.log('failed.');
      }
      console.log(data);
      return data;
    });
    //.then(this.getAppSummary(this.selectedSpaceId))
    return this.getAppSummary(this.selectedSpaceId);
  }

  delInstance(guidParam: string) {
    let params = {
      guid: guidParam
    };

    this.dashboardService.delInstance(params).subscribe(data => {
      if (data == 1) {
        console.log('success');
      } else {
        console.log('failed.');
      }
      console.log(data);
      return data;
    });
    //.then(this.getAppSummary(this.selectedSpaceId))
    return (this.getAppSummary(this.selectedSpaceId));
  }

  goDevelopMent() {
    console.log(this.space);
    this.router.navigate(['catalogdevelopment',this.org.guid, this.org.name, this.space['name']]);
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

  popclick(id: string, type: string, guid: string, name: string) {
    $('.space_pop_submenu').hide();
    if (this.current_popmenu_id != id) {
      $("#" + id).show();
      this.current_popmenu_id = id;
      this.selectedType = type;
      this.selectedGuid = guid;
      this.selectedName = name;
    } else {
      this.current_popmenu_id = '';
      this.selectedType = '';
      this.selectedGuid = '';
      this.selectedName = '';
    }
    this.log.debug('TYPE :: ' + type + ' GUID :: ' + guid);
  }


}//

