import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from '../common/common.service';
import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
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

  public isEmpty:boolean;
  public isSpace :boolean;
  public isMessage : boolean;
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

  public appSummaryEntities: Observable<any[]>;
  public appStatsEntities: Observable<any[]>;
  public appEventsEntities: Observable<any[]>;
  public appEventsEntitiesRe: any = [];
  public appEnvEntities: Observable<any[]>;
  public appEnvUserEntities: any = [];
  public appEnvSystemEntities: Observable<any[]>;
  public appStatusEntities: any = [];
  public appRoutesEntities: Observable<any[]>;
  public appRoutesEntitiesRe: any = [];
  public appDomainsEntities: Observable<any[]>;
  public appServicesEntities: Observable<any[]>;

  public servicepacksEntities: Observable<any[]>;
  public servicepacksEntitiesRe: any = [];

  private appSummarySpaceGuid: string;
  private appSummaryName: string;
  private appSummaryGuid: string;
  private appSummaryState: string;
  private appSummaryRouteUri: string;
  private appSummaryPackageUpdatedAt: string;
  private appSummaryBuildpack: string;
  private appSummaryInstance: number;
  private appSummaryInstanceMax: number;
  private appSummaryInstancePer: number;
  private appSummaryMemory: number;
  private appSummaryDisk: number;

  private appStatsCpuPer: number;
  private appStatsMemoryPer: number;
  private appStatsDiskPer: number;

  private appSystemProvidedEnv: string;

  private appRecentLogs: string;

  private tabContentEventListLimit: number;
  private tabContentStatsListLimit: number;

  public sltEnvDelName: string;
  public sltEnvAddName: string;
  public sltEnvEditName: string;

  public sltRouteAddName: string;
  public sltRouteDelUri: string;
  public sltRouteDelGuid: string;

  public sltServiceParam: any = [];
  public sltServiceBindName: string;
  public sltServiceUnbindName: string;
  public sltServiceUnbindGuid: string;

  public appSltEnvSystemName: string;
  public appSltEnvSystemLabel: string;
  public appSltEnvSystemCredentialsHostname: string;
  public appSltEnvSystemCredentialsName: string;
  public appSltEnvSystemCredentialsPassword: string;
  public appSltEnvSystemCredentialsPort: string;
  public appSltEnvSystemCredentialsUri: string;
  public appSltEnvSystemCredentialsUsername: string;

  constructor(private commonService: CommonService,
              private dashboardService: DashboardService,
              private orgService: OrgService,
              private spaceService: SpaceService,
              private log: NGXLogger,
              private appMainService: AppMainService,
              private router: Router, private http: HttpClient) {
    if (commonService.getToken() == null) {
      router.navigate(['/']);
    }
    this.userid = this.commonService.getUserid();
    this.token = this.commonService.getToken();

    this.orgs = orgService.getOrgList();

    this.org = null;
    this.spaces = [];

    this.isEmpty = true;
    this.isSpace = false;
    //this.isMessage = false;
  }

  getOrg(value: string, org: Organization) {

    console.log('::::::::::::::::: ' + value + '::::::::::::::::: ');
    this.org = this.orgs.find(org => org.name === value);
    this.isLoadingSpaces = true;

    this.isEmpty = true;
    this.isSpace = false;

    if (this.org != null && this.isLoadingSpaces && this.spaces.length <= 0) {
      this.isLoadingSpaces = false;
      this.spaces = this.spaceService.getOrgSpaceList(this.org.guid);
    }
    console.log('::::::::::::::::: find org is ', org, '::::::::::::::::: ');
  }

  getApps(value:string){
    this.isEmpty = false;
    this.isSpace = true;
   }


  getAppSummary(guid: string) {
    this.commonService.isLoading = true;
    this.appMainService.getAppSummary(guid).subscribe(data => {
      this.appSummaryEntities = data;
      this.appRoutesEntities = data.routes;
      this.appDomainsEntities = data.available_domains;
      this.appServicesEntities = data.services;

      this.appSummarySpaceGuid = data.space_guid;

      this.appSummaryName = data.name;
      this.appSummaryGuid = data.guid;
      this.appSummaryState = data.state;
      this.appSummaryRouteUri = data.routes[0].host + "." + data.routes[0].domain.name;
      this.appSummaryPackageUpdatedAt = data.package_updated_at.replace('T', '  ').replace('Z', ' ');

      if (data.detected_buildpack != null && data.detected_buildpack != "") {
        this.appSummaryBuildpack = data.detected_buildpack.substring(0, 40) + "..";
      } else if (data.buildpack != null) {
        this.appSummaryBuildpack = data.buildpack.substring(0, 40) + "..";
      }

      this.appSummaryInstance = data.instances;
      this.appSummaryInstanceMax = 7;
      this.appSummaryInstancePer = Math.round((this.appSummaryInstance * 100) / this.appSummaryInstanceMax);

      $("#instancePer").val(this.appSummaryInstancePer);

      this.appSummaryMemory = data.memory;

      this.appSummaryDisk = data.disk_quota;

      // this.initRouteTab();
      // this.getSpaceSummary();
      // this.getServicepacks();
      // this.getServicesInstances();
    });
  }


  showLoading() {
    this.commonService.isLoading = true;
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

    // this.router.queryParams.subscribe(params => {
    //   if (params != null) {
    //     setTimeout(() => this.showLoading(), 0);
    //
    //     this.orgGuid = params['orgId'];
    //     this.spaceGuid = params['spaceId'];
    //     this.orgName = params['orgName'];
    //     this.spaceName = params['spaceName'];
    //
    //     this.getAppSummary(params['guid']);
    //   } else {
    //     this.router.navigate(['dashMain']);
    //   }
    // });

  }//

  dashTabClick(id: string) {
    $("[id^='dashTab_']").hide();
    $("#"+id).show();

    if(id == "dashTab_1") {
      $('.monitor_tabs li:nth-child(1)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_on');
      $('.monitor_tabs li:nth-child(2)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
    } else if(id == "dashTab_2") {
      $('.monitor_tabs li:nth-child(1)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
      $('.monitor_tabs li:nth-child(2)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_on');
    }
  }


}

