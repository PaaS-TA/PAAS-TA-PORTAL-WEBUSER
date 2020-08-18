import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppMainService} from './app-main.service';
import {Observable} from 'rxjs/Observable';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {CommonService} from "../../common/common.service";
import {CATALOGURLConstant} from "../../catalog/common/catalog.constant";
import {isNull, isNullOrUndefined, isUndefined} from "util";


declare var Chart: any;
declare var $: any;
declare var jQuery: any;
declare var require: any;
let appConfig = require('assets/resources/env/config.json');

@Component({
  selector: 'app-app-main',
  templateUrl: './app-main.component.html',
  styleUrls: ['./app-main.component.css'],
})
export class AppMainComponent implements OnInit, OnDestroy {

  apiversion = appConfig['apiversion'];

  private jquerySetting: boolean;
  public location: string;
  public orgName: string;
  public orgGuid: string;
  public spaceName: string;
  public spaceGuid: string;
  public appName: string;
  public appGuid: string;
  public isLoading: boolean = false;

  public translateEntities: any = [];
  public InstanceNum: number = 1;
  public appSummaryEntities: Observable<any[]>;
  public appStatsEntities: any;
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
  public appServicesEntitiesRe: any = [];
  public appServicesEntitiesRe2: any = [];
  public appAlarmsEntities: Observable<any[]>;
  public appAlaramEntities: Observable<any[]>;
  public appAutoscalingEntities: Observable<any[]>;

  public servicepacksEntities: Observable<any[]>;
  public servicepacksEntitiesRe: any = [];

  public appThumbImgPath: string;
  public appSummarySpaceGuid: string;
  public appSummaryName: string = "";
  public appSummaryGuid: string;
  public appSummaryState: string;
  public appSummaryRouteUri: string;
  public appSummaryPackageUpdatedAt: string;
  public appSummaryBuildpack: string;
  public appSummaryBuildPackName: string;
  public appSummaryInstance: number;
  public appSummaryInstanceMax: number;
  public appSummaryInstancePer: number;
  public appSummaryMemoryMax: number;
  public appSummaryMemory: number;
  public appSummaryDiskMax: number;
  public appSummaryDisk: number;

  public appStatsCpuPer: number;
  public appStatsMemoryPer: number;
  public appStatsDiskPer: number;

  public appSystemProvidedEnv: string;

  public appRecentLogs: string;

  public tabContentEventListLimit: number;
  public tabContentStatsListLimit: number;

  public sltStatsInstance: string;

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
  public sltServiceUnbindProvide: boolean;
  public sltServiceCredentials: any = [];
  public sltServiceUserProvideCredentials: any = [];

  public appSltEnvSystemName: string;
  public appSltEnvSystemLabel: string;
  public appSltEnvSystemCredentialsHostname: string;
  public appSltEnvSystemCredentialsName: string;
  public appSltEnvSystemCredentialsPassword: string;
  public appSltEnvSystemCredentialsPort: string;
  public appSltEnvSystemCredentialsUri: string;
  public appSltEnvSystemCredentialsUsername: string;

  public sltAlaramPageItems: number;
  public sltAlaramPageIndex: number;
  public sltAlaramResourceType: string;
  public sltAlaramAlarmLevel: string;

  public appAutoscalingInYn: string;
  public appAutoscalingOutYn: string;
  public appAutoscalingCpuMaxThreshold: number;
  public appAutoscalingCpuMinThreshold: number;
  public appAutoscalingInstanceMaxCnt: number;
  public appAutoscalingInstanceMinCnt: number;
  public appAutoscalingInstanceVariationUnit: number;
  public appAutoscalingMeasureTimeSec: number;
  public InstanceIncrementValue: number;
  public appAutoscalingMemoryMaxThreshold: number;
  public appAutoscalingMemoryMinThreshold: number;

  public appAlarmCpuWarningThreshold: number;
  public appAlarmCpuCriticalThreshold: number;
  public appAlarmMemoryWarningThreshold: number;
  public appAlarmMemoryCriticalThreshold: number;
  public appAlarmMeasureTimeSec: number;
  public appAlarmEmail: string;
  public appAlarmEmailSendYn: string;
  public appAlarmAlarmUseYn: string;

  public sltChartInstances: string;
  public sltChartDefaultTimeRange: number;
  public sltChartGroupBy: number;

  public sltLaaSView: boolean = false;
  public sltLaaSUrl: string = '';
  public mem_DirectInputClick : boolean = true;
  public disk_DirectInputClick : boolean= true;

  public interval : any;

  alive = true;

  isLodingNums = 0;

  constructor(public route: ActivatedRoute, public router: Router, public translate: TranslateService, public appMainService: AppMainService, public common: CommonService) {
    this.common.isLoading = false;
    // Observable.timer(0,1000 * 60 * 2)
    // Observable.timer(10000)
    //   .takeWhile(() => this.alive) // only fires when component is alive
    //   .subscribe(() => {
    //     this.ngOnInit();
    //   });

    //setInterval(() => { this.ngOnInit(); }, 1000 * 60 * 2);

    this.interval = setInterval(() => { this.ngOnInit(); }, 1000 * 60 * 2);

    this.translate.get('appMain').subscribe((res: string) => {
      this.translateEntities = res;
    });

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateEntities = event.translations.appMain;
    });
    this.jquerySetting = true;

  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.alive = false; // switches your IntervalObservable off
  }


  ngOnInit() {
    $(document).ready(() => {
      //TODO 임시로...
      $.getScript("../../assets/resources/js/common2.js")
        .done(function (script, textStatus) {
        })
        .fail(function (jqxhr, settings, exception) {
        });
    });
    if (this.jquerySetting) {
      $(".lauthOn").on("click", function () {
        $(".lauth_dl").toggleClass("on");
        $("#routeAddHostName").focus();
      });
      this.jquerySetting = false;
    }


    this.tabContentEventListLimit = 5;
    this.tabContentStatsListLimit = 5;
    this.sltAlaramPageItems = 10;
    this.sltAlaramPageIndex = 1;
    this.sltAlaramResourceType = "";
    this.sltAlaramAlarmLevel = "";
    this.sltChartInstances = "All";
    this.sltChartDefaultTimeRange = 3;
    this.sltChartGroupBy = 1;

    $("[id^='layerpop']").modal("hide");


    if ($(".colright_btn li > ol").hasClass('on'))
      $(".colright_btn li > ol").toggleClass('on');


    if (this.common.getCurrentAppGuid != null) {

      this.location = this.common.getCurrentLocation();
      this.orgName = this.common.getCurrentOrgName();
      this.orgGuid = this.common.getCurrentOrgGuid();
      this.spaceName = this.common.getCurrentSpaceName();
      this.spaceGuid = this.common.getCurrentSpaceGuid();
      this.appName = this.common.getCurrentAppName();
      this.appGuid = this.common.getCurrentAppGuid();

      this.getOrgSummary(this.orgGuid);
      setTimeout(() => this.getAppSummary(this.appGuid), 500);

      this.getAppEvents(this.appGuid);
      this.getAppEnv(this.appGuid);
      this.getAppRecentLogs(this.appGuid);
      this.getAlarms(this.appGuid);
      this.getAlarm(this.appGuid);
      this.getAutoscaling(this.appGuid);
      this.getMaxDisk();
      this.InitLaaSView();
    } else {
      this.common.isLoading = true;
      this.common.alertMessage("Application Fail.", false);
      this.router.navigate(['dashboard']);
    }
    this.keyPressInit();
  }


  keyPressInit() {
    $('input[id=envAddData]').keydown(function (key) {
      if (key.keyCode == 13) {
        $('#envAddButton').trigger('click');
      }
    });
    $('input[id=envAddId]').keydown(function (key) {
      if (key.keyCode == 13) {
        $('#envAddButton').trigger('click');
      }
    });
  }

  spacingExpression($event) {
    const regExpBlankPattern = /[\s]/g;
    let typingStr = $event.target.value.replace(regExpBlankPattern, '').substring(0, 64);
    $event.target.value = typingStr;
  }


  isLoadingCount() {
    this.isLodingNums++;
    if (this.isLodingNums > 2) {
      this.isLodingNums = 0;
      this.common.isLoading = false;
    }
  }


  getAppSummary(guid: any) {
    this.isLoading = true;
    this.appMainService.getAppSummary(guid).subscribe(data => {
      if (isUndefined(data.routes)) {
        this.router.navigate(['dashboard']);
      }
      this.appSummaryEntities = data;
      this.appRoutesEntities = data.routes;
      this.appDomainsEntities = data.available_domains;
      this.appServicesEntities = data.services;

      var apmServer = "";
      var apmAppName = "";
      var appServices = [];
      var appServiceDashboardUri = "";
      $.each(data.services, function (key, serviceObj) {
        if (serviceObj.service_plan != undefined) {
          if (serviceObj.service_plan.service != undefined && serviceObj.service_plan.service.label == "Pinpoint") {
            // $("#apmBtn").attr("disabled", false);
            //
            // if (data.detected_start_command.indexOf("org.springframework.boot.loader.WarLauncher") > 0) {
            if (data.detected_start_command.indexOf("org.springframework.boot") > 0) {
              apmServer = "SPRING_BOOT";
            } else {
              apmServer = "TOMCAT";
            }

            apmAppName = data.detected_start_command.substring(data.detected_start_command.indexOf("applicationName") + 16);
            apmAppName = apmAppName.substring(0, apmAppName.indexOf(" "));
            apmAppName = apmAppName.replace('"', '');

            appServiceDashboardUri = serviceObj.dashboard_url + "/" + apmAppName + "@" + apmServer;
          } else {
            appServiceDashboardUri = serviceObj.dashboard_url;
          }
        } else {
          appServiceDashboardUri = serviceObj.dashboard_url;
        }

        var obj = {
          name: serviceObj.name,
          service_plan: serviceObj.service_plan,
          dashboard_url: appServiceDashboardUri,
          guid: serviceObj.guid
        };
        appServices.push(obj);
      });
      this.appServicesEntitiesRe = appServices;

      this.appSummarySpaceGuid = data.space_guid;

      this.appSummaryName = data.name;
      this.appSummaryGuid = data.guid;
      this.appSummaryState = data.state;
      if (data.routes.length > 0) {
        this.appSummaryRouteUri = data.routes[0].host + "." + data.routes[0].domain.name;
      }
      if (data.package_updated_at != null) {
        this.appSummaryPackageUpdatedAt = data.package_updated_at.replace('T', '  ').replace('Z', ' ');
      }

      if (data.detected_buildpack != null && data.detected_buildpack != "") {
        if (data.detected_buildpack.length > 40) {
          this.appSummaryBuildpack = data.detected_buildpack.substring(0, 40) + "..";
        } else {
          this.appSummaryBuildpack = data.detected_buildpack;
        }
      } else if (data.buildpack != null) {
        if (data.buildpack.length > 40) {
          this.appSummaryBuildpack = data.buildpack.substring(0, 40) + "..";
        } else {
          this.appSummaryBuildpack = data.buildpack;
        }
      }

      this.appSummaryBuildPackName = data.buildpack;

      this.appSummaryInstance = data.instances;
      this.appSummaryInstancePer = Math.round((this.appSummaryInstance * 100) / this.appSummaryInstanceMax);

      $("#instancePer").val(this.appSummaryInstancePer);

      this.appSummaryMemory = data.memory;
      this.appSummaryDisk = data.disk_quota;

      if (this.appSummaryState == "STARTED") {
        this.getAppStats(guid);
        this.sltChartInstances = "All";
        this.getCpuChart();
        this.getMemoryChart();
        this.getNetworkByte();
      } else {
        $("#cpuPer").val("0");
        $("#memoryPer").val("0");
        $("#diskPer").val("0");

        this.appStatusEntities = [];
        // this.procSetAppStatusTab();
      }

      setTimeout(() =>
        $('.BG_wrap input').each(function () {
          var BG_wrap = $(this).val();
          $(this).parent().delay(500).animate({'top': -BG_wrap + '%'}, 800);
          $(this).closest('dl').find("span.rights").html(BG_wrap);
        }), 100);

      this.initRouteTab();
      // this.getSpaceSummary();
      this.getServicepacks();
      // this.getServicesInstances();
      this.getBuildPacks();
    }, error => {
      this.router.navigate(['dashboard']);
    });

  }

  initRouteTab() {

    // $.each(this.appDomainsEntities, function (key, dataobj) {
    // });

    var appRoutes = [];
    $.each(this.appRoutesEntities, function (key, dataobj) {
      var uri = dataobj.host + "." + dataobj.domain.name;

      var obj = {
        uri: uri,
        guid: dataobj.guid
      };
      appRoutes.push(obj);
    });
    this.appRoutesEntitiesRe = appRoutes;
  }

  getMaxDisk() {
    this.appMainService.getCodeMax('APP_DISK_SIZE').subscribe(data => {
      data.list.some(r => {
        if (r.key === 'max_size') {
          this.appSummaryDiskMax = r.value / 1024;
          return true;
        }
        this.appSummaryDiskMax = 10;
      });
    })
  }

  getOrgSummary(guid: string) {
    this.appMainService.getOrgSummary(guid).subscribe(data => {
      this.appMainService.getCodeMax('APP_MEMORY_SIZE').subscribe(codedata => {
        codedata.list.some(r => {
          if (r.key === 'max_size') {
            if (r.value > data.quota.memoryLimit) {
              this.appSummaryMemoryMax = data.quota.memoryLimit / 1024;
            } else {
              this.appSummaryMemoryMax = r.value / 1024;
            }
            return true;
          }
          this.appSummaryMemoryMax = 1;
        });
      });
      this.appMainService.getCodeMax('APP_INSTANCE_SIZE').subscribe(codedata => {
        codedata.list.some(r => {
          if (r.key === 'max_size') {
            if (r.value > data.quota.applicationInstanceLimit && data.quota.applicationInstanceLimit !== -1) {
              this.appSummaryInstanceMax = data.quota.applicationInstanceLimit;
            } else {
              this.appSummaryInstanceMax = r.value;
            }
            return true;
          }
          this.appSummaryInstanceMax = 7;
        })
      });
    });
  }

  getSpaceSummary() {
    this.appMainService.getSpaceSummary(this.appSummarySpaceGuid).subscribe(data => {
      var servicepacks = this.servicepacksEntities;
      var servicepacksRe = [];
      var useServices = this.appServicesEntities;
      $.each(data.services, function (key, dataobj) {
        $.each(servicepacks, function (key2, dataobj2) {
          if (!isNullOrUndefined(dataobj.service_plan)) {
            if ((dataobj.service_plan.service.label === dataobj2.servicePackName) && (dataobj2.appBindYn === 'Y') && (dataobj2.useYn === 'Y')) {
              var obj = {
                name: dataobj.name,
                guid: dataobj.guid,
                label: dataobj.service_plan.service.label,
                appBindParameter: dataobj2.appBindParameter
              };
              servicepacksRe.push(obj);
            }
          }
        });
        if (isNullOrUndefined(dataobj.service_plan)) {
          let obj = {
            name: dataobj.name,
            guid: dataobj.guid,
            label: dataobj.name,
            appBindParameter: ""
          };
          servicepacksRe.push(obj);
        }
      });
      $.each(this.appServicesEntitiesRe2, function (key, bindservice) {
        servicepacksRe.forEach((appservice, index) => {
          if (bindservice.name === appservice.name) {
            servicepacksRe.splice(index, 1);
          }
        });
      });


      this.servicepacksEntitiesRe = servicepacksRe;

    });
  }

  getServicepacks() {
    this.appMainService.getServicepacks().subscribe(data => {
      this.servicepacksEntities = data.list;

      var appServices = [];
      var useYn = "N";
      $.each(this.appServicesEntitiesRe, function (key, serviceObj) {
        if (!isNullOrUndefined(serviceObj.service_plan)) {
          $.each(data.list, function (key2, dataobj2) {
            if (serviceObj.service_plan.service.label == dataobj2.servicePackName) {
              useYn = dataobj2.dashboardUseYn;
            }
          });
          var obj = {
            name: serviceObj.name,
            service_plan: serviceObj.service_plan,
            dashboard_url: serviceObj.dashboard_url,
            guid: serviceObj.guid,
            useYn: useYn,
            provide: false
          };
        } else {
          serviceObj.service_plan = [];
          serviceObj.service_plan.name = 'User-Provide';
          serviceObj.service_plan.service = [];
          serviceObj.service_plan.service.label = "";
          var obj = {
            name: serviceObj.name,
            service_plan: serviceObj.service_plan,
            dashboard_url: serviceObj.service_plan.service,
            guid: serviceObj.guid,
            useYn: 'N',
            provide: true
          }
        }
        appServices.push(obj);
      });
      this.appServicesEntitiesRe2 = appServices;

      this.getSpaceSummary();
    });
  }

  getBuildPacks() {
    this.appMainService.getBuildPacks().subscribe(data => {
      var appBuildPackName = this.appSummaryBuildPackName;

      let appMainservice = this.appMainService;
      let imgPath = this.appThumbImgPath;
      $.each(data.list, function (dkey, buildpack) {
        if (buildpack.buildPackName == appBuildPackName) {
          var pathHeader = buildpack.thumbImgPath.lastIndexOf("/");
          var pathEnd = buildpack.thumbImgPath.length;
          var fileName = buildpack.thumbImgPath.substring(pathHeader + 1, pathEnd);
          appMainservice.getImg(fileName).subscribe(data => {
            let reader = new FileReader();
            reader.addEventListener("load", () => {
              imgPath = reader.result;
              $("#col_in1").css({
                "background": "url(" + imgPath + ") 15px top no-repeat",
                "position": "relative",
                "background-size": "55px 55px"
              });
            }, false);
            if (data) {
              reader.readAsDataURL(data);
            }
          });
        }
      });
    });
  }

  getAppStats(guid: string) {
    this.appMainService.getAppStats(guid).subscribe(data => {
      if (data) {
        this.appStatsEntities = data.instances;

        var cpu = 0;
        var mem = 0;
        var disk = 0;
        var cnt = 0;
        let maxmem = this.appSummaryMemoryMax;
        let maxdisk = this.appSummaryDiskMax;

        $.each(data.instances, function (key, dataobj) {
          if (dataobj.stats != null) {
            if (!(null == dataobj.stats.usage.cpu || '' == dataobj.stats.usage.cpu)) cpu = cpu + dataobj.stats.usage.cpu * 100;
            if (!(null == dataobj.stats.usage.mem || '' == dataobj.stats.usage.mem)) mem = mem + (dataobj.stats.usage.mem) / (maxmem * 1024 * 1024 * 1024) * 100;
            if (!(null == dataobj.stats.usage.disk || '' == dataobj.stats.usage.disk)) disk = disk + (dataobj.stats.usage.disk) / (maxdisk * 1024 * 1024 * 1024) * 100;
            cnt++;
          }
        });
        if (cpu > 0) {
          if (Number((cpu / cnt).toFixed(0)) > 100) {
            this.appStatsCpuPer = 100;
          } else {
            this.appStatsCpuPer = Number((cpu / cnt).toFixed(2));
          }
        } else {
          this.appStatsCpuPer = 0;
        }

        if (mem > 0) {
          this.appStatsMemoryPer = Math.round(mem / cnt);
        } else {
          this.appStatsMemoryPer = 0;
        }

        if (mem > 0) {
          this.appStatsDiskPer = Math.round(disk / cnt);
        } else {
          this.appStatsDiskPer = 0;
        }

        $("#cpuPer").val(this.appStatsCpuPer);
        $("#memoryPer").val(this.appStatsMemoryPer);
        $("#diskPer").val(this.appStatsDiskPer);

        this.procSetAppStatusTab();
      }
    });
  }

  procSetAppStatusTab() {
    var appStatus = [];
    $.each(this.appStatsEntities, function (key, dataobj) {
      var statusClass;
      var statusText;
      // var key;
      var cpu;
      var memory;
      var disk;
      var uptime;

      if ('' != dataobj.state && ('RUNNING' == dataobj.state || 'running' == dataobj.state)) {
        statusClass = "";
        statusText = dataobj.state;
      } else if ('' != dataobj.state && ('STARTING' == dataobj.state || 'starting' == dataobj.state)) {
        statusClass = "3";
        statusText = dataobj.state;
      } else {
        statusClass = "2";
        statusText = dataobj.state;
      }
      //RESTART statusClass = 4

      if (statusText == "DOWN") {
        cpu = 0;
        memory = 0;
        disk = 0;
        uptime = 0;
      } else {
        cpu = (Math.round((dataobj.stats.usage.cpu * 100) * Math.pow(10, 2)) / Math.pow(10, 2)).toFixed(2);
        // memory = dataobj.stats.usage.mem.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        // disk = dataobj.stats.usage.disk.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        memory = dataobj.stats.usage.mem.toString();
        disk = dataobj.stats.usage.disk.toString();
        uptime = (Math.round((dataobj.stats.uptime / 60) * Math.pow(10, 0)) / Math.pow(10, 0)).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

      var memoryBytes = parseInt(memory);
      var s = ['Byets', 'KB', 'MB', 'GB', 'TB', 'PB'];
      var e = Math.floor(Math.log(memoryBytes) / Math.log(1024));
      if (e === Number.NEGATIVE_INFINITY) {
        memory = "0 " + s[0];
      } else {
        memory = (memoryBytes / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e];
      }

      var diskBytes = parseInt(disk);
      var s = ['Byets', 'KB', 'MB', 'GB', 'TB', 'PB'];
      var e = Math.floor(Math.log(diskBytes) / Math.log(1024));
      if (e === Number.NEGATIVE_INFINITY) {
        disk = "0 " + s[0];
      } else {
        disk = (diskBytes / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e];
      }

      var obj = {
        statusClass: statusClass,
        statusText: statusText,
        key: key,
        cpu: cpu,
        memory: memory,
        disk: disk,
        uptime: uptime
      };
      appStatus.push(obj);
    });
    this.appStatusEntities = appStatus;

    setTimeout(() =>
      $('.BG_wrap input').each(function () {
        var BG_wrap = $(this).val();
        $(this).parent().delay(500).animate({'top': -BG_wrap + '%'}, 800);
        $(this).closest('dl').find("span.rights").html(BG_wrap);
      }), 100);
  }

  showPopAppStartClick() {
    $("#layerpop_app_start").modal("show");
  }

  startAppClick() {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    let params = {
      guid: this.appSummaryGuid,
      orgName: this.orgName,
      spaceName: this.spaceName,
      name: this.appName
    };
    this.appMainService.startApp(params).subscribe(data => {
      if (data.result) {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.appstartSuccess, true);

        this.ngOnInit();
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.appstartFail + "<br><br>" + data.msg, false);
        this.ngOnInit();
      }
    });
  }

  showPopAppStopClick() {
    $("#layerpop_app_stop").modal("show");
  }

  stopAppClick() {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    let params = {
      guid: this.appSummaryGuid
    };
    this.appMainService.stopApp(params).subscribe(data => {
      if (data.result) {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.appstopSuccess, true);

        this.ngOnInit();
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.appstopFail + "<br><br>" + data.msg.description, false);
        this.ngOnInit();
      }
    });
  }

  showPopAppRestageClick() {
    $("#layerpop_app_restart").modal("show");
  }

  restageAppClick() {
    $("[id^='layerpop']").modal("hide");
    $("#layerpop_app_save").modal("hide");
    this.common.isLoading = true;

    let params = {
      guid: this.appSummaryGuid
    };
    this.appMainService.restageApp(params).subscribe(data => {
      //TODO 재시작 후 시간 텀을주어 init 할 것인가??
      if (data.result) {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.appRestartSuccess, true);

        this.ngOnInit();
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.appRestartFail + "<br><br>" + data.msg.description, false);
        this.ngOnInit();
      }
    });
  }

  instanceUpClick() {
    if (this.appSummaryInstanceMax >= (Number(this.appSummaryInstance) + 1)) {
      this.appSummaryInstance = Number(this.appSummaryInstance) + 1;
      $("#instance_in").val(this.appSummaryInstance);
    }
  }

  instanceDownClick() {
    if (1 <= (Number(this.appSummaryInstance) - 1)) {
      this.appSummaryInstance = Number(this.appSummaryInstance) - 1;
      $("#instance_in").val(this.appSummaryInstance);
    }
  }

  instanceDirectInputClick() {
    if ($("#instanceS2").css("display") == "none") {
      this.appSummaryInstance = $("#instance_in").val();
      $("#instanceS1").hide();
      $("#instanceS2").show();
      $("#instance_in").focus();
    } else {
      $("#instance_in").val(this.appSummaryInstance);
      $("#instanceS2").hide();
      $("#instanceS1").show();
    }
  }

  showPopInstanceSaveClick() {
    $("#layerpop_app_save").modal("show");
  }

  memUpClick() {
    if ((this.appSummaryMemoryMax * 1024) >= (Number(this.appSummaryMemory) + 128)) {
      this.appSummaryMemory = Number(this.appSummaryMemory) + 128;
      $("#mem_in").val(this.appSummaryMemory);
    }
  }

  memDownClick() {
    if (1 <= (Number(this.appSummaryMemory) - 128)) {
      this.appSummaryMemory = Number(this.appSummaryMemory) - 128;
      $("#mem_in").val(this.appSummaryMemory);
    }
  }

  memDirectInputClick() {
    this.mem_DirectInputClick = !this.mem_DirectInputClick;
    if ($("#memS2").css("display") == "none") {
      this.appSummaryMemory = $("#mem_in").val();

      $("#memS1").hide();
      $("#memS2").show();
      $("#mem_in").focus();
    } else {
      this.appSummaryMemory = $("#mem_in").val();
      if (this.appSummaryMemory >= 1024) {

      } else {

      }
      $("#memS2").hide();
      $("#memS1").show();
    }
  }

  showPopMemSaveClick() {
    $("#layerpop_app_save").modal("show");
  }

  diskUpClick() {
    if ((this.appSummaryDiskMax * 1024) >= (Number(this.appSummaryDisk) + 128)) {
      this.appSummaryDisk = Number(this.appSummaryDisk) + 128;
      $("#disk_in").val(this.appSummaryDisk);
    }
  }

  diskDownClick() {
    if (1 <= (Number(this.appSummaryDisk) - 128)) {
      this.appSummaryDisk = Number(this.appSummaryDisk) - 128;
      $("#disk_in").val(this.appSummaryDisk);
    }
  }

  diskDirectInputClick() {
    this.disk_DirectInputClick = !this.disk_DirectInputClick;
    if ($("#diskS2").css("display") == "none") {
      this.appSummaryDisk = $("#disk_in").val();

      $("#diskS1").hide();
      $("#diskS2").show();
      $("#disk_in").focus();
    } else {
      this.appSummaryDisk = $("#disk_in").val();
      if (this.appSummaryDisk >= 1024) {

      } else {

      }
      $("#diskS2").hide();
      $("#diskS1").show();
    }
  }

  showPopDiskSaveClick() {
    $("#layerpop_app_save").modal("show");
  }

  appSaveClick() {
    $("[id^='layerpop']").modal("hide");
    $("#layerpop_app_save").modal("hide");
    this.common.isLoading = true;
    this.updateApp();
  }

  showAppEditLayer() {
    $(".colright_btn li > ol").toggleClass('on');
  }

  renameAppClick() {
    $("body > div").addClass('account_modify');
    $(this).toggleClass("on");
    $(this).parents("tr").next("tr").toggleClass("on");
    $(this).parents("tr").addClass("off")
  }

  showPopRenameSaveClick() {
    $("#layerpop_app_save").modal("show");
  }

  showPopAppDelClick() {
    $("#layerpop_app_del").modal("show");
  }

  appDelClick() {
    $("[id^='layerpop']").modal("hide");
    $("#layerpop_app_del").modal("hide");
    this.common.isLoading = true;

    this.appMainService.delApp(this.appGuid).subscribe(data => {
      if (data.result) {
        this.common.alertMessage(this.translateEntities.alertLayer.appDelSuccess, true);

        // this.common.isLoading = false;
        this.router.navigate(['dashboard']);
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.appDelFail + "<br><br>" + data.msg.description, false);
      }
    });
  }

  // 앱 수정사항 저장
  updateApp() {
    var instancesChange = 0;
    var memoryChange = 0;
    var diskChange = 0;
    var name = "";

    if ($("#instanceS2").css("display") == "inline") {
      instancesChange = $("#instance_in").val();
    } else {
      instancesChange = this.appSummaryInstance;
    }

    if ($("#memS2").css("display") == "inline") {
      memoryChange = $("#mem_in").val();
    } else {
      memoryChange = this.appSummaryMemory;
    }

    if ($("#diskS2").css("display") == "inline") {
      diskChange = $("#disk_in").val();
    } else {
      diskChange = this.appSummaryDisk;
    }

    // if ($(".instanceS").text() != '') {
    //   instancesChange = $(".instanceS").text();
    // } else {
    //   instancesChange = $("#instance_in").val();
    // }
    // if ($(".memS").text() != '') {
    //   memoryChange = $(".memS").text();
    // } else {
    //   memoryChange = $("#mem_in").val();
    // }
    // if ($(".diskS").text() != '') {
    //   diskChange = $(".diskS").text();
    // } else {
    //   diskChange = $("#disk_in").val();
    // }

    if ($(".tempTitle").val() != '') {
      name = $(".tempTitle").val();
    } else {
      name = "";
    }

    let params = {
      guid: this.appSummaryGuid,
      instances: instancesChange,
      memory: memoryChange,
      diskQuota: diskChange,
      name: name
    };
    this.appMainService.updateApp(params).subscribe(data => {
      if (data.result) {
        $(".headT,.headT2").css("display", "none");

        $("#instanceS2").hide();
        $("#instanceS1").show();

        $("#memS2").hide();
        $("#memS1").show();

        $("#diskS2").hide();
        $("#diskS1").show();


        this.appSummaryMemory = memoryChange;
        // if (memoryChange >= 1024) {
        //   $("#memS2").next().text("G");
        // } else {
        //   $("#memS2").next().text("M");
        // }

        this.appSummaryDisk = diskChange;
        // if (diskChange >= 1024) {
        //   $("#diskS2").next().text("G");
        // } else {
        //   $("#diskS2").next().text("M");
        // }

        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.appUpdateSuccess, true);

        this.ngOnInit();
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.appUpdateFail + "<br><br>" + data.msg.description, false);
        this.ngOnInit();
      }
    });
  }

  updateAppEnv(type, index) {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    var updateEnvironment = {};
    var appEnvName = "";
    var appEnvValue = "";
    var alertLayerSuccessText = "";
    var alertLayerFailText = "";

    if (type == "add") {
      for (var i = 0; i < $("[id^='envEditId']").size(); i++) {
        appEnvName = $("#envEditId" + i).val();
        appEnvValue = $("#envEditData" + i).val();
        updateEnvironment[appEnvName] = appEnvValue;
      }
      appEnvName = $("#envAddId").val();
      appEnvValue = $("#envAddData").val();
      updateEnvironment[appEnvName] = appEnvValue;

      alertLayerSuccessText = this.translateEntities.alertLayer.envAddSuccess;
      alertLayerFailText = this.translateEntities.alertLayer.envAddFail;
    } else if (type == "modify") {
      for (var i = 0; i < $("[id^='envEditId']").size(); i++) {
        appEnvName = $("#envEditId" + i).val();
        appEnvValue = $("#envEditData" + i).val();
        updateEnvironment[appEnvName] = appEnvValue;
      }

      alertLayerSuccessText = this.translateEntities.alertLayer.envModySuccess;
      alertLayerFailText = this.translateEntities.alertLayer.envModyFail;
    } else if (type == "delete") {
      for (var i = 0; i < $("[id^='envEditId']").size(); i++) {
        appEnvName = $("#envEditId" + i).val();
        appEnvValue = $("#envEditData" + i).val();
        updateEnvironment[appEnvName] = appEnvValue;
      }

      appEnvName = this.sltEnvDelName;
      delete updateEnvironment[appEnvName];

      alertLayerSuccessText = this.translateEntities.alertLayer.envDelSuccess;
      alertLayerFailText = this.translateEntities.alertLayer.envDelFail;
    }

    let params = {
      guid: this.appSummaryGuid,
      environment: updateEnvironment

    };
    this.appMainService.updateApp(params).subscribe(data => {
      if (data.result) {
        $("#add_env").hide();

        this.common.isLoading = false;
        this.common.alertMessage(alertLayerSuccessText, true);

        this.showPopAppRestageClick();
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(alertLayerFailText + "<br><br>" + data.msg.description, false);
      }
    });
  }

  getAppEvents(guid: any) {
    this.appMainService.getAppEvents(guid).subscribe(data => {
      this.appEventsEntities = data.resources;

      var appEvents = [];
      $.each(data.resources, function (key, dataobj) {
        if (dataobj.entity.type == "app.crash") {
          dataobj.entity.metadata.request = "app:CRASHED";
        } else if (dataobj.entity.type == "audit.app.restage") {
          dataobj.entity.metadata.request = "app:RESTAGE";
        } else if (dataobj.entity.type == "audit.app.create") {
          dataobj.entity.metadata.request = "app:CREATE";
        } else if (dataobj.entity.metadata.request == null) {
          dataobj.entity.metadata.request = "";
        }

        var requestText = JSON.stringify(dataobj.entity.metadata.request).replace('{', '').replace('}', '').replace(/"/gi, '');
        var iconClass;

        if (requestText == "state:STARTED") {
          iconClass = "fas fa-play";
        } else if (requestText == "state:STOPPED") {
          iconClass = "fas fa-stop";
        } else if (requestText == "app:CRASHED") {
          iconClass = "glyphicon glyphicon-exclamation-sign";
        } else {
          iconClass = "glyphicon glyphicon-arrow-up";
        }

        var obj = {
          iconClass: iconClass,
          date: dataobj.metadata.created_at.replace('T', '  ').replace('Z', ''),
          type: dataobj.entity.type,
          actor_name: dataobj.entity.actor_name,
          requestText: requestText
        };
        appEvents.push(obj);
        // this.isLoadingCount();
      });
      this.appEventsEntitiesRe = appEvents;
      this.isLoadingCount();
    });
  }

  getAppEnv(guid: any) {
    this.appMainService.getAppEnv(guid).subscribe(data => {
      this.appEnvEntities = data;

      this.appSystemProvidedEnv = JSON.stringify(data, undefined, 2);

      if (JSON.stringify(data.environment_json) == "{}") {
        this.appEnvUserEntities = [];
      } else {
        var appUserEnv = [];
        $.each(data.environment_json, function (eventID, eventData) {
          var obj = {
            eventID: eventID,
            eventData: eventData
          };
          appUserEnv.push(obj);
        });
        this.appEnvUserEntities = appUserEnv;
        this.isLoadingCount();
      }

      if (JSON.stringify(data.system_env_json) != "{}") {
        this.appEnvSystemEntities = data.system_env_json.VCAP_SERVICES;
      }
    });
  }

  getAppRecentLogs(guid: any) {
    this.appMainService.getAppRecentLogs(guid).subscribe(data => {
      var str = "";
      $.each(data.log, function (key, dataobj) {
        str += dataobj.logMessage.message + '<br>';
      });
      this.appRecentLogs = str;

      this.isLoadingCount();
    });
  }

  getAlarms(guid: any) {
    if (!appConfig.monitoring) {
      return;
    }
    this.appMainService.getAlarms(guid, this.sltAlaramPageItems, this.sltAlaramPageIndex, this.sltAlaramResourceType, this.sltAlaramAlarmLevel).subscribe(data => {
      this.appAlarmsEntities = data.data;
      this.isLoadingCount();
    });
  }

  selectBoxAlarmTypeChange(resourceType: string) {
    this.sltAlaramResourceType = resourceType;
    this.getAlarms(this.appSummaryGuid);
  }

  selectBoxAlarmStatusChange(alarmLevel: string) {
    this.sltAlaramAlarmLevel = alarmLevel;
    this.getAlarms(this.appSummaryGuid);
  }

  alarmsMoreClick() {
    this.sltAlaramPageItems = this.sltAlaramPageItems + 10;
    this.getAlarms(this.appSummaryGuid);
  }

  getAlarm(guid: any) {
    if (!appConfig.monitoring) {
      return;
    }
    //TODO 임시

    this.appMainService.getAlarm(guid).subscribe(data => {
      this.appAlaramEntities = data;

      this.appAlarmCpuWarningThreshold = data.cpuWarningThreshold;
      this.appAlarmCpuCriticalThreshold = data.cpuCriticalThreshold;
      this.appAlarmMemoryWarningThreshold = data.memoryWarningThreshold;
      this.appAlarmMemoryCriticalThreshold = data.memoryCriticalThreshold;
      this.appAlarmMeasureTimeSec = data.measureTimeSec;
      this.appAlarmEmail = data.email;
      this.appAlarmEmailSendYn = data.emailSendYn;
      this.appAlarmAlarmUseYn = data.alarmUseYn;

      if (this.appAlarmEmailSendYn == "Y") {
        $("#switch12").attr("checked", true);
      } else {
        $("#switch12").attr("checked", false);
      }

      if (this.appAlarmAlarmUseYn == "Y") {
        $("#switch13").attr("checked", true);
      } else {
        $("#switch13").attr("checked", false);
      }
      this.isLoadingCount();
    });
  }

  showPopAlarmEditClick() {
    if (!appConfig.monitoring) {
      return;
    }
    if ($('#appAlarmEmail').css("color") == "rgb(255, 0, 0)") {
      alert("Email 형식이 잘못 되었습니다.");
      return false;
    }

    $("#layerpop_alarm_edit").modal("show");
  }

  editAlarmClick() {
    if (!appConfig.monitoring) {
      return;
    }
    if ($("#switch12").is(":checked") == true) {
      this.appAlarmEmailSendYn = "Y";
    } else {
      this.appAlarmEmailSendYn = "N";
    }

    if ($("#switch13").is(":checked") == true) {
      this.appAlarmAlarmUseYn = "Y";
    } else {
      this.appAlarmAlarmUseYn = "N";
    }

    let params = {
      // TODO 하드코딩
      // appGuid: this.appSummaryGuid,
      appGuid: this.appSummaryGuid,
      cpuWarningThreshold: Number($("#appAlarmCpuWarningThreshold").val()),
      cpuCriticalThreshold: Number($("#appAlarmCpuCriticalThreshold").val()),
      memoryWarningThreshold: Number($("#appAlarmMemoryWarningThreshold").val()),
      memoryCriticalThreshold: Number($("#appAlarmMemoryCriticalThreshold").val()),
      measureTimeSec: Number($("#appAlarmMeasureTimeSec").val()),
      email: $("#appAlarmEmail").val(),
      emailSendYn: this.appAlarmEmailSendYn,
      alarmUseYn: this.appAlarmAlarmUseYn
    };

    this.appMainService.updateAlarm(params).subscribe(data => {
      if (data) {
        if (data.status == "success") {
          this.ngOnInit();
          $("[id^='layerpop']").modal("hide");
        } else {
          $("[id^='layerpop']").modal("hide");
          alert("error");
        }
      } else {
        this.ngOnInit();
        $("[id^='layerpop']").modal("hide");
        alert("error");
      }
    });
  }

  getAutoscaling(guid: any) {
    // TODO 임시
    if (!appConfig.monitoring) {
      return;
    }

    this.appMainService.getAutoscaling(guid).subscribe(data => {
      this.appAutoscalingEntities = data;

      this.appAutoscalingInYn = data.autoScalingInYn;
      this.appAutoscalingOutYn = data.autoScalingOutYn;
      this.appAutoscalingCpuMaxThreshold = data.cpuMaxThreshold;
      this.appAutoscalingCpuMinThreshold = data.cpuMinThreshold;
      this.appAutoscalingInstanceMaxCnt = data.instanceMaxCnt;
      this.appAutoscalingInstanceMinCnt = data.instanceMinCnt;
      this.appAutoscalingInstanceVariationUnit = data.instanceVariationUnit;
      this.appAutoscalingMeasureTimeSec = data.measureTimeSec;
      this.appAutoscalingMemoryMaxThreshold = data.memoryMaxThreshold;
      this.appAutoscalingMemoryMinThreshold = data.memoryMinThreshold;
      if (data.autoScalingCpuYn === 'Y') {
        $("#autoScalingCpuYn").attr("checked", true);
      } else {
        $("#autoScalingCpuYn").attr("checked", false);
      }
      if (data.autoScalingMemoryYn === 'Y') {
        $("#autoScalingMemoryYn").attr("checked", true);
      } else {
        $("#autoScalingMemoryYn").attr("checked", false);
      }

      if (this.appAutoscalingOutYn == "Y") {
        $("#switch10").attr("checked", true);
      } else {
        $("#switch10").attr("checked", false);
      }

      if (this.appAutoscalingInYn == "Y") {
        $("#switch11").attr("checked", true);
      } else {
        $("#switch11").attr("checked", false);
      }

      this.isLoadingCount();
    });
  }

  showPopAutoscalingEditClick() {
    $("#layerpop_autoscaling_edit").modal("show");
  }

  editAutoscalingClick() {
    if (!appConfig.monitoring) {
      return;
    }
    if ($("#switch10").is(":checked") == true) {
      this.appAutoscalingOutYn = "Y";
    } else {
      this.appAutoscalingOutYn = "N";
    }

    if ($("#switch11").is(":checked") == true) {
      this.appAutoscalingInYn = "Y";
    } else {
      this.appAutoscalingInYn = "N";
    }

    let params = {
      // TODO 하드코딩
      // appGuid: this.appSummaryGuid,
      appGuid: this.appGuid,
      instanceMinCnt: Number($("#appAutoscalingInstanceMinCnt").val()),
      instanceMaxCnt: Number($("#appAutoscalingInstanceMaxCnt").val()),
      cpuMinThreshold: Number($("#appAutoscalingCpuMinThreshold").val()),
      cpuMaxThreshold: Number($("#appAutoscalingCpuMaxThreshold").val()),
      memoryMinThreshold: Number($("#appAutoscalingMemoryMinThreshold").val()),
      memoryMaxThreshold: Number($("#appAutoscalingMemoryMaxThreshold").val()),
      instanceVariationUnit: Number($("#InstanceIncrementValue").val()),
      measureTimeSec: Number($("#appAutoscalingMeasureTimeSec").val()),
      autoScalingOutYn: this.appAutoscalingOutYn,
      autoScalingInYn: this.appAutoscalingInYn,
      autoScalingCpuYn: $("#autoScalingCpuYn").is(":checked") ? 'Y' : 'N',
      autoScalingMemoryYn: $("#autoScalingMemoryYn").is(":checked") ? 'Y' : 'N'
    };
    this.appMainService.updateAutoscaling(params).subscribe(data => {
      if (data) {
        if (data.status == "success") {
          this.ngOnInit();
          $("[id^='layerpop']").modal("hide");
        } else {
          $("[id^='layerpop']").modal("hide");
          alert("error");
        }
      } else {
        this.ngOnInit();
        $("[id^='layerpop']").modal("hide");
        alert("error");
      }
    });
  }

  addAppRoute() {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    let params = {
      applicationId: this.appGuid,
      host: $("#routeAddHostName").val(),
      domainId: $("#selectBoxDomain").val(),
      spaceId: this.appSummarySpaceGuid
    };
    this.appMainService.addAppRoute(params).subscribe(data => {
      if (data.result) {
        $(".lauth_dl").toggleClass("on");

        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.routeAddSuccess, true);

        this.ngOnInit();
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.routeAddFail + "<br><br>" + data.msg.description, false);
        this.ngOnInit();
      }
    });
  }

  delAppRoute() {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    let params = {};
    this.appMainService.delAppRoute(this.appGuid, this.sltRouteDelGuid, params).subscribe(data => {
      if (data.result) {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.routeDelSuccess, true);

        this.ngOnInit();
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.routeDelFail + "<br><br>" + data.msg.description, false);
        this.ngOnInit();
      }
    });
  }

  selectBoxServiceChange(val: string) {

    var appBindParam = [];

    $.each(this.servicepacksEntitiesRe, function (key, dataobj) {
      if (dataobj.guid == val) {
        var str = dataobj.appBindParameter.replace("}", "").replace("{", "");
        var split = str.split(",");

        for (var i = 0; i < split.length; i++) {
          var deleteSign = split[i].replace(/"/g, "");
          var splitSign = deleteSign.split(":");

          if (splitSign != null && splitSign != "undefined" && splitSign != "") {
            var type = splitSign[1];
            var value = "";
            if (type == "default") {
              type = "hidden";
              value = "default";
            }

            var obj = {
              key: splitSign[0],
              type: type,
              value: value
            };
            appBindParam.push(obj);
          }
        }
      }
    });
    this.sltServiceParam = appBindParam;

    setTimeout(() => this.serviceParamEvent(), 0);
  }

  serviceParamEvent() {
    if ($("[id^='serviceParamVal_']").size() > 0) {
      $("[id^='serviceParamVal_']:eq(0)").focus();
    }
  }

  tabShowClick(id: string) {
    $('.nav_1d li').removeClass('cur');
    $("#nav_" + id).addClass('cur');

    $("[id^='tabContent_']").hide();
    $("#" + id).show();

    if (id == "tabContent_viewchart") {
      $("#" + id + "_1").show();
    }
  }

  tabShowViewchartClick(id: string) {
    $("[id^='tab_viewchart_']").hide();
    $("#" + id).show();

    if (id == "tab_viewchart_1") {
      $('.monitor_tabs li:nth-child(1)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_on');
      $('.monitor_tabs li:nth-child(2)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
      $('.monitor_tabs li:nth-child(3)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
    } else if (id == "tab_viewchart_2") {
      $('.monitor_tabs li:nth-child(1)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
      $('.monitor_tabs li:nth-child(2)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_on');
      $('.monitor_tabs li:nth-child(3)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
    } else if (id == "tab_viewchart_3") {
      $('.monitor_tabs li:nth-child(1)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
      $('.monitor_tabs li:nth-child(2)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
      $('.monitor_tabs li:nth-child(3)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_on');
    }

  }

  eventListMoreClick() {
    this.tabContentEventListLimit = this.tabContentEventListLimit + 5;
  }

  statsListMoreClick() {
    this.tabContentStatsListLimit = this.tabContentStatsListLimit + 5;
  }

  showPopStatsRestartClick(index: string) {
    this.sltStatsInstance = index;
    $("#layerpop_stats_restart").modal("show");
  }

  statsResrtartClick() {

    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    let params = {};
    this.appMainService.terminateInstance(this.appGuid, this.sltStatsInstance, params).subscribe(data => {
      if (data.result) {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.instanceRestartSuccess, true);
        this.ngOnInit();
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.instanceRestartFail + "<br><br>" + data.msg.description, false);
        this.ngOnInit();
      }
    });
  }

  showEditEnvClick(index: string) {
    $("#DLid" + index).show();
    $("#envEditData" + index).focus();
  }

  hideEditEnvClick(index: string) {
    $("#DLid" + index).hide();
  }

  showPopEnvEditClick(index: string) {
    this.sltEnvEditName = $("#envEditId" + index).val();
    $("#layerpop_env_edit").modal("show");
  }

  editEnvClick() {
    this.updateAppEnv('modify', '');
  }

  showAddEnvClick() {
    $("#add_env").show();
    $("#envAddId").val('');
    $("#envAddData").val('');
    $("#envAddId").focus();
  }

  hideAddEnvClick() {
    $("#add_env").hide();
  }

  showPopEnvAddClick() {
    this.sltEnvAddName = $("#envAddId").val();
    $("#layerpop_env_add").modal("show");
  }

  addEnvClick() {
    this.updateAppEnv('add', '');
  }

  showPopEnvDelClick(eventID: string) {
    this.sltEnvDelName = eventID;
    $("#layerpop_env_del").modal("show");
  }

  delEnvClick() {
    this.updateAppEnv('delete', '');
  }

  showPopRouteAddClick() {
    this.sltRouteAddName = $("#routeAddHostName").val();
    $("#layerpop_route_add").modal("show");
  }

  addRouteClick() {
    this.addAppRoute();
  }

  showPopRouteDelClick(guid: string, uri: string) {
    this.sltRouteDelGuid = guid;
    this.sltRouteDelUri = uri;
    $("#layerpop_route_del").modal("show");
  }

  delRouteClick() {
    this.delAppRoute();
  }

  showServiceBindClick() {
    $(".service_dl").toggleClass("on");
  }

  showPopServiceBindClick() {
    if ($("#selectBoxService").val() == "") {
      alert("서비스를 선택 하세요.");
      return false;
    }

    this.sltServiceBindName = $("#selectBoxService option:checked").text().trim();
    $("#layerpop_service_bind").modal("show");
  }

  bindServiceClick() {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    var bindParam = "";

    if ($("input[id^='serviceParamKey_']").length > 0) {
      for (var i = 0; i < $("input[id^='serviceParamKey_']").length; i++) {
        var key = $("input[id^='serviceParamKey_']:eq(" + i + ")").val();
        var value = $("input[id^='serviceParamVal_']:eq(" + i + ")").val();

        if(key.toUpperCase() === 'APP_GUID'){
          value = this.appGuid;
        }

        if (value == undefined || value == null || value == 'null' || value == 'defalut') {
          value = "default";
        }

        if (bindParam.length > 0) {
          bindParam = bindParam + ',"' + key + '":"' + value + '"';
        } else {
          bindParam = bindParam + '"' + key + '":"' + value + '"';
        }
      }
    }

    bindParam = "{" + bindParam + "}";

    let params = {
      applicationId: this.appSummaryGuid,
      serviceInstanceId: $("#selectBoxService").val(),
      parameter: bindParam
    };
    this.appMainService.bindService(params).subscribe(data => {
      if (data.result) {
        $(".service_dl").toggleClass("on");
        this.sltServiceParam = [];

        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.bindServiceSuccess, true);

        this.showPopAppRestageClick();
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.bindServiceFail + "<br><br>" + data.msg.description, false);
      }
    });
  }

  showPopServiceCredentialsClick(name: string, guid: string, label: string, provide: boolean) {
    this.sltServiceUnbindProvide = provide;
    if (this.sltServiceUnbindProvide) {
      this.appMainService.userProvideCredentials(guid).subscribe(data => {
        this.sltServiceUserProvideCredentials = data.List;
      });
    } else {
      this.sltServiceCredentials = [];
      let service = this.sltServiceCredentials;
      $.each(this.appEnvSystemEntities, function (key, dataobj) {
        if (key == label) {
          $.each(dataobj, function (key2, dataobj2) {
            if (dataobj2.name == name) {
              $.each(Object.getOwnPropertyNames(dataobj2.credentials), function (key2, dataobj3) {
                let key = dataobj3;
                let value = dataobj2.credentials[dataobj3];
                let push = {'key': key, 'value': dataobj2.credentials[dataobj3]};
                service.push(push);
              });
            }
          });
        }
      });
    }
    $("#layerpop_service_credentials").modal("show");
  }

  showPopServiceUnbindClick(name: string, guid: string, provide: boolean) {
    this.sltServiceUnbindName = name;
    this.sltServiceUnbindGuid = guid;
    this.sltServiceUnbindProvide = provide;
    $("#layerpop_service_unbind").modal("show");
  }

  unbindServiceClick() {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    let params = {};
    if (this.sltServiceUnbindProvide) {
      this.appMainService.unbindUserProvideService(this.appGuid, this.sltServiceUnbindGuid, params).subscribe(data => {
        if (data.result) {
          this.common.isLoading = false;
          this.common.alertMessage(this.translateEntities.alertLayer.unbindServiceSuccess, true);
          this.showPopAppRestageClick();
        } else {
          this.common.isLoading = false;
          this.common.alertMessage(this.translateEntities.alertLayer.unbindServiceFail + "<br><br>" + data.msg.description, false);
        }
      });
    } else if (!this.sltServiceUnbindProvide) {
      this.appMainService.unbindService(this.appGuid, this.sltServiceUnbindGuid, params).subscribe(data => {
        if (data.result) {
          this.common.isLoading = false;
          this.common.alertMessage(this.translateEntities.alertLayer.unbindServiceSuccess, true);
          this.showPopAppRestageClick();
        } else {
          this.common.isLoading = false;
          this.common.alertMessage(this.translateEntities.alertLayer.unbindServiceFail + "<br><br>" + data.msg.description, false);
        }
      });
    }
  }

  getCpuChart() {
    if (!appConfig.monitoring) {
      return;
    }
    var speedCanvas = document.getElementById("speedChart");

    Chart.defaults.global.defaultFontFamily = "gulim";
    Chart.defaults.global.defaultFontSize = 12;

    var guid = this.appGuid;
    var idx = String(this.appSummaryInstance);
    var defaultTimeRange = String(this.sltChartDefaultTimeRange) + "m";
    var groupBy = String(this.sltChartGroupBy) + "s";
    var type = $("#selectBoxChartInstance").val();
    var sltChartInstancesValue = this.sltChartInstances;

    this.appMainService.getCpuUsage(guid, idx, defaultTimeRange, groupBy, type).subscribe(data => {
      var levelsArray = new Array();
      var levelsArray2 = new Array();
      var levelsObj = new Object();
      var datasetsArray = new Array();

      $.each(data, function (key, dataobj) {
        for (var i = 0; i < dataobj.length; i++) {
          if (!isNullOrUndefined(dataobj[i].data.data)) {
            if (dataobj[i].data.data[0].data == null) {
              continue;
            }

            var timeArray = new Array();

            for (var j = 0; j < dataobj[i].data.data[0].data.length; j++) {
              var date = new Date(dataobj[i].data.data[0].data[j].time * 1000);
              var year = date.getFullYear();
              var month = date.getMonth() + 1;
              var day = date.getDay();
              var hour = date.getHours();
              var min = date.getMinutes();
              var sec = date.getSeconds();
              var retVal = (month < 10 ? "0" + month : month) + "/"
                + (day < 10 ? "0" + day : day) + " "
                + (hour < 10 ? "0" + hour : hour) + ":"
                + (min < 10 ? "0" + min : min);

              // var retVal =   year + "-" + (month < 10 ? "0" + month : month) + "-"
              //   + (day < 10 ? "0" + day : day) + " "
              //   + (hour < 10 ? "0" + hour : hour) + ":"
              //   + (min < 10 ? "0" + min : min) + ":"
              //   + (sec < 10 ? "0" + sec : sec);

              timeArray[j] = dataobj[i].data.data[0].data[j].time;
            }

            if (levelsArray.length == 0) {
              levelsArray = timeArray;
            } else {
              if (levelsArray.length > timeArray.length) {

              } else if (levelsArray.length < timeArray.length) {
                levelsArray = new Array();
                levelsArray = timeArray;
              }
            }
          }
        }
      });

      for (var k = 0; k < levelsArray.length; k++) {
        levelsObj[levelsArray[k]] = "";

        var date = new Date(levelsArray[k] * 1000);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDay();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        var retVal = (month < 10 ? "0" + month : month) + "/"
          + (day < 10 ? "0" + day : day) + " "
          + (hour < 10 ? "0" + hour : hour) + ":"
          + (min < 10 ? "0" + min : min);

        levelsArray2[k] = retVal;
      }

      $.each(data, function (key, dataobj) {
        for (var i = 0; i < dataobj.length; i++) {
          if (!isNullOrUndefined(dataobj[i].data.data)) {
            if (dataobj[i].data.data[0].data == null) {
              continue;
            }


            var keyValueObject = new Object;
            keyValueObject = levelsObj;
            var valueArray = new Array();
            var valueObject = new Object();

            for (var j = 0; j < dataobj[i].data.data[0].data.length; j++) {
              keyValueObject[dataobj[i].data.data[0].data[j].time] = dataobj[i].data.data[0].data[j].value;
            }

            var k = 0;
            $.each(keyValueObject, function (key2, dataobj2) {
              valueArray[k] = keyValueObject[key2];
              k++;
            });

            var color = ["#d7dee6", "#64afab", "#608848", "#4ca914", "#ce5e8c", "#fb0d6f", "#53b16c", "#d109f3", "#d2afd8", "#6b0a55"];

            valueObject["label"] = "Cpu_" + i;
            valueObject["data"] = valueArray;
            valueObject["lineTension"] = 0;
            valueObject["fill"] = false;
            valueObject["borderWidth"] = 0;
            valueObject["borderColor"] = color[i];
            valueObject["backgroundColor"] = color[i];
            valueObject["pointBorderColor"] = color[i];
            valueObject["pointBackgroundColor"] = color[i];
            valueObject["pointRadius"] = 0;
            valueObject["pointHoverRadius"] = 5;
            valueObject["pointHitRadius"] = 10;
            valueObject["pointBorderWidth"] = 0;
            valueObject["pointStyle"] = "rectRounded";

            if (sltChartInstancesValue == "All") {
              valueObject["hidden"] = false;
            } else {
              if (dataobj[i].name == Number(sltChartInstancesValue)) {
                valueObject["hidden"] = false;
              } else {
                valueObject["hidden"] = true;
              }
            }

            datasetsArray[i] = valueObject;

          }
        }
      });

      if (levelsArray2.length == 0)
        levelsArray2 = ["0", "1"];

      if (datasetsArray.length == 0)
        datasetsArray = [{
          label: "0",
          data: [0, 0],
          lineTension: 0,
          fill: false,
          borderWidth: 0,
          backgroundColor: '#d7dee6',
          pointBorderColor: '#d7dee6',
          pointBackgroundColor: '#d7dee6',
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHitRadius: 10,
          pointBorderWidth: 0,
          pointStyle: 'rectRounded'
        }];

      var speedData = null;
      speedData = {
        labels: levelsArray2,
        datasets: datasetsArray
      };
      var chartOptions = {
        legend: {
          display: true,
          position: 'top',
          labels: {
            boxWidth: 60,
            boxHeight: 4,
            fontColor: '#cfd2d7'
          }
        },
        responsive: true,
        maintainAspectRatio: false
      };
      var lineChart = null;
      lineChart = new Chart(speedCanvas, {
        type: 'line',
        data: speedData,
        options: chartOptions
      });

    });

  }

  getMemoryChart() {
    if (!appConfig.monitoring) {
      return;
    }
    var speedCanvas2 = document.getElementById("speedChart2");

    Chart.defaults.global.defaultFontFamily = "gulim";
    Chart.defaults.global.defaultFontSize = 12;

    var guid = this.appGuid;
    var idx = String(this.appSummaryInstance);
    var defaultTimeRange = String(this.sltChartDefaultTimeRange) + "m";
    var groupBy = String(this.sltChartGroupBy) + "s";
    var type = $("#selectBoxChartInstance").val();
    var sltChartInstancesValue = this.sltChartInstances;

    this.appMainService.getMemoryUsage(guid, idx, defaultTimeRange, groupBy, type).subscribe(data => {
      var levelsArray = new Array();
      var levelsArray2 = new Array();
      var levelsObj = new Object();
      var datasetsArray = new Array();

      $.each(data, function (key, dataobj) {
        for (var i = 0; i < dataobj.length; i++) {
          if (!isNullOrUndefined(dataobj[i].data.data)) {
            if (dataobj[i].data.data[0].data == null) {
              continue;
            }


            var timeArray = new Array();

            for (var j = 0; j < dataobj[i].data.data[0].data.length; j++) {
              var date = new Date(dataobj[i].data.data[0].data[j].time * 1000);
              var year = date.getFullYear();
              var month = date.getMonth() + 1;
              var day = date.getDay();
              var hour = date.getHours();
              var min = date.getMinutes();
              var sec = date.getSeconds();
              var retVal = (month < 10 ? "0" + month : month) + "/"
                + (day < 10 ? "0" + day : day) + " "
                + (hour < 10 ? "0" + hour : hour) + ":"
                + (min < 10 ? "0" + min : min);

              timeArray[j] = dataobj[i].data.data[0].data[j].time;
            }

            if (levelsArray.length == 0) {
              levelsArray = timeArray;
            } else {
              if (levelsArray.length > timeArray.length) {

              } else if (levelsArray.length < timeArray.length) {
                levelsArray = new Array();
                levelsArray = timeArray;
              }
            }
          }
        }
      });

      for (var k = 0; k < levelsArray.length; k++) {
        levelsObj[levelsArray[k]] = "";

        var date = new Date(levelsArray[k] * 1000);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDay();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        var retVal = (month < 10 ? "0" + month : month) + "/"
          + (day < 10 ? "0" + day : day) + " "
          + (hour < 10 ? "0" + hour : hour) + ":"
          + (min < 10 ? "0" + min : min);

        levelsArray2[k] = retVal;
      }

      $.each(data, function (key, dataobj) {
        for (var i = 0; i < dataobj.length; i++) {
          if (!isNullOrUndefined(dataobj[i].data.data)) {
            if (dataobj[i].data.data[0].data == null) {
              continue;
            }


            var keyValueObject = new Object;
            keyValueObject = levelsObj;
            var valueArray = new Array();
            var valueObject = new Object();

            for (var j = 0; j < dataobj[i].data.data[0].data.length; j++) {
              keyValueObject[dataobj[i].data.data[0].data[j].time] = dataobj[i].data.data[0].data[j].value;
            }

            var k = 0;
            $.each(keyValueObject, function (key2, dataobj2) {
              valueArray[k] = keyValueObject[key2];
              k++;
            });

            var color = ["#d7dee6", "#64afab", "#608848", "#4ca914", "#ce5e8c", "#fb0d6f", "#53b16c", "#d109f3", "#d2afd8", "#6b0a55"];

            valueObject["label"] = "Memory_" + i;
            valueObject["data"] = valueArray;
            valueObject["lineTension"] = 0;
            valueObject["fill"] = false;
            valueObject["borderWidth"] = 0;
            valueObject["borderColor"] = color[i];
            valueObject["backgroundColor"] = color[i];
            valueObject["pointBorderColor"] = color[i];
            valueObject["pointBackgroundColor"] = color[i];
            valueObject["pointRadius"] = 0;
            valueObject["pointHoverRadius"] = 5;
            valueObject["pointHitRadius"] = 10;
            valueObject["pointBorderWidth"] = 0;
            valueObject["pointStyle"] = "rectRounded";

            if (sltChartInstancesValue == "All") {
              valueObject["hidden"] = false;
            } else {
              if (dataobj[i].name == Number(sltChartInstancesValue)) {
                valueObject["hidden"] = false;
              } else {
                valueObject["hidden"] = true;
              }
            }

            datasetsArray[i] = valueObject;

          }
        }
      });

      if (levelsArray2.length == 0)
        levelsArray2 = ["0", "1"];

      if (datasetsArray.length == 0)
        datasetsArray = [{
          label: "0",
          data: [0, 0],
          lineTension: 0,
          fill: false,
          borderWidth: 0,
          backgroundColor: '#d7dee6',
          pointBorderColor: '#d7dee6',
          pointBackgroundColor: '#d7dee6',
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHitRadius: 10,
          pointBorderWidth: 0,
          pointStyle: 'rectRounded'
        }];

      var speedData = null;
      speedData = {
        labels: levelsArray2,
        datasets: datasetsArray
      };
      var chartOptions = {
        legend: {
          display: true,
          position: 'top',
          labels: {
            boxWidth: 60,
            boxHeight: 4,
            fontColor: '#cfd2d7'
          }
        },
        responsive: true,
        maintainAspectRatio: false
      };
      var lineChart = null;
      lineChart = new Chart(speedCanvas2, {
        type: 'line',
        data: speedData,
        options: chartOptions
      });

    });

  }

  getNetworkByte() {
    if (!appConfig.monitoring) {
      return;
    }
    var speedCanvas3 = document.getElementById("speedChart3");

    Chart.defaults.global.defaultFontFamily = "gulim";
    Chart.defaults.global.defaultFontSize = 12;

    var guid = this.appGuid;
    var idx = String(this.appSummaryInstance);
    var defaultTimeRange = String(this.sltChartDefaultTimeRange) + "m";
    var groupBy = String(this.sltChartGroupBy) + "s";
    var type = $("#selectBoxChartInstance").val();
    var sltChartInstancesValue = this.sltChartInstances;

    this.appMainService.getNetworkByte(guid, idx, defaultTimeRange, groupBy, type).subscribe(data => {
      var levelsArray = new Array();
      var levelsArray2 = new Array();
      var levelsObj = new Object();
      var datasetsArray = new Array();

      $.each(data, function (key, dataobj) {
        for (var i = 0; i < dataobj.length; i++) {
          if (!isNullOrUndefined(dataobj[i].data.data)) {
            if (dataobj[i].data.data[0].data == null) {
              continue;
            }


            var timeArray = new Array();

            for (var j = 0; j < dataobj[i].data.data[0].data.length; j++) {
              var date = new Date(dataobj[i].data.data[0].data[j].time * 1000);
              var year = date.getFullYear();
              var month = date.getMonth() + 1;
              var day = date.getDay();
              var hour = date.getHours();
              var min = date.getMinutes();
              var sec = date.getSeconds();
              var retVal = (month < 10 ? "0" + month : month) + "/"
                + (day < 10 ? "0" + day : day) + " "
                + (hour < 10 ? "0" + hour : hour) + ":"
                + (min < 10 ? "0" + min : min);

              timeArray[j] = dataobj[i].data.data[0].data[j].time;
            }

            if (levelsArray.length == 0) {
              levelsArray = timeArray;
            } else {
              if (levelsArray.length > timeArray.length) {

              } else if (levelsArray.length < timeArray.length) {
                levelsArray = new Array();
                levelsArray = timeArray;
              }
            }
          }
        }
      });

      for (var k = 0; k < levelsArray.length; k++) {
        levelsObj[levelsArray[k]] = "";

        var date = new Date(levelsArray[k] * 1000);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDay();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        var retVal = (month < 10 ? "0" + month : month) + "/"
          + (day < 10 ? "0" + day : day) + " "
          + (hour < 10 ? "0" + hour : hour) + ":"
          + (min < 10 ? "0" + min : min);

        levelsArray2[k] = retVal;
      }

      $.each(data, function (key, dataobj) {
        for (var i = 0; i < dataobj.length; i++) {
          if (!isNullOrUndefined(dataobj[i].data.data)) {
            if (dataobj[i].data.data[0].data == null) {
              continue;
            }

            var keyValueObject = new Object;
            keyValueObject = levelsObj;
            var valueArray = new Array();
            var valueObject = new Object();

            for (var j = 0; j < dataobj[i].data.data[0].data.length; j++) {
              keyValueObject[dataobj[i].data.data[0].data[j].time] = dataobj[i].data.data[0].data[j].value;
            }

            var k = 0;
            $.each(keyValueObject, function (key2, dataobj2) {
              valueArray[k] = keyValueObject[key2];
              k++;
            });

            var color = ["#d7dee6", "#64afab", "#608848", "#4ca914", "#ce5e8c", "#fb0d6f", "#53b16c", "#d109f3", "#d2afd8", "#6b0a55"];

            valueObject["label"] = "Network_" + i;
            valueObject["data"] = valueArray;
            valueObject["lineTension"] = 0;
            valueObject["fill"] = false;
            valueObject["borderWidth"] = 0;
            valueObject["borderColor"] = color[i];
            valueObject["backgroundColor"] = color[i];
            valueObject["pointBorderColor"] = color[i];
            valueObject["pointBackgroundColor"] = color[i];
            valueObject["pointRadius"] = 0;
            valueObject["pointHoverRadius"] = 5;
            valueObject["pointHitRadius"] = 10;
            valueObject["pointBorderWidth"] = 0;
            valueObject["pointStyle"] = "rectRounded";

            if (sltChartInstancesValue == "All") {
              valueObject["hidden"] = false;
            } else {
              if (dataobj[i].name == Number(sltChartInstancesValue)) {
                valueObject["hidden"] = false;
              } else {
                valueObject["hidden"] = true;
              }
            }

            datasetsArray[i] = valueObject;

          }
        }
      });

      if (levelsArray2.length == 0)
        levelsArray2 = ["0", "1"];

      if (datasetsArray.length == 0)
        datasetsArray = [{
          label: "0",
          data: [0, 0],
          lineTension: 0,
          fill: false,
          borderWidth: 0,
          backgroundColor: '#d7dee6',
          pointBorderColor: '#d7dee6',
          pointBackgroundColor: '#d7dee6',
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHitRadius: 10,
          pointBorderWidth: 0,
          pointStyle: 'rectRounded'
        }];

      var speedData = null;
      speedData = {
        labels: levelsArray2,
        datasets: datasetsArray
      };
      var chartOptions = {
        legend: {
          display: true,
          position: 'top',
          labels: {
            boxWidth: 60,
            boxHeight: 4,
            fontColor: '#cfd2d7'
          }
        },
        responsive: true,
        maintainAspectRatio: false
      };
      var lineChart = null;
      lineChart = new Chart(speedCanvas3, {
        type: 'line',
        data: speedData,
        options: chartOptions
      });

    });
  }

  selectBoxChartInstanceChange(instance: string) {
    this.sltChartInstances = instance;
    this.getCpuChart();
    this.getMemoryChart();
    this.getNetworkByte();
  }

  chartTimeClick(defaultTimeRange: number, groupBy: number) {
    this.sltChartDefaultTimeRange = defaultTimeRange;
    this.sltChartGroupBy = groupBy;
    this.getCpuChart();
    this.getMemoryChart();
    this.getNetworkByte();
  }

  refreshClick() {
    this.ngOnInit();
  }

  showWindowTailLogs() {
    window.open('/tailLogs?name=' + this.appName + '&org=' + this.orgName + '&space=' + this.spaceName + '&guid=' + this.appGuid + '', '_blank', 'location=no, directories=no width=1000, height=700');
  }

  InitLaaSView() {
    this.appMainService.getCodeMax('LAAS').subscribe(data => {
      data.list.some(r => {
        if (r.key === 'laas_base_url') {
          this.sltLaaSView = r.useYn == 'Y' ? true : false;
          this.sltLaaSUrl = r.value;
          return true;
        }
      });
    });
  }

  showWindowLaaS() {
    window.open(this.sltLaaSUrl + '/' + this.appGuid, '_blank', 'location=no, directories=no width=1000, height=700');
  }

  showWindowAppLink(urlLink: string) {
    window.open('http://' + urlLink + '', 'aaa');
  }

  getWindowAppLink(urlLink: string): string {
    return 'http://' + urlLink + '';
  }

}
