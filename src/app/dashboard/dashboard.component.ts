import {AfterViewChecked, Component, Input, OnInit} from '@angular/core';
import {CommonService} from '../common/common.service';
import {NGXLogger} from 'ngx-logger';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DashboardService, Service} from './dashboard.service';
import {Organization} from "../model/organization";
import {Space} from '../model/space';
import {AppMainService} from '../dash/app-main/app-main.service';
import {CatalogService} from '../catalog/main/catalog.service';
import {isBoolean, isNullOrUndefined} from "util";
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit,  AfterViewChecked{

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

  public appEntities: any;
  public servicesEntities: any;
  public appSummaryEntities: Observable<any[]>;
  public translateEntities: any = [];

  public currentOrg: string;
  public currentSpace: string;

  public userProvideName: string;
  public userProvideName_update: string;
  public userProvideCredentials: string;
  public userProvideSyslogDrainUrl: string;
  public userProvideType: string;
  public userProvideRouteServiceUrl : string;

  public orgMemoryDevelopmentTotal: number;
  public orgMemoryProductionTotal: string;
  public orgServiceTotal: string;
  public orgQuotaMemoryLimit: number;
  public orgTotalRoutes: string;
  public orgTotalServiceKeys: string;
  public orgTotalServices: string;
  public selectedBinding : boolean;

  public caas_on_off = false;

  public caas_Limit_M = 0;
  public caas_Limit_D = 0;
  public caas_Use_M = 0;
  public caas_Use_D = 0;

  public caas_Pods : any;
  public caas_Deployments : any;
  public caas_ReplicaSets  : any;
  public caas_Services  : any;

  public caas_Pods_length = 0;
  public caas_Deployments_length = 0;
  public caas_ReplicaSets_length = 0;
  public caas_Services_length = 0;
  public caas_Pvc = 0;

  private caas_loading = false;
  private caas_countdown = 0;

  public placeholder = "credentialsStr:{'username':'admin','password':'password';}";

  constructor(private translate: TranslateService, private commonService: CommonService, private dashboardService: DashboardService, private log: NGXLogger,
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

    this.orgMemoryDevelopmentTotal = 0;
    this.orgMemoryProductionTotal = '';
    this.orgServiceTotal = '';
    this.orgQuotaMemoryLimit = 0;
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
  ngAfterViewChecked(){
    this.SETTTING_SCRIPTS();
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
      this.commonService.alertMessage("서버가 불안정합니다.", false);
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
      this.space = this.spaces.find(space => space.guid === this.commonService.getCurrentSpaceGuid())
      if(isNullOrUndefined(this.space)){
        if(this.spaces.length > 0){
          this.currentSpace = this.spaces[0].guid;
        } else {
          this.currentSpace = '';
        }
      }else if (data['resources'].length > 0){
        this.currentSpace = this.commonService.getCurrentSpaceGuid()
        this.commonService.setCurrentSpaceGuid(this.space.guid);
        this.commonService.setCurrentSpaceName(this.space.name);
      }else {
        this.currentSpace = '';
      }
      this.commonService.isLoading = false;
      return data;
    }, error => {
      this.commonService.isLoading = false;
      this.commonService.alertMessage("서버가 불안정합니다.", false);
    }, () => {
      if (this.currentSpace != null) {
        this.commonService.isLoading = false;
        this.getSpaces(this.currentSpace);
      }
    });
    return this.spaces;
  }

  getOrg(value: string, type: string) {
    this.caas_on_off = false;
    this.cass_common_api();
    if (type == 'select') {
      this.appEntities = null;
      this.servicesEntities;
      this.spaces = [];
      this.currentSpace = null;
    } else if(type === 'first'){
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
      this.commonService.setCurrentSpaceGuid('');
      this.commonService.setCurrentSpaceName('');
      this.isEmpty = true;
      this.isSpace = false;
      this.commonService.isLoading = false;
    }
  }



  getOrgSummary() {
    this.dashboardService.getOrgSummary(this.org.guid).subscribe(data => {

      this.orgMemoryDevelopmentTotal = parseInt(data["all_memoryDevelopmentTotal"],10) ;
      this.orgMemoryProductionTotal = data["all_memoryProductionTotal"];
      this.orgServiceTotal = data["all_serviceTotal"];
      this.orgQuotaMemoryLimit = data.quota["memoryLimit"];
      this.orgTotalRoutes = data.quota['totalRoutes'];
      this.orgTotalServiceKeys = data.quota['totalServiceKeys'];
      this.orgTotalServices = data.quota['totalServices'];

      return data;
    }, error => {
      this.commonService.isLoading = false;
      this.commonService.alertMessage("서버가 불안정합니다.", false);
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
      this.commonService.alertMessage("서버가 불안정합니다.", false);
    });
  }

  thumnail(): void {
    let catalog = this.catalogService;
    this.dashboardService.getServicePacks().subscribe(data => {

      $.each(this.servicesEntities, function (skey, servicesEntitie) {
        let cnt = 0;
        $.each(data['list'], function (dkey, servicepack) {
          if (servicesEntitie['service_plan'] != null) {
            if (servicesEntitie['service_plan']['service']['label'] === servicepack['servicePackName']) {
              servicesEntitie['dashboardUseYn'] = servicepack['dashboardUseYn'];
              servicesEntitie['appBindYn'] = servicepack['appBindYn'];
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
          servicesEntitie['thumbImgPath'] = '../../assets/resources/images/catalog/catalog_3.png';
        }
      });
      return data;
    }, error => {
      this.commonService.isLoading = false;
      this.commonService.alertMessage("서버가 불안정합니다.", false);
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
          appEntitie['thumbImgPath'] = '../../assets/resources/images/catalog/catalog_3.png';
        }
      });
      return data;
    }, error => {
      this.commonService.isLoading = false;
      this.commonService.alertMessage("서버가 불안정합니다.", false);
    }, () => {
      // this.log.debug('END');
      // this.log.debug(this.appEntities);
    });
  }

  pattenTest(value: string) {
    const regExpPattern = /[\{\}\[\]\/?,;:|\)*~`!^+<>\#$%&\\\=\(\'\"]/gi;
    $('#' + value).val($('#' + value).val().replace(regExpPattern, ''));
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
    setTimeout(() => this.getAppSummary(this.selectedSpaceId), 3000);
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
    this.dashboardService.userProvidedInfo(this.selectedGuid).subscribe(data => {
      this.userProvideName = data.entity["name"];
      this.userProvideCredentials = JSON.stringify(data.entity["credentials"]);
      this.userProvideSyslogDrainUrl = data.entity["syslog_drain_url"];
      this.userProvideType = data.entity["type"];
      this.userProvideRouteServiceUrl = data.entity['route_service_url'];
      return data;
    });
  }

  createUserProvided() {

    if(this.userProvideCredentials.length > 0){
      var str = JSON.stringify(this.userProvideCredentials);
    }
   let params = {
      orgName: this.org.name,
      spaceGuid: this.selectedSpaceId,
      serviceInstanceName: this.userProvideName,
      credentials: this.userProvideCredentials,
      syslogDrainUrl: this.userProvideSyslogDrainUrl,
     routeServiceUrl : this.userProvideRouteServiceUrl
    };
    this.commonService.isLoading = true;
    this.dashboardService.createUserProvided(params).subscribe(data => {
      if(data.result){
      this.getAppSummary(this.selectedSpaceId);
      this.ngOnInit();
      this.commonService.alertMessage(this.translateEntities.alertLayer.createSuccess, true);
      return data;}
      else if(!data.result){
        this.commonService.alertMessage(data.msg, false);
        this.commonService.isLoading = false;
        return data;
      }
    }, error => {
      this.commonService.alertMessage(this.translateEntities.alertLayer.createFail, false);
      this.commonService.isLoading = false;
      this.getAppSummary(this.selectedSpaceId);
    });
  }

  checkLength() {
    if (this.isUserProvideValidation()) {
      this.createUserProvided();
    } else {
      //
      return false;
    }
  }

  provideinit(){
    this.userProvideCredentials = '';
    this.userProvideName = '';
    this.userProvideSyslogDrainUrl = '';
    this.userProvideRouteServiceUrl = '';
  }


  isUserProvideValidation() {
    if (this.userProvideName !=='') {
      try {
        if (this.userProvideCredentials !==''){
        if(this.userProvideCredentials.length > 0 && this.userProvideCredentials.indexOf("{") > -1 && this.userProvideCredentials.indexOf("}")){
          JSON.parse(this.userProvideCredentials);
          return true;
        }else {
          this.commonService.alertMessage("Credential 작성 형식이 맞지 않습니다.", false);
          return false;
        }
        }
        if( this.userProvideRouteServiceUrl !== '' ){
          if(this.userProvideRouteServiceUrl.indexOf("https://") === -1){
            this.commonService.alertMessage("Route Service Url 작성 형식이 맞지 않습니다.", false);
            return false;
          }
        }
        return true;
      } catch (e) {
        this.commonService.alertMessage("Credential 작성 형식이 맞지 않습니다.", false);
        return false;
      }
    } else {
      this.commonService.alertMessage("userProvideName을 입력해주십시오", false);
      return false;
    }
  }

  updateUserProvided() {
    //username':'admin','password':'password';
    if (!this.isUserProvideValidation()) {
      return;
    }
    let params = {
      orgName: this.org.name,
      guid: this.selectedGuid,
      serviceInstanceName: this.userProvideName,
      credentials: this.userProvideCredentials,
      syslogDrainUrl: this.userProvideSyslogDrainUrl,
      routeServiceUrl : this.userProvideRouteServiceUrl
    };
    this.commonService.isLoading = true;
    this.dashboardService.updateUserProvided(params).subscribe(data => {
      if(data.result){
        this.getAppSummary(this.selectedSpaceId);
        this.commonService.alertMessage(this.translateEntities.alertLayer.updateSuccess, true);
        return data;
      }else {
        this.commonService.alertMessage(data.msg, false);
        this.commonService.isLoading = false;
        return data;
      }
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
      if(data.result) {
        this.commonService.alertMessage(this.translateEntities.alertLayer.updateSuccess, true);
        return data;
      } else {
        this.commonService.alertMessage(data.msg, false);
        this.commonService.isLoading = false;
        return data;
      }
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
        this.commonService.isLoading = false;
        return data;
      }
    }, error => {
      this.commonService.isLoading = false;
      this.commonService.alertMessage(this.translateEntities.alertLayer.deleteFail, false);
    });
    setTimeout(() => this.getAppSummary(this.selectedSpaceId), 3000);
  }


  //move catalogDevelopment
  moveDevelopMent() {
    this.router.navigate(['catalogdevelopment', this.org.guid, this.org.name, this.space['name']]);
  }

  //move appMain
  moveDashboard(app_name: string, app_guid: string) {
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
    // if (id == "dashTab_1") {
    //   $('.monitor_tabs li:nth-child(1)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_on');
    //   $('.monitor_tabs li:nth-child(2)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
    // } else if (id == "dashTab_2") {
    //   $('.monitor_tabs li:nth-child(1)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
    //   $('.monitor_tabs li:nth-child(2)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_on');
    //   $("[id^='popclick_01']").hide();
    // }
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
  renamefocus(){
    $("#layerpop1").modal("show");
    setTimeout(() => {
    $('#appName').trigger('focus');
    $('input[id=appName]').keydown(function (key) {
      if(key.keyCode == 13){
        $('#renameApp').trigger('click');
        $('#renameApp').trigger('click');
      }
    });
  }, 250)
  }

  serviceRename(){
    $("#layerpop3").modal("show");
    setTimeout(() => {
      $('#selectedName').trigger('focus');
      $('input[id=selectedName]').keydown(function (key) {
        if(key.keyCode == 13){
          $('#renameInstance').trigger('click');
          $('#renameInstance').trigger('click');
        }
      });
    }, 300)
  }

  serviceDashbaordlenght(data : any){
    return data.toString().split("|").length;
  }

  serviceDashbaordArray(data : any, number : number){
    return data.toString().split("|");
  }

  app_started() : number {
    if(isNullOrUndefined(this.appEntities)) return 0;
    var started_app = [];

    this.appEntities.forEach(entity => {
      if(entity.state === "STARTED"){
        started_app.push(entity);
      }
    });
    return started_app.length;
  }

  app_stoped() : number{
    if(isNullOrUndefined(this.appEntities)) return 0;
    var stoped_app = [];
    this.appEntities.forEach(entity => {
      if(entity.state === "STOPPED"){
        stoped_app.push(entity);
      }
    });
    return stoped_app.length;
  }

  app_instances()  : number {
    if(isNullOrUndefined(this.appEntities)) return 0;
    var instances = 0;
    this.appEntities.forEach(entity => {
      instances += entity.instances;
    });
    return instances;
  }

  app_disk_quota() : number{
    if(isNullOrUndefined(this.appEntities)) return 0;
    var disk_quota = 0;
    this.appEntities.forEach(entity => {
      disk_quota += entity.disk_quota;
    });
    return disk_quota;
  }

  cass_common_api(){
    if(isNullOrUndefined(this.commonService.getCaaSApiUri()) || this.commonService.getCaaSApiUri() === '') return;
    if(this.caas_loading){ this.commonService.isLoading = true; }
    try{
      this.dashboardService.getCaasCommonUser().subscribe(caasuser=>{
        if(caasuser === null) {return ;}
        caasuser.forEach(r => {
          if(this.commonService.getCurrentOrgGuid() === r.organizationGuid){
            this.caas_on_off = true;
            //네임스페이스 메모리, 디스크 현재, 최대 사용량
            this.dashboardService.getCaasAPI("namespaces/"+ r.caasNamespace+"/resourceQuotas").subscribe(data=>{
              this.caas_Limit_M = this.int_Change(data.items[0].status.hard["limits.memory"]);
              this.caas_Limit_D = this.int_Change(data.items[0].status.hard["requests.storage"]);
              this.caas_Use_M = this.int_Change(data.items[0].status.used["limits.memory"]);
              this.caas_Use_D = this.int_Change(data.items[0].status.used["requests.storage"]);
              this.getCaasOffLoading();
            }, error1 => {
              this.commonService.isLoading = false;
            });

            this.dashboardService.getCaasAPI("namespaces/"+ r.caasNamespace+"/pods").subscribe(data => {
              this.caas_Pods_length = data.items.length;
              this.caas_Pods = data.items;
              this.getCaasOffLoading();
            }, error1 => {
              this.commonService.isLoading = false;
            });

            this.dashboardService.getCaasAPI("namespaces/"+ r.caasNamespace+"/deployments").subscribe(data => {
              this.caas_Deployments = data.items;
              this.caas_Deployments_length = data.items.length;
              this.getCaasOffLoading();
            }, error1 => {
              this.commonService.isLoading = false;
            });

            this.dashboardService.getCaasAPI("namespaces/"+ r.caasNamespace+"/replicaSets").subscribe(data => {
              this.caas_ReplicaSets_length = data.items.length;
              this.caas_ReplicaSets= data.items;
              this.getCaasOffLoading();
            }, error1 => {
              this.commonService.isLoading = false;
            });

            this.dashboardService.getCaasAPI("namespaces/"+ r.caasNamespace+"/services").subscribe(data => {
              this.caas_Services_length = data.items.length;
              this.getCaasOffLoading();
            }, error1 => {
              this.commonService.isLoading = false;
            });

            this.dashboardService.getCaasAPI("namespaces/"+ r.caasNamespace+"/persistentVolumeClaims").subscribe(data => {
              this.caas_Pvc = data.items;
              this.getCaasOffLoading();
            }, error1 => {
              this.commonService.isLoading = false;
            });
        }});
    }, error1 => {
        this.commonService.isLoading = false;
      });
    }
    catch (e) {
      console.error("CaaS Domain Error");
      this.commonService.isLoading = false;
    }
  }

  int_Change(used : String ) : number{
    if(used === "0"){
      return 0;
    }
    var _used = 0;
    if(used.indexOf("G") > 0){
      _used = +used.substring(0, used.length - 2);
    } else if(used.indexOf("M") > 0){
      _used = (+used.substring(0, used.length - 2))/1024 ;
    }
    return _used;
  }

  getPaasTaRefresh(value: string){
    this.showLoading();
    this.getAppSummary(value);
    this.getOrgSummary();
  }

  getCaasRefresh(){
    this.caas_loading = true;
    this.caas_countdown = 0;
    this.cass_common_api();
  }

  getCaasOffLoading(){
    this.caas_countdown++;
    if(this.caas_countdown == 6){
      this.caas_loading = false;
      this.commonService.isLoading = false;
    }
  }

  SETTTING_SCRIPTS(){

    // console.log(this.appEntities);
    //
    // console.log(this.appSummaryEntities);
    // console.log(this.servicesEntities);
    $('.monitor_tabs li').click(function(){
      var tab_c = $(this).attr('name');
      var content = tab_c.substr(4, 1);
      if(tab_c == 'tab01'){

        $('[name="tab01"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_on');
        $('[name="tab02"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
        $('[name="tab03"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
        $('[name="tab04"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
        $('[name="tab05"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
        $('[name="tab06"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');

      } else if(tab_c == 'tab02'){
        $('[name="tab01"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
        $('[name="tab02"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_on');
        $('[name="tab03"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
        $('[name="tab04"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
        $('[name="tab05"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
        $('[name="tab06"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');

      } else if(tab_c == 'tab03'){
        $('[name="tab01"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
        $('[name="tab02"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
        $('[name="tab03"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_on');
        $('[name="tab04"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
        $('[name="tab05"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
        $('[name="tab06"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');

      } else if(tab_c == 'tab04'){
        $('[name="tab01"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
        $('[name="tab02"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
        $('[name="tab03"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
        $('[name="tab04"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_on');
        $('[name="tab05"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
        $('[name="tab06"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');

      } else if(tab_c == 'tab05'){
        $('[name="tab01"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
        $('[name="tab02"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
        $('[name="tab03"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
        $('[name="tab04"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
        $('[name="tab05"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_on');
        $('[name="tab06"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
      } else if(tab_c == 'tab06'){
        $('[name="tab01"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
        $('[name="tab02"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
        $('[name="tab03"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
        $('[name="tab04"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
        $('[name="tab05"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
        $('[name="tab06"]').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_on');
      }
      var i = 0;
      for (i=0; i<4; i++)
      {
        $('.monitor_content0'+i).hide();
      }
      $('.monitor_content0'+content).show();
      $('.service_only').hide();
    });
  }

}


