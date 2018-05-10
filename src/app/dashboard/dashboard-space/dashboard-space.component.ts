import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from '../../common/common.service';
import {NGXLogger} from 'ngx-logger';
// import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DashboardService} from '../dashboard.service';
import {OrgService} from "../../org/common/org.service";
import {Organization} from "../../model/organization";
import {SpaceService} from "../../space/space.service";
import {Space} from '../../model/space';
import {DashboardSapaceService} from '../dashboard-space/dashboard-sapace.service';
import {AppMainService} from '../../dash/app-main/app-main.service';


declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-dashboard-space',
  templateUrl: './dashboard-space.component.html',
  styleUrls: ['./dashboard-space.component.css']
})
export class DashboardSpaceComponent implements OnInit {
  @Input('org') org: Organization;

  public token: string;
  public orgs: Array<Organization>;
  public spaces: Array<Space>;

  public orgGuid : string;
  public spaceGuid : string;
  public orgName : string;
  public spaceName : string;

  public appSummaryEntities: Observable<any[]>;
  public appRoutesEntities: Observable<any[]>;
  public appDomainsEntities: Observable<any[]>;
  public appServicesEntities: Observable<any[]>;
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

  constructor(private commonService: CommonService, private dashboardService: DashboardService,
              private dashboardSapaceService : DashboardSapaceService,
              private orgService: OrgService, private spaceService : SpaceService,
              private appMainService: AppMainService,
              private log: NGXLogger, router: Router, private http: HttpClient) {

    this.orgs = orgService.getOrgList();
    this.org = null;
    this.spaces = [];

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
      // TODO 임시로...
      $.getScript('../../assets/resources/js/common.js')
        .done(function(script, textStatus) {
          // console.log( textStatus );
        })
        .fail(function(jqxhr, settings, exception) {
          console.log(exception);
        });
    });

    // this.router.queryParams.subscribe(params => {
    //   if (params != null) {
    //     setTimeout(() => this.showLoading(), 0);

        // this.orgGuid = params['orgId'];
        // this.spaceGuid = params['spaceId'];
        // this.orgName = params['orgName'];
        // this.spaceName = params['spaceName'];

        // this.getAppSummary(params['guid']);
    //   } else {
    //     this.router.navigate(['dashMain']);
    //   }
    // });



  } //ngOnInit






}
