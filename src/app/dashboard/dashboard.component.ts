import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from '../common/common.service';
import {NGXLogger} from 'ngx-logger';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DashboardService, Service} from './dashboard.service';
import {OrgService} from "../org/common/org.service";
import {Organization} from "../model/organization";
import {SpaceService} from "../space/space.service";
import {Space} from '../model/space';
import {count} from "rxjs/operator/count";
import {AppMainService} from '../dash/app-main/app-main.service';
import {CatalogService, ServicePack, BuildPack, StarterPack} from '../catalog/main/catalog.service';

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

  public token: string;
  public userid: string;
  public userGuid: string;
  public spaceGuid: string;
  public selectedSpaceId: string;

  public current_popmenu_id: string;
  public instanceName: string;

  public appName: string;
  public appNewName: string;
  public appDelName: string;
  public appSummaryGuid: string; // app guid value

  public selectedGuid: string;
  public selectedType: string;
  public selectedName: string;

  public userProvidedServiceName: string;
  public userProvidedCredentials: string;
  public userProvidedSyslogDrainUrl: string;

  private appStatsCpuPer: number;
  private appStatsMemoryPer: number;
  private appStatsDiskPer: number;

  public orgs: Array<Organization>;
  public org: Organization;
  public spaces: Array<Space>;
  public space: Space;
  public service: Observable<Service>;
  public servicepacks: Array<ServicePack>;
  public buildpacks: Array<BuildPack>;
  public starterpacks: Array<StarterPack>;

  public appEntities: Observable<any[]>;
  public appStatsEntities: Observable<any[]>;
  public servicesEntities: Observable<any[]>;
  public appSummaryEntities: Observable<any[]>;
  public ReServicepacksEntities: Observable<any[]>;

  public currentOrg: string;
  public currentSpace: string;

  public servicepackthumbImgPath: string;

  constructor(private commonService: CommonService,
              private dashboardService: DashboardService,
              private orgService: OrgService,
              private spaceService: SpaceService,
              private log: NGXLogger,
              private appMainService: AppMainService,
              private route: ActivatedRoute,
              private catalogService: CatalogService,
              private router: Router, private http: HttpClient) {
    if (commonService.getToken() == null) {
      router.navigate(['/']);
    }


    this.userid = this.commonService.getUserid(); // 생성된 조직명
    this.token = this.commonService.getToken();
    this.userGuid = this.commonService.getUserGuid();

    this.orgs = orgService.getOrgList();
    this.service = new Observable<Service>();

    this.org = null;
    this.space = null;
    this.spaces = [];
    this.servicepacks = [];
    this.buildpacks = [];
    this.starterpacks = [];

    this.isEmpty = true;
    this.isSpace = false;
    this.isMessage = true;

    this.current_popmenu_id = '';
    this.appName = '';
    this.instanceName = '';
    this.appNewName = null;
    this.appDelName = '';
    this.selectedName = '';
    this.selectedGuid = '';
    this.userProvidedServiceName = '';
    this.userProvidedCredentials = '';
    this.userProvidedSyslogDrainUrl = '';

    this.currentSpace = '';
    this.currentOrg = '';
    if (this.commonService.getCurrentOrgName() != null) {
      this.currentOrg = this.commonService.getCurrentOrgName();
      this.currentSpace = this.commonService.getCurrentSpaceGuid();
      //console.log("currentSpace : " + this.commonService.getCurrentSpaceGuid());
      //TODO 수정이 필요함...Space 안불러옴
      // this.commonService.isLoading = true;
      // this.currentSpaceBox();
    }
  }

  currentSpaceBox() {
    this.log.debug("currentSpaceBox");
    if (this.orgs.length > 0) {
      this.getOrg(this.currentOrg);
    } else {
      setTimeout(this.currentSpaceBox(), 3000);
    }
  }

  ngOnInit() {
    $("[id^='apopmenu_']").hide();
    $("[id^='layerpop']").modal("hide");
  }

  getOrg(value: string) {
    this.log.debug("::::1 " + value);
    if (value != '') {

      this.spaces = [];
      this.org = this.orgs.find(org => org.name === value);
      this.isLoadingSpaces = true;
      this.isEmpty = true;
      this.isSpace = false;
      this.appSummaryEntities = null;
      this.log.debug(this.orgs);
      if (this.org != null && this.isLoadingSpaces && this.spaces.length <= 0) {

        this.isLoadingSpaces = false;
        this.spaces = this.spaceService.getOrgSpaceList(this.org.guid);
        // this.log.debug(this.spaces);

        /*
         * 세이브 ORG 정보
         */
        this.commonService.setCurrentOrgGuid(this.org.guid);
        this.commonService.setCurrentOrgName(this.org.name);
        this.commonService.setCurrentLocation(this.space.guid);
      }
    } else {
      //초기화
      this.spaces = [];
      this.isEmpty = true;
      this.isSpace = false;
    }
  }

  getSpaces(value: string) {
    if (value != '') {

      this.isEmpty = false;
      this.isSpace = true;
      this.isMessage = false;
      this.selectedSpaceId = value;
      this.space = this.spaces.find(Space => Space['_metadata']['guid'] === value);

      /*
       * 세이브 ORG 정보
       */
      if (this.space != null) {
        this.commonService.setCurrentSpaceGuid(this.space.name);
        this.commonService.setCurrentSpaceName(this.space.guid);
      }
      this.getAppSummary(value);
    } else {
      //초기화
      // this.spaces = [];
      this.isEmpty = true;
      this.isSpace = false;
    }
  }

  getAppSummary(value: string) {
    this.showLoading();

    this.dashboardService.getAppSummary(value).subscribe(data => {
      this.commonService.isLoading = false;
      this.dashboardService.getServicePacks().subscribe(data2 => {

        this.servicepacks = data2['list'];
        console.log(this.servicepacks);

      });//
      console.log("servicepacks" + this.servicepacks);
      console.log(this.servicepacks);


      $.each(data.apps, function (key, dataobj) {
        $.each(data.appsPer, function (key2, dataobj2) {
          if (dataobj.guid == dataobj2.guid) {
            data.apps[key]["cpuPer"] = dataobj2.cpuPer;
            data.apps[key]["memPer"] = dataobj2.memPer;
            data.apps[key]["diskPer"] = dataobj2.diskPer;
            data.apps[key]["thumbImgPath"] = dataobj2.thumbImgPath;
          }
        });


        $.each(data.services, function (key, obj) {
          $.each(this.servicepacks, function (key, obj2) {

            // if (obj.service_plan.service.label == ) {
            // }
          });
          obj['thumbImgPath'] = "" + key;
        });

      });

      // var ReServicepacks = [];
      // this.log.debug("여기3");
      //   $.each(data.services, function (key, dataobj) {
      //     $.each(this.servicepacks, function (key2, dataobj2) {
      //     if(dataobj.service_plan.service.label == dataobj2.servicePackName) {
      //       var obj = {
      //         SthumbImgPath : dataobj2.thumbImgPath
      //       };
      //       ReServicepacks.push(obj);
      //     }
      //   });
      //     this.ReServicepacksEntities = ReServicepacks;
      //     console.debug("밑에꺼임");
      //     console.debug(ReServicepacks);
      // });

      this.appEntities = data.apps;

      // this.servicesEntities = data.services; sort 재 정렬
      this.servicesEntities = data.services.sort((serA, serB) => {
        const guidA = serA.guid;
        const guidB = serB.guid;
        if (guidA === guidB)
          return 0;
        else if (guidA > guidB)
          return -1;
        else
          return 1;
      });
      return data;
    });

  }

  renameApp() {
    let params = {
      guid: this.selectedGuid,
      newName: this.selectedName,
    };
    this.dashboardService.renameApp(params).subscribe(data => {
      return data;
    });
    return this.getAppSummary(this.selectedSpaceId);
  }

  delApp(guidParam: string) {
    let params = {
      guid: guidParam
    };

    this.dashboardService.delApp(params).subscribe(data => {
      return data;
    });
    return this.getAppSummary(this.selectedSpaceId);
  }

  showPopAppStopClick() {
    $("#layerpop_app_stop").modal("show");
  }

  stopAppClick() {
    $("[id^='layerpop']").modal("hide");
    let params = {
      guid: this.selectedGuid
    };
    this.appMainService.stopApp(params).subscribe(data => {
      this.getAppSummary(this.selectedSpaceId);
      this.ngOnInit();
    });
  }

  showPopAppStartClick() {
    $("#layerpop_app_start").modal("show");
  }

  startAppClick() {
    $("[id^='layerpop']").modal("hide");
    let params = {
      guid: this.selectedGuid,
      orgName: this.org['name'],
      spaceName: this.space['name'],
      name: this.selectedName
    };
    this.appMainService.startApp(params).subscribe(data => {
      this.getAppSummary(this.selectedSpaceId);
      this.ngOnInit();
    });
  }

  // startAppClick() {
  //   return this.appMainService.getAppStats(this.selectedGuid);
  // }

  createUserProvided() {
    let params = {
      orgName: this.org.name,
      spaceGuid: this.selectedSpaceId,
      serviceInstanceName: this.service['serviceInstanceName'],
      credentialsStr: this.service['credentialsStr'],
      syslogDrainUrl: this.service['syslogDrainUrl']
    };
    this.commonService.isLoading = true;
    this.dashboardService.createUserProvided(params).subscribe(data => {
      //console.log(params, data);
      this.getAppSummary(this.selectedSpaceId);
      this.ngOnInit();
      this.commonService.isLoading = false;
      return data;
    }, error => {
      this.commonService.isLoading = false;
      this.getAppSummary(this.selectedSpaceId);
    });
  }

  updateUserProvided() {
    let params = {
      orgName: this.org.name,
      guid: this.selectedGuid,
      serviceInstanceName: this.selectedName,
      credentialsStr: this.service['credentialsStr'],
      syslogDrainUrl: this.service['syslogDrainUrl']
    };
    this.commonService.isLoading = true;
    this.dashboardService.updateUserProvided(params).subscribe(data => {
        //console.log(params, data);
        this.getAppSummary(this.selectedSpaceId);
        this.commonService.isLoading = false;
        return data;
      }
      , error => {
        this.commonService.isLoading = false;
        this.getAppSummary(this.selectedSpaceId);
      });
  }

  renameInstance() {
    let params = {
      guid: this.selectedGuid,
      newName: this.selectedName
    };
    this.dashboardService.renameInstance(params).subscribe(data => {
      return data;
    });
    return this.getAppSummary(this.selectedSpaceId);
  }

  delInstance() {
    let params = {
      guid: this.selectedGuid
    };

    this.dashboardService.delInstance(params).subscribe(data => {
      return data;
    });
    return (this.getAppSummary(this.selectedSpaceId));
  }

  //move catalogDevelopment
  moveDevelopMent() {
    //console.log(this.space);
    this.router.navigate(['catalogdevelopment', this.org.guid, this.org.name, this.space['name']]);
  }

  //move appMain
  moveDashboard(app_name: string, app_guid: string) {
    let org_name = this.org['name'];
    let org_guid = this.org['guid'];
    let space_name = this.space['name'];
    let space_guid = this.space['guid'];

    this.router.navigate(['appMain'], {
      queryParams: {
        org_name: org_name,
        org_guid: org_guid,
        space_name: space_name,
        space_guid: space_guid,
        app_name: app_name,
        app_guid: app_guid,
      }
    });
  }

  //move moveDashboard_SourceController
  moveDashboardS() {
    // this.router.navigate();
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
    this.log.debug('TYPE :: ' + type + ' GUID :: ' + guid) + ' NAME :: ' + name;
  }

}//

