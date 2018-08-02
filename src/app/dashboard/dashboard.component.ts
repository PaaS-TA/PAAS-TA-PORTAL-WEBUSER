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
import {CatalogService} from '../catalog/main/catalog.service';
import {isBoolean, isNullOrUndefined} from "util";
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {containerStart} from "@angular/core/src/render3/instructions";
import {CATALOGURLConstant} from "../catalog/common/catalog.constant";

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
  public dashboardUseYn : string;
  public appSummaryGuid: string;
  /*app guid value*/

  public orgName: string = '';
  public orgGuid: string = '';
  public spaceName: string = '';
  public spaceGuid: string = '';
  public appGuid: string = '';

  public selectedGuid: string = '';
  public selectedType: string;
  public selectedName: string;

  public orgs: Array<Organization>;
  public org: Organization;
  public spaces: Array<Space>;
  public space: Space;
  public service: Observable<any>;
  public servicepacks: Array<any>;
  public buildpacks: Array<any>;
  public starterpacks: Array<any>;

  public appEntities: Observable<any[]>;
  public servicesEntities: Observable<any[]>;
  public appSummaryEntities: Observable<any[]>;
  public translateEntities: any = [];

  public currentOrg: string;
  public currentSpace: string;

  public userProvideName: string;
  public userProvideName_update: string;
  public userProvideCredentials: string;
  public userProvideSyslogDrainUrl: string;
  public userProvideType: string;

  public orgMemoryDevelopmentTotal: string;
  public orgMemoryProductionTotal: string;
  public orgServiceTotal: string;
  public orgQuotaMemoryLimit: string;
  public orgTotalRoutes: string;
  public orgTotalServiceKeys: string;
  public orgTotalServices: string;
  public selectedBinding : boolean;

  public placeholder = "credentialsStr:{'username':'admin','password':'password';}";

  constructor(private translate: TranslateService, private commonService: CommonService, private dashboardService: DashboardService, private orgService: OrgService, private spaceService: SpaceService, private log: NGXLogger,
              private appMainService: AppMainService, private catalogService: CatalogService, private route: ActivatedRoute, private router: Router, private http: HttpClient) {
    if (commonService.getToken() == null) {
      router.navigate(['/']);
    }

    // this.log.debug("Token ::: " + this.commonService.getToken());

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
    this.userProvideName_update = '';
    this.userProvideCredentials = '';
    this.userProvideSyslogDrainUrl = '';
    this.userProvideType = '';

    this.orgMemoryDevelopmentTotal = '';
    this.orgMemoryProductionTotal = '';
    this.orgServiceTotal = '';
    this.orgQuotaMemoryLimit = '';
    this.orgTotalRoutes = '';
    this.orgTotalServiceKeys = '';
    this.orgTotalServices = '';

    this.userid = this.commonService.getUserid(); // 생성된 조직명
    this.token = this.commonService.getToken();
    this.userGuid = this.commonService.getUserGuid();

    this.orgs = this.getOrgList();


    this.translate.get('dashboard').subscribe((res: string) => {
      this.translateEntities = res;
    });

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateEntities = event.translations.dashboard;
    });

    if (!isNullOrUndefined(this.commonService.getCurrentOrgName())) {
      this.currentOrg = this.commonService.getCurrentOrgName();
      this.currentSpace = this.commonService.getCurrentSpaceGuid();
    }
  }

  currentSpaceBox() {
    if (this.orgs.length > 0) {
      this.getOrg(this.currentOrg,'defalut');
    } else {
      setTimeout(this.currentSpaceBox(), 3000);
    }
  }

  ngOnInit() {
    $("[id^='apopmenu_']").hide();
    $("[id^='layerpop']").modal("hide");

  }

  getOrgList() {
    this.commonService.isLoading = true;
    this.dashboardService.getOrgList().subscribe(data => {
      (data['resources'] as Array<Object>).forEach(orgData => {
        const index =
          this.orgs.push(new Organization(orgData['metadata'], orgData['entity'])) - 1;
        this.orgs[index].indexOfOrgs = index;
      });
    }, error => {
      this.commonService.isLoading = false;
    }, () => {
      if (this.currentOrg != '') {
        this.commonService.isLoading = false;
        this.getOrg(this.currentOrg,'defalut');
      } else {
        this.getOrg("",'first');
      }
    });
    return this.orgs;
  }

  getOrgSpaceList(orgId: string, spacedefault : boolean) {
    this.commonService.isLoading = true;
    this.dashboardService.getOrgSpaceList(orgId).subscribe(data => {
      (data['resources'] as Array<Object>).forEach(spaceData => {
          this.spaces.push(new Space(spaceData['metadata'], spaceData['entity'], orgId));
      });
      console.log(this.spaces);
      console.log(this.commonService.getCurrentSpaceGuid());
      console.log(this.spaces.find(space => space.guid === this.commonService.getCurrentSpaceGuid()));
      if(isNullOrUndefined(this.spaces.find(space => space.guid === this.commonService.getCurrentSpaceGuid()))){
        if(this.spaces.length > 0){
          this.currentSpace = this.spaces[0].guid;
        } else {
          this.currentSpace = '';
        }
      }else if (data['resources'].length > 0){
        this.space = this.spaces[0];
        this.currentSpace = this.space.guid;
        this.commonService.setCurrentSpaceGuid(this.space.guid);
        this.commonService.setCurrentSpaceName(this.space.name);
      }else {
        this.currentSpace = '';
      }
      this.commonService.isLoading = false;
      return data;
    }, error => {
    }, () => {
      if (this.currentSpace != null) {
        this.commonService.isLoading = false;
        this.getSpaces(this.currentSpace);
      }
    });
    return this.spaces;
  }

  getOrg(value: string, type: string) {
    if (type == 'select') {
      this.appEntities = null;
      this.servicesEntities = null;
      this.spaces = [];
      this.currentSpace = null;
    } else if(type === 'first'){
      console.log("펄스트");
      if(this.orgs.length > 0) {
        this.org = this.orgs[0];
        this.commonService.setCurrentOrgGuid(this.org.guid);
        this.commonService.setCurrentOrgName(this.org.name);
        this.currentOrg = this.org.OrgName();
        this.getOrgSpaceList(this.org.guid, true);
      }else{
        this.commonService.isLoading =false;
      }
      return;
    }
    if (value != '') {
      this.commonService.isLoading = true;
      this.spaces = [];
      this.org = this.orgs.find(org => org.name === value);
      this.isLoadingSpaces = true;
      this.isEmpty = true;
      this.isSpace = false;
      this.appSummaryEntities = null;
      if (!isNullOrUndefined(this.org) && this.isLoadingSpaces) {
        this.isLoadingSpaces = false;
        this.spaces = this.getOrgSpaceList(this.org.guid, false);
        /* 세이브 ORG 정보*/
        this.commonService.setCurrentOrgGuid(this.org.guid);
        this.commonService.setCurrentOrgName(this.org.name);
      }else{
        if(this.orgs.length > 0){
        this.org = this.orgs[0];
        this.commonService.setCurrentOrgGuid(this.org.guid);
        this.commonService.setCurrentOrgName(this.org.name);

        this.currentOrg = this.org.OrgName();
        this.getOrgSpaceList(this.org.guid, true);
        } else {
          this.currentOrg = '';
          this.currentSpace = '';
          this.commonService.isLoading = false;
        }
      }
    } else {
      /*초기화*/
      this.currentSpace = '';
      this.isEmpty = true;
      this.isSpace = false;
      this.appSummaryEntities = null;
      this.commonService.isLoading = false;
    }
  }

  getSpaces(value: string) {
    this.showLoading();
    this.log.debug("::::2.getSpaces:::: " + "  " + value);
    if (value != '') {
      this.isEmpty = false;
      this.isSpace = true;
      this.isMessage = false;
      this.selectedSpaceId = value;
      this.space = this.spaces.find(Space => Space['_metadata']['guid'] === value);

      /*세이브 ORG 정보*/
      if (this.space != null) {
        this.commonService.setCurrentSpaceGuid(this.space.guid);
        this.commonService.setCurrentSpaceName(this.space.name);
      }
      this.getAppSummary(value);
      this.getOrgSummary();

    } else {
      /*초기화*/
      this.isEmpty = true;
      this.isSpace = false;
      this.commonService.isLoading = false;
    }
  }

  getOrgSummary() {
    this.dashboardService.getOrgSummary(this.org.guid).subscribe(data => {

      this.orgMemoryDevelopmentTotal = data["all_memoryDevelopmentTotal"];
      this.orgMemoryProductionTotal = data["all_memoryProductionTotal"];
      this.orgServiceTotal = data["all_serviceTotal"];
      this.orgQuotaMemoryLimit = data.quota["memoryLimit"];
      this.orgTotalRoutes = data.quota['totalRoutes'];
      this.orgTotalServiceKeys = data.quota['totalServiceKeys'];
      this.orgTotalServices = data.quota['totalServices'];

      return data;
    }, error => {
    }, () => {
    });
  }

  getAppSummary(value: string) {

    this.dashboardService.getAppSummary(value).subscribe(data => {
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
      this.servicesEntities.forEach(service => {
        service['binding'] = false;
      })
      this.thumnail();
    }, () => {
      this.commonService.isLoading = false;
    });
  }

  thumnail(): void {
    let catalog = this.catalogService;

    this.dashboardService.getServicePacks().subscribe(data => {
      // console.log(data['list']);
      $.each(this.servicesEntities, function (skey, servicesEntitie) {
        let cnt = 0;
        $.each(data['list'], function (dkey, servicepack) {
          if (servicesEntitie['service_plan'] != null && servicepack['thumbImgName'] != null) {
            if (servicesEntitie['service_plan']['service']['label'] === servicepack['servicePackName']) {
              servicesEntitie['dashboardUseYn'] = servicepack['dashboardUseYn'];
              try{
              var pathHeader = servicepack['thumbImgPath'].lastIndexOf("/");
              var pathEnd = servicepack['thumbImgPath'].length;
              var fileName = servicepack['thumbImgPath'].substring(pathHeader + 1, pathEnd);
              catalog.getImg('/storageapi/v2/swift/' + fileName).subscribe(data => {
                let reader = new FileReader();
                reader.addEventListener("load", () => {
                  servicesEntitie['thumbImgPath'] = reader.result;
                }, false);
                if (data) {
                  reader.readAsDataURL(data);
                }
              });
              cnt++
            }catch (e) {
                servicesEntitie['thumbImgPath'] = '../../assets/resources/images/catalog/catalog_3.png';
              }
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
      this.commonService.isLoading = false;
    });
  }


  thumnailApp(): void {
    let catalog = this.catalogService;
    this.dashboardService.getBuildPacks().subscribe(data => {
      $.each(this.appEntities, function (skey, appEntitie) {
        let cnt = 0;
        $.each(data['list'], function (dkey, buildpack) {
          if (appEntitie['buildpack'] != null) {
            // console.log(appEntitie['buildpack'] + ' == ' + buildpack['buildPackName'] + ' = ' + (appEntitie['buildpack'] === buildpack['buildPackName']));
            if (appEntitie['buildpack'] === buildpack['buildPackName']) {
              try{
              var pathHeader = buildpack['thumbImgPath'].lastIndexOf("/");
              var pathEnd = buildpack['thumbImgPath'].length;
              var fileName = buildpack['thumbImgPath'].substring(pathHeader + 1, pathEnd);
              catalog.getImg('/storageapi/v2/swift/' + fileName).subscribe(data => {
                let reader = new FileReader();
                reader.addEventListener("load", () => {
                  appEntitie['thumbImgPath'] = reader.result;
                }, false);
                if (data) {
                  reader.readAsDataURL(data);
                }});}
              catch (e) {
                appEntitie['thumbImgPath'] = '../../assets/resources/images/catalog/catalog_3.png';
              }
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

  pattenTest(value: string) {
    const regExpPattern = /[\{\}\[\]\/?,;:|\)*~`!^+<>\#$%&\\\=\(\'\"]/gi;
    const regExpBlankPattern = /[\s]/g;
    const regKoreanPatten = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;
    $('#' + value).val($('#' + value).val().replace(regExpPattern, '')
      .replace(regExpBlankPattern, '')
      .replace(regKoreanPatten, '').substring(0, 64));
    this.selectedName = $('#' + value).val();
  }


  renameApp() {
    let params = {
      guid: this.selectedGuid,
      newName: this.selectedName,
    };
    this.commonService.isLoading = true;
    this.dashboardService.renameApp(params).subscribe(data => {
      this.commonService.alertMessage(this.translateEntities.alertLayer.changeSuccess, true);
      return data['result'];
    }, error => {
      this.commonService.alertMessage(this.translateEntities.alertLayer.changeFail, false);
      this.commonService.isLoading = false;
    });
    return this.getAppSummary(this.selectedSpaceId);
  }

  delApp(guidParam: string) {
    let params = {
      guid: guidParam
    };
    this.commonService.isLoading = true;
    this.dashboardService.delApp(params).subscribe(data => {
      if(data.result){
        this.commonService.alertMessage(this.translateEntities.alertLayer.deleteSuccess, true);
      }else{
        this.commonService.alertMessage(data.msg, false);
      }
    }, error => {
      this.commonService.alertMessage(this.translateEntities.alertLayer.deleteFail, false);
      this.commonService.isLoading = false;
    });
    setTimeout(() => this.getOrgSummary(), 3000);
    setTimeout(() => this.getAppSummary(this.selectedSpaceId), 3000);
  }

  showPopAppStopClick() {
    $("#layerpop_app_stop").modal("show");
  }

  stopAppClick() {
    $("[id^='layerpop']").modal("hide");
    this.commonService.isLoading = true;

    let params = {
      guid: this.selectedGuid
    };

    this.appMainService.stopApp(params).subscribe(data => {
      if(data.result){
        this.commonService.isLoading = false;
        this.commonService.alertMessage(this.translateEntities.alertLayer.appstopSuccess, true);
        this.getAppSummary(this.selectedSpaceId);

        this.ngOnInit();
      }else{
        this.commonService.isLoading = false;
        this.commonService.alertMessage(this.translateEntities.alertLayer.appstopFail + "<br><br>" + data.msg.description, false);
      }
    });
  }

  showPopAppStartClick() {
    $("#layerpop_app_start").modal("show");
  }

  startAppClick() {
    $("[id^='layerpop']").modal("hide");
    this.commonService.isLoading = true;

    let params = {
      guid: this.selectedGuid,
      orgName: this.org['name'],
      spaceName: this.space['name'],
      name: this.selectedName
    };

    this.appMainService.startApp(params).subscribe(data => {
      if(data.result){
        this.commonService.isLoading = false;
        this.getAppSummary(this.selectedSpaceId);
        this.commonService.alertMessage(this.translateEntities.alertLayer.appstartSuccess, true);

        this.ngOnInit();
      }else{
        this.commonService.isLoading = false;
        this.commonService.alertMessage(this.translateEntities.alertLayer.appstartFail + "<br><br>" + data.msg, false);
      }
    });
  }


  userProvidedInfo() {
    //console.log(this.selectedGuid);
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
    // console.log(str);

    let params = {
      orgName: this.org.name,
      spaceGuid: this.selectedSpaceId,
      serviceInstanceName: this.userProvideName,
      credentials: this.userProvideCredentials,
      syslogDrainUrl: this.userProvideSyslogDrainUrl
    };

    this.commonService.isLoading = true;
    this.dashboardService.createUserProvided(params).subscribe(data => {
      // console.log(params, data);
      this.getAppSummary(this.selectedSpaceId);
      this.ngOnInit();
      this.commonService.alertMessage(this.translateEntities.alertLayer.createSuccess, true);
      return data;
    }, error => {
      this.commonService.alertMessage(this.translateEntities.alertLayer.createFail, false);
      this.commonService.isLoading = false;
      this.getAppSummary(this.selectedSpaceId);
    });
    this.userProvideName = '';
    this.userProvideCredentials = '';
    this.userProvideSyslogDrainUrl = '';
  }

  checkLength() {
    if (this.isUserProvideValidation()) {
      this.isLength == true;
      /*createUserProvided*/
      this.createUserProvided();
    } else {
      this.commonService.alertMessage(this.translateEntities.alertLayer.createFail, false);
      return false;
    }
  }

  isUserProvideValidation() {
    if (this.userProvideName.length && this.userProvideCredentials.length && this.userProvideSyslogDrainUrl.length > 0) {
      this.isLength = true;
      try {
        JSON.parse(this.userProvideCredentials);
        return true;
      } catch (e) {
        return false;
      }
    } else {
      this.isLength = false;

      return false;
    }
  }

  updateUserProvided() {
    //username':'admin','password':'password';
    var str = JSON.stringify(this.userProvideCredentials);
    // console.log(str);

    let params = {
      orgName: this.org.name,
      guid: this.selectedGuid,
      serviceInstanceName: this.userProvideName,
      credentials: this.userProvideCredentials,
      syslogDrainUrl: this.userProvideSyslogDrainUrl
    };

    this.commonService.isLoading = true;
    this.dashboardService.updateUserProvided(params).subscribe(data => {
        // console.log(params, data);
        this.getAppSummary(this.selectedSpaceId);
        this.commonService.alertMessage(this.translateEntities.alertLayer.updateSuccess, true);
        return data;
      }
      , error => {
        this.commonService.alertMessage(this.translateEntities.alertLayer.updateFail, false);
        this.commonService.isLoading = false;
        this.getAppSummary(this.selectedSpaceId);
      });
  }

  renameInstance() {
    let params = {
      guid: this.selectedGuid,
      newName: this.selectedName
    };
    this.commonService.isLoading = true;
    this.dashboardService.renameInstance(params).subscribe(data => {
      this.commonService.alertMessage(this.translateEntities.alertLayer.updateSuccess, true);
      return data;
    }, error => {
      this.commonService.alertMessage(this.translateEntities.alertLayer.updateFail, false);
      this.commonService.isLoading = false;
    });
    setTimeout(() => this.getAppSummary(this.selectedSpaceId), 3000);
  }

  /*UserProvide Delete*/
  delInstance() {
    if(this.selectedBinding){
      this.commonService.alertMessage(this.translateEntities.alertLayer.bindingService, false);
      return;
    }
    let params = {
      guid: this.selectedGuid
    };
    this.commonService.isLoading = true;
    this.dashboardService.delInstance(params).subscribe(data => {
      if(data.result){
        this.commonService.alertMessage(this.translateEntities.alertLayer.deleteSuccess, true);
      }else{
        this.commonService.alertMessage(data.msg, false);
      }
    }, error => {
      this.commonService.isLoading = false;
      this.commonService.alertMessage(this.translateEntities.alertLayer.deleteFail, false);
    });
    setTimeout(() => this.getAppSummary(this.selectedSpaceId), 3000);
  }


  //move catalogDevelopment
  moveDevelopMent() {
    //console.log(this.space);
    this.router.navigate(['catalogdevelopment', this.org.guid, this.org.name, this.space['name']]);
  }

  //move appMain
  moveDashboard(app_name: string, app_guid: string) {
    // console.log(app_name + " ::: " + app_guid);
    this.commonService.setCurrentAppGuid(app_guid);
    this.commonService.setCurrentAppName(app_name);
    this.router.navigate(['appMain']);
  }

  cancelButton() {
    $('#userProvideName').val('');
    $('#userProvideCredentials').val('');
    $('#userProvideSyslogDrainUrl').val('');
  }

  showLoading() {
    this.commonService.isLoading = true;
  }

  setAppBinding(app : any){
    app.binding = true;
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

  popclick(id: string, type: string, guid: string, name: string, binding: boolean) {
    $('.space_pop_submenu').hide();
    if (this.current_popmenu_id != id) {
      $("#" + id).show();
      this.current_popmenu_id = id;
      this.selectedType = type;
      this.selectedGuid = guid;
      this.selectedName = name;
      this.selectedBinding = binding;
    } else {
      this.current_popmenu_id = '';
      this.selectedType = '';
      this.selectedGuid = '';
      this.selectedName = '';
      this.selectedBinding = false;
    }
    if (type == "provided") {
      this.userProvidedInfo();
    }
    // this.log.debug('TYPE :: ' + type + ' GUID :: ' + guid + ' NAME :: ' + name);
  }

}

