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
import {isBoolean} from "util";

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
  public isPatten: boolean;
  private isLoadingSpaces = false;
  public isLength: boolean = true;

  public token: string;
  public userid: string;
  public userGuid: string;
  public selectedSpaceId: string;

  public current_popmenu_id: string;
  public instanceName: string;

  public appName: string;
  public appNewName: string;
  public appDelName: string;
  public appSummaryGuid: string; /*app guid value*/

  public selectedGuid: string = '';
  public selectedType: string;
  public selectedName: string;

  public orgs: Array<Organization>;
  public org: Organization;
  public spaces: Array<Space>;
  public space: Space;
  public service: Observable<Service>;
  public servicepacks: Array<ServicePack>;
  public buildpacks: Array<BuildPack>;
  public starterpacks: Array<StarterPack>;

  public appEntities: Observable<any[]>;
  public servicesEntities: Observable<any[]>;
  public userProvidedEntities: Observable<any[]>;
  public appSummaryEntities: Observable<any[]>;

  public currentOrg: string;
  public currentSpace: string;

  public userProvideName : string;
  public userProvideCredentials : string;
  public userProvideSyslogDrainUrl: string;
  public userProvideType : string

  public placeholder="credentialsStr:{'username':'admin','password':'password';}";

  constructor(private commonService: CommonService, private dashboardService: DashboardService, private orgService: OrgService, private spaceService: SpaceService, private log: NGXLogger,
              private appMainService: AppMainService, private catalogService: CatalogService, private route: ActivatedRoute, private router: Router, private http: HttpClient) {
    if (commonService.getToken() == null) {router.navigate(['/']);}

    this.log.debug("Token ::: " + this.commonService.getToken());


    this.service = new Observable<Service>();

    this.org = null;
    this.orgs = [];

    this.space = null;
    this.spaces = [];

    this.servicepacks = [];
    this.buildpacks = [];
    this.starterpacks = [];

    this.isEmpty = true;
    this.isSpace = false;
    this.isMessage = true;
    this.isPatten = false;

    this.current_popmenu_id = '';
    this.appName = '';
    this.instanceName = '';
    this.appNewName = null;
    this.appDelName = '';

    this.selectedName = '';
    this.selectedGuid = '';

    this.currentSpace = '';
    this.currentOrg = '';

    this.userProvideName = '';
    this.userProvideCredentials = '';
    this.userProvideSyslogDrainUrl = '';
    this.userProvideType = '';

    this.userid = this.commonService.getUserid(); // 생성된 조직명
    this.token = this.commonService.getToken();
    this.userGuid = this.commonService.getUserGuid();
    this.orgs = this.getOrgList();

    if (this.commonService.getCurrentOrgName() != null) {
      this.currentOrg = this.commonService.getCurrentOrgName();
      this.currentSpace = this.commonService.getCurrentSpaceName();
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

  getOrgList() {
    this.dashboardService.getOrgList().subscribe(data => {
      (data['resources'] as Array<Object>).forEach(orgData => {
        const index =
          this.orgs.push(new Organization(orgData['metadata'], orgData['entity'])) - 1;
        this.orgs[index].indexOfOrgs = index;
      });
      return data;
    }, error => {
    }, () => {
      if (this.currentOrg != null) {
        this.getOrg(this.currentOrg);
      }
    });
    return this.orgs;
  }

  getOrgSpaceList(orgId:string){
    this.dashboardService.getOrgSpaceList(orgId).subscribe(data => {
      (data['resources'] as Array<Object>).forEach(spaceData => {
          const index =
            this.spaces.push(new Space(spaceData['metadata'], spaceData['entity'], orgId)) - 1;
        });
      return data;
    }, error => {
      }, () => {
        if (this.currentSpace != null) {
          this.getSpaces(this.currentSpace);
        }
      });
    return this.spaces;
  }

  getOrg(value: string) {
    this.log.debug("::::1.getOrg:::: " +"  "+ value);
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
        this.spaces = this.getOrgSpaceList(this.org.guid);

        /* 세이브 ORG 정보*/
        this.commonService.setCurrentOrgGuid(this.org.guid);
        this.commonService.setCurrentOrgName(this.org.name);
      }
    } else {
      /*초기화*/
      this.spaces = [];
      this.isEmpty = true;
      this.isSpace = false;
    }
  }

  getSpaces(value: string) {
    this.log.debug("::::2.getSpaces:::: " +"  "+ value);
    if (value != '') {

      this.isEmpty = false;
      this.isSpace = true;
      this.isMessage = false;
      this.selectedSpaceId = value;
      this.space = this.spaces.find(Space => Space['_metadata']['guid'] === value);

      this.log.debug('getSpaces value');
      this.log.debug(this.spaces);

      /*세이브 ORG 정보*/
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

      $.each(data.apps, function (key, dataobj) {
        $.each(data.appsPer, function (key2, dataobj2) {
          if (dataobj.guid == dataobj2.guid) {
            data.apps[key]["cpuPer"] = dataobj2.cpuPer;
            data.apps[key]["memPer"] = dataobj2.memPer;
            data.apps[key]["diskPer"] = dataobj2.diskPer;
            data.apps[key]["thumbImgPath"] = dataobj2.thumbImgPath;
          }
        });
      });

      this.appEntities = data.apps;
      this.thumnailApp();

      this.servicesEntities = data.services;
      this.thumnail();

    });
  }

  thumnail(): void {
    this.dashboardService.getServicePacks().subscribe(data => {
      $.each(this.servicesEntities, function (skey, servicesEntitie) {
        let cnt = 0;
        $.each(data['list'], function (dkey, servicepack) {
          if (servicesEntitie['service_plan'] != null) {

            if (servicesEntitie['service_plan']['service']['label'] === servicepack['servicePackName']) {
              servicesEntitie['thumbImgPath'] = servicepack['thumbImgPath'];
              cnt++
            }
          }
        })
        if (cnt == 0) {
          servicesEntitie['thumbImgPath'] = 'DEFALUT';
        }
      });
      return data;
    }, error => {
    }, () => {
    });
  }

  thumnailApp(): void {
    // this.log.debug("Start");
    // this.log.debug(this.appEntities);
    this.dashboardService.getBuildPacks().subscribe(data => {
      $.each(this.appEntities, function (skey, appEntitie) {
        let cnt = 0;
        $.each(data['list'], function (dkey, buildpack) {
          if (appEntitie['buildpack'] != null) {
            // console.log(appEntitie['buildpack'] + ' == ' + buildpack['buildPackName'] + ' = ' + (appEntitie['buildpack'] === buildpack['buildPackName']));

            if (appEntitie['buildpack'] === buildpack['buildPackName']) {
              appEntitie['thumbImgPath'] = buildpack['thumbImgPath'];
              cnt++
            }
          }
        })
        if (cnt == 0) {
          appEntitie['thumbImgPath'] = 'DEFALUT';
        }
      });
      return data;
    }, error => {
    }, () => {
      // this.log.debug('END');
      // this.log.debug(this.appEntities);
    });
  }

  renameApp() {
    let params = {
      guid: this.selectedGuid,
      newName: this.selectedName,
    };
    this.commonService.isLoading = true;
    this.dashboardService.renameApp(params).subscribe(data => {
      if (data && this.isPatten) {
        this.commonService.isLoading = false;
        console.log("성공");
      } else {
        this.commonService.isLoading = false;
        console.log("실패");
      }
      return data['result'];
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

  userProvidedInfo(){
    console.log(this.selectedGuid);
    this.dashboardService.userProvidedInfo(this.selectedGuid).subscribe(data => {

      this.userProvideName = data.entity["name"];
      this.userProvideCredentials = JSON.stringify(data.entity["credentials"]);
      this.userProvideSyslogDrainUrl = data.entity["syslog_drain_url"];
      this.userProvideType = data.entity["type"];
      return data;
    });
  }

  createUserProvided() {

    var str = JSON.stringify(this.service['credentialsStr']);
    console.log(str);

    let params = {
      orgName: this.org.name,
      spaceGuid: this.selectedSpaceId,
      serviceInstanceName: this.userProvideName,
      credentials: this.userProvideCredentials,
      syslogDrainUrl: this.userProvideSyslogDrainUrl
    };

    this.commonService.isLoading = true;
    this.dashboardService.createUserProvided(params).subscribe(data => {
      console.log(params, data);
      this.getAppSummary(this.selectedSpaceId);
      this.ngOnInit();
      this.commonService.isLoading = false;
      this.commonService.alertMessage('UserProvided 생성 완료되었습니다.' , true);
      return data;
    }, error => {
      this.commonService.isLoading = false;
      this.getAppSummary(this.selectedSpaceId);
      this.commonService.alertMessage('UserProvided 생성 실패하였습니다..' , false);
    });
    this.userProvideName = '';
    this.userProvideCredentials = '';
    this.userProvideSyslogDrainUrl = '';
  }

  checkLength() {
    if (this.isUserProvideValidation()){
      this.isLength == true;
      /*createUserProvided*/
      this.createUserProvided();
    }else{
      this.isLength == false;
      return false;
    }
  }

  isUserProvideValidation() {
    if (this.userProvideName.length &&  this.userProvideCredentials.length && this.userProvideSyslogDrainUrl.length > 0) {
      this.isLength = true;
      return true;
    } else {
      this.isLength = false;
      return false;
    }
  }

  updateUserProvided() {
    //username':'admin','password':'password';
    var str = JSON.stringify(this.userProvideCredentials);
    console.log(str);

    let params = {
      orgName: this.org.name,
      guid: this.selectedGuid,
      serviceInstanceName: this.userProvideName,
      credentials: this.userProvideCredentials,
      syslogDrainUrl: this.userProvideSyslogDrainUrl
    };

    this.commonService.isLoading = true;
    this.dashboardService.updateUserProvided(params).subscribe(data => {
        console.log(params, data);
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

  cancelButton(){
    $('#userProvideName').val('');
    $('#userProvideCredentials').val('');
    $('#userProvideSyslogDrainUrl').val('');
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

    if(type == "provided"){
      this.userProvidedInfo();
    }
    this.log.debug('TYPE :: ' + type + ' GUID :: ' + guid + ' NAME :: ' + name);
  }


}//

