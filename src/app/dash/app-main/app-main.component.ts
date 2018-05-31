import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppMainService } from './app-main.service';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from "../../common/common.service";


declare var Chart: any;
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-app-main',
  templateUrl: './app-main.component.html',
  styleUrls: ['./app-main.component.css'],
})
export class AppMainComponent implements OnInit {

  public orgName: string;
  public orgGuid: string;
  public spaceName: string;
  public spaceGuid: string;
  public appName: string;
  public appGuid: string;
  private isLoading: boolean = false;

  public translateEntities: any = [];

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
  public appAlarmsEntities: Observable<any[]>;
  public appAlaramEntities: Observable<any[]>;
  public appAutoscalingEntities: Observable<any[]>;

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
  private appSummaryMemoryMax: number;
  private appSummaryMemory: number;
  private appSummaryDiskMax: number;
  private appSummaryDisk: number;

  private appStatsCpuPer: number;
  private appStatsMemoryPer: number;
  private appStatsDiskPer: number;

  private appSystemProvidedEnv: string;

  private appRecentLogs: string;

  private tabContentEventListLimit: number;
  private tabContentStatsListLimit: number;

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


  constructor(private route: ActivatedRoute, private router: Router, private translate: TranslateService, private appMainService: AppMainService, private common: CommonService) {
    this.common.isLoading = false;

    // translate.setDefaultLang('ko');
    //
    // translate.use('ko');
  }

  ngOnInit() {
    console.log("ngOnInit in~");
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

    this.appSummaryMemoryMax = 10;
    this.appSummaryDiskMax = 10;
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

    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length > 0) {
        setTimeout(() => this.showLoading(), 0);

        this.orgName = params['org_name'];
        this.orgGuid = params['org_guid'];
        this.spaceName = params['space_name'];
        this.spaceGuid = params['space_guid'];
        this.appName = params['app_name'];
        this.appGuid = params['app_guid'];

        this.getAppSummary(params['app_guid']);

        this.getAppEvents(params['app_guid']);
        this.getAppEnv(params['app_guid']);
        this.getAppRecentLogs(params['app_guid']);
        this.getAlarms(params['app_guid']);
        this.getAlarm(params['app_guid']);
        this.getAutoscaling(params['app_guid']);
      } else {
        setTimeout(() => this.showLoading(), 0);
        this.router.navigate(['dashMain']);

        // this.appGuid = "80dd102d-8068-4997-b518-c3f04bcdd00f";
        // this.getAppSummary("80dd102d-8068-4997-b518-c3f04bcdd00f");
        //
        // this.getAppEvents("80dd102d-8068-4997-b518-c3f04bcdd00f");
        // this.getAppEnv("80dd102d-8068-4997-b518-c3f04bcdd00f");
        // this.getAppRecentLogs("80dd102d-8068-4997-b518-c3f04bcdd00f");
        // this.getAlarms("80dd102d-8068-4997-b518-c3f04bcdd00f");
        // this.getAlarm("80dd102d-8068-4997-b518-c3f04bcdd00f");
        // this.getAutoscaling("80dd102d-8068-4997-b518-c3f04bcdd00f");
      }

      this.translate.get('appMain').subscribe(data => {
        this.translateEntities = data;
      });
    });
  }

  showLoading() {
    this.common.isLoading = true;
  }

  getAppSummary(guid: string) {
    this.isLoading = true;
    this.appMainService.getAppSummary(guid).subscribe(data => {
      this.appSummaryEntities = data;
      this.appRoutesEntities = data.routes;
      this.appDomainsEntities = data.available_domains;
      this.appServicesEntities = data.services;

      this.appSummarySpaceGuid = data.space_guid;

      this.appSummaryName = data.name;
      this.appSummaryGuid = data.guid;
      this.appSummaryState = data.state;
      if(data.routes.length > 0) {
        this.appSummaryRouteUri = data.routes[0].host + "." + data.routes[0].domain.name;
      }
      if(data.package_updated_at != null) {
        this.appSummaryPackageUpdatedAt = data.package_updated_at.replace('T', '  ').replace('Z', ' ');
      }

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

      if(this.appSummaryState == "STARTED") {
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

  getSpaceSummary() {
    this.appMainService.getSpaceSummary(this.appSummarySpaceGuid).subscribe(data => {
      var servicepacks = this.servicepacksEntities;
      var servicepacksRe = [];
      var useServices = this.appServicesEntities;

      $.each(data.services, function (key, dataobj) {
        $.each(servicepacks, function (key2, dataobj2) {
          if((dataobj.service_plan.service.label == dataobj2.servicePackName) && (dataobj2.appBindYn == "Y")) {

            if(JSON.stringify(useServices).indexOf("\"name\":\""+dataobj.name+"\"") < 0) {
              var obj = {
                name: dataobj.name,
                guid: dataobj.guid,
                label: dataobj.service_plan.service.label,
                appBindParameter: dataobj2.appBindParameter
              };
              servicepacksRe.push(obj);
            } else {
            }

          }
        });
      });
      this.servicepacksEntitiesRe = servicepacksRe;
    });
  }

  getServicepacks() {
    this.appMainService.getServicepacks().subscribe(data => {
      this.servicepacksEntities = data.list;

      this.getSpaceSummary();
    });
  }

  // getServicesInstances() {
  //   this.appMainService.getServicesInstances(this.appSummarySpaceGuid).subscribe(data => {
  //
  //   });
  // }

  getAppStats(guid: string) {
    this.appMainService.getAppStats(guid).subscribe(data => {
      if (data) {
        this.appStatsEntities = data.instances;

        var cpu = 0;
        var mem = 0;
        var disk = 0;
        var cnt = 0;

        $.each(data.instances, function (key, dataobj) {
          if(dataobj.stats != null) {
            if (!(null == dataobj.stats.usage.cpu || '' == dataobj.stats.usage.cpu)) cpu = cpu + dataobj.stats.usage.cpu * 100;
            if (!(null == dataobj.stats.usage.mem || '' == dataobj.stats.usage.mem)) mem = mem + dataobj.stats.usage.mem / dataobj.stats.mem_quota * 100;
            if (!(null == dataobj.stats.usage.disk || '' == dataobj.stats.usage.disk)) disk = disk + dataobj.stats.usage.disk / dataobj.stats.disk_quota * 100;
            cnt++;
          }
        });

        this.appStatsCpuPer = Number((cpu / cnt).toFixed(2));
        this.appStatsMemoryPer = Math.round(mem / cnt);
        this.appStatsDiskPer = Math.round(disk / cnt);

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

      if(statusText == "DOWN") {
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
      var e = Math.floor(Math.log(memoryBytes)/Math.log(1024));
      if(e === Number.NEGATIVE_INFINITY){
        memory = "0 "+s[0];
      } else {
        memory = (memoryBytes/Math.pow(1024, Math.floor(e))).toFixed(2)+" "+s[e];
      }

      var diskBytes = parseInt(disk);
      var s = ['Byets', 'KB', 'MB', 'GB', 'TB', 'PB'];
      var e = Math.floor(Math.log(diskBytes)/Math.log(1024));
      if(e === Number.NEGATIVE_INFINITY){
        disk = "0 "+s[0];
      } else {
        disk = (diskBytes/Math.pow(1024, Math.floor(e))).toFixed(2)+" "+s[e];
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
    let params = {
      guid: this.appSummaryGuid,
      orgName: this.orgName,
      spaceName: this.spaceName,
      name: this.appName
    };
    this.appMainService.startApp(params).subscribe(data => {
      this.ngOnInit();
    });
  }

  showPopAppStopClick() {
    $("#layerpop_app_stop").modal("show");
  }

  stopAppClick() {
    let params = {
      guid: this.appSummaryGuid
    };
    this.appMainService.stopApp(params).subscribe(data => {
      this.ngOnInit();
    });
  }

  showPopAppRestageClick() {
    $("#layerpop_app_restart").modal("show");
  }

  restageAppClick() {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    let params = {
      guid: this.appSummaryGuid
    };
    this.appMainService.restageApp(params).subscribe(data => {
      //TODO 재시작 후 시간 텀을주어 init 할 것인가??
      if(data) {
        this.ngOnInit();

        this.common.isLoading = false;
        $(".alertLayer .in").text(this.translateEntities.alertLayer.appRestartSuccess);
        $(".alertLayer").addClass("moveAlert");
      } else {
        this.common.isLoading = false;
        $(".alertLayer .in").text(this.translateEntities.alertLayer.appRestartFail);
        $(".alertLayer").addClass("moveAlert");
      }
    });
  }

  instanceUpClick() {
    if(this.appSummaryInstanceMax >= (Number(this.appSummaryInstance) + 1)) {
      this.appSummaryInstance = Number(this.appSummaryInstance) + 1;
      $("#instance_in").val(this.appSummaryInstance);
    }
  }

  instanceDownClick() {
    if(1 <= (Number(this.appSummaryInstance) - 1)) {
      this.appSummaryInstance = Number(this.appSummaryInstance) - 1;
      $("#instance_in").val(this.appSummaryInstance);
    }
  }

  instanceDirectInputClick() {
    if($("#instanceS2").css("display") == "none") {
      this.appSummaryInstance = $("#instance_in").val();
      $("#instanceS1").hide();
      $("#instanceS2").show();
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
    if((this.appSummaryMemoryMax*1024) >= (Number(this.appSummaryMemory) + 1024)) {
      this.appSummaryMemory = Number(this.appSummaryMemory) + 1024;
      $("#mem_in").val(this.appSummaryMemory);
    }
  }

  memDownClick() {
    if(1 <= (Number(this.appSummaryMemory) - 1024)) {
      this.appSummaryMemory = Number(this.appSummaryMemory) - 1024;
      $("#mem_in").val(this.appSummaryMemory);
    }
  }

  memDirectInputClick() {
    if($("#memS2").css("display") == "none") {
      this.appSummaryMemory = $("#mem_in").val();
      $("#memS1").hide();
      $("#memS2").show();
    } else {
      this.appSummaryMemory = $("#mem_in").val();
      $("#memS2").hide();
      $("#memS1").show();
    }
  }

  showPopMemSaveClick() {
    $("#layerpop_app_save").modal("show");
  }

  diskUpClick() {
    if((this.appSummaryDiskMax*1024) >= (Number(this.appSummaryDisk) + 1024)) {
      this.appSummaryDisk = Number(this.appSummaryDisk) + 1024;
      $("#disk_in").val(this.appSummaryDisk);
    }
  }

  diskDownClick() {
    if(1 <= (Number(this.appSummaryDisk) - 1024)) {
      this.appSummaryDisk = Number(this.appSummaryDisk) - 1024;
      $("#disk_in").val(this.appSummaryDisk);
    }
  }

  diskDirectInputClick() {
    if($("#diskS2").css("display") == "none") {
      this.appSummaryDisk = $("#disk_in").val();
      $("#diskS1").hide();
      $("#diskS2").show();
    } else {
      this.appSummaryDisk = $("#disk_in").val();
      $("#diskS2").hide();
      $("#diskS1").show();
    }
  }

  showPopDiskSaveClick() {
    $("#layerpop_app_save").modal("show");
  }

  appSaveClick() {
    $("[id^='layerpop']").modal("hide");
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
    $(this).parents("tr").addClass("off");
  }

  showPopRenameSaveClick() {
    $("#layerpop_app_save").modal("show");
  }

  showPopAppDelClick() {
    $("#layerpop_app_del").modal("show");
  }

  appDelClick() {
    this.appMainService.delApp(this.appGuid).subscribe(data => {
      this.router.navigate(['dashMain']);
    });
  }

  // 앱 수정사항 저장
  updateApp() {
    var instancesChange = 0;
    var memoryChange = 0;
    var diskChange = 0;
    var name = "";

    if($("#instanceS2").css("display") == "inline") {
      instancesChange = $("#instance_in").val();
    } else {
      instancesChange = this.appSummaryInstance;
    }

    if($("#memS2").css("display") == "inline") {
      memoryChange = $("#mem_in").val();
    } else {
      memoryChange = this.appSummaryMemory;
    }

    if($("#diskS2").css("display") == "inline") {
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
      if(data) {
        this.ngOnInit();

        $(".headT,.headT2").css("display","none");

        $("#instanceS2").hide();
        $("#instanceS1").show();

        $("#memS2").hide();
        $("#memS1").show();

        $("#diskS2").hide();
        $("#diskS1").show();

        this.common.isLoading = false;
        $(".alertLayer .in").text(this.translateEntities.alertLayer.appUpdateSuccess);
        $(".alertLayer").addClass("moveAlert");
      } else {
        this.common.isLoading = false;
        $(".alertLayer .in").text(this.translateEntities.alertLayer.appUpdateFail);
        $(".alertLayer").addClass("moveAlert");
      }
    });
  }

  updateAppEnv(type, index) {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    var updateEnvironment = {};
    var appEnvName = "";
    var appEnvValue = "";

    if (type == "add") {
      for (var i = 0; i < $("[id^='envEditId']").size(); i++) {
        appEnvName = $("#envEditId" + i).val();
        appEnvValue = $("#envEditData" + i).val();
        updateEnvironment[appEnvName] = appEnvValue;
      }
      appEnvName = $("#envAddId").val();
      appEnvValue = $("#envAddData").val();
      updateEnvironment[appEnvName] = appEnvValue;
    } else if (type == "modify") {
      for (var i = 0; i < $("[id^='envEditId']").size(); i++) {
        appEnvName = $("#envEditId" + i).val();
        appEnvValue = $("#envEditData" + i).val();
        updateEnvironment[appEnvName] = appEnvValue;
      }
    } else if (type == "delete") {
      for (var i = 0; i < $("[id^='envEditId']").size(); i++) {
        appEnvName = $("#envEditId" + i).val();
        appEnvValue = $("#envEditData" + i).val();
        updateEnvironment[appEnvName] = appEnvValue;
      }

      appEnvName = this.sltEnvDelName;
      delete updateEnvironment[appEnvName];
    }

    let params = {
      guid: this.appSummaryGuid,
      environment: updateEnvironment

    };
    this.appMainService.updateApp(params).subscribe(data => {
      if(data) {
        this.ngOnInit();

        $("#add_env").hide();
        this.showPopAppRestageClick();

        this.common.isLoading = false;
        $(".alertLayer .in").text(this.translateEntities.alertLayer.envAddSuccess);
        $(".alertLayer").addClass("moveAlert");
      } else {
        this.common.isLoading = false;
        $(".alertLayer .in").text(this.translateEntities.alertLayer.envAddFail);
        $(".alertLayer").addClass("moveAlert");
      }
    });
  }

  getAppEvents(guid: string) {
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
      });
      this.appEventsEntitiesRe = appEvents;
    });
  }

  getAppEnv(guid: string) {
    this.appMainService.getAppEnv(guid).subscribe(data => {
      this.appEnvEntities = data;

      this.appSystemProvidedEnv = JSON.stringify(data, undefined, 2);

      if (JSON.stringify(data.environment_json) == "{}") {
        //document.getElementById("noEnvMsg").style = ""
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
      }

      if (JSON.stringify(data.system_env_json) != "{}") {
        this.appEnvSystemEntities = data.system_env_json.VCAP_SERVICES;
      }
    });
  }

  getAppRecentLogs(guid: string) {
    this.appMainService.getAppRecentLogs(guid).subscribe(data => {
      var str = "";
      $.each(data.log, function (key, dataobj) {
        str += dataobj.logMessage.message + '<br>';
      });
      this.appRecentLogs = str;

      // TODO 마지막??
      this.common.isLoading = false;
    });
  }

  getAlarms(guid: string) {
    //TODO 임시
    guid = "9dac6e76-37cf-484f-8ebe-bdbaf99943e6";

    this.appMainService.getAlarms(guid, this.sltAlaramPageItems, this.sltAlaramPageIndex, this.sltAlaramResourceType, this.sltAlaramAlarmLevel).subscribe(data => {
      this.appAlarmsEntities = data.data;
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

  getAlarm(guid: string) {
    //TODO 임시
    guid = "9dac6e76-37cf-484f-8ebe-bdbaf99943e6";

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

      if(this.appAlarmEmailSendYn == "Y") {
        $("#switch12").attr("checked", true);
      } else {
        $("#switch12").attr("checked", false);
      }

      if(this.appAlarmAlarmUseYn == "Y") {
        $("#switch13").attr("checked", true);
      } else {
        $("#switch13").attr("checked", false);
      }
    });
  }

  showPopAlarmEditClick() {
    if($('#appAlarmEmail').css("color") == "rgb(255, 0, 0)") {
      alert("Email 형식이 잘못 되었습니다.");
      return false;
    }

    $("#layerpop_alarm_edit").modal("show");
  }

  editAlarmClick() {
    if($("#switch12").is(":checked") == true) {
      this.appAlarmEmailSendYn = "Y";
    } else {
      this.appAlarmEmailSendYn = "N";
    }

    if($("#switch13").is(":checked") == true) {
      this.appAlarmAlarmUseYn = "Y";
    } else {
      this.appAlarmAlarmUseYn = "N";
    }

    let params = {
      // TODO 하드코딩
      // appGuid: this.appSummaryGuid,
      appGuid: "9dac6e76-37cf-484f-8ebe-bdbaf99943e6",
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
      if(data) {
        if(data.status == "success") {
          this.ngOnInit();
          $("[id^='layerpop']").modal("hide");
        } else {
          $("[id^='layerpop']").modal("hide");
          alert("error");
        }
      } else {
        $("[id^='layerpop']").modal("hide");
        alert("error");
      }
    });
  }

  getAutoscaling(guid: string) {
    // TODO 임시
    guid = "2d35e19c-f223-49a3-b4b5-da2c55969f07";

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

      if(this.appAutoscalingOutYn == "Y") {
        $("#switch10").attr("checked", true);
      } else {
        $("#switch10").attr("checked", false);
      }

      if(this.appAutoscalingInYn == "Y") {
        $("#switch11").attr("checked", true);
      } else {
        $("#switch11").attr("checked", false);
      }
    });
  }

  showPopAutoscalingEditClick() {
    $("#layerpop_autoscaling_edit").modal("show");
  }

  editAutoscalingClick() {
    if($("#switch10").is(":checked") == true) {
      this.appAutoscalingOutYn = "Y";
    } else {
      this.appAutoscalingOutYn = "N";
    }

    if($("#switch11").is(":checked") == true) {
      this.appAutoscalingInYn = "Y";
    } else {
      this.appAutoscalingInYn = "N";
    }

    let params = {
      // TODO 하드코딩
      // appGuid: this.appSummaryGuid,
      appGuid: "2d35e19c-f223-49a3-b4b5-da2c55969f07",
      autoScalingInYn: this.appAutoscalingInYn,
      autoScalingOutYn: this.appAutoscalingOutYn,
      cpuMaxThreshold: Number($("#appAutoscalingCpuMaxThreshold").val()),
      cpuMinThreshold: Number($("#appAutoscalingCpuMinThreshold").val()),
      instanceMaxCnt: Number($("#appAutoscalingInstanceMaxCnt").val()),
      instanceMinCnt: Number($("#appAutoscalingInstanceMinCnt").val()),
      instanceVariationUnit: this.appAutoscalingInstanceVariationUnit,
      measureTimeSec: Number($("#appAutoscalingMeasureTimeSec").val()),
      memoryMaxThreshold: Number($("#appAutoscalingMemoryMaxThreshold").val()),
      memoryMinThreshold: Number($("#appAutoscalingMemoryMinThreshold").val())
    };

    this.appMainService.updateAutoscaling(params).subscribe(data => {
      if(data) {
        if(data.status == "success") {
          this.ngOnInit();
          $("[id^='layerpop']").modal("hide");
        } else {
          $("[id^='layerpop']").modal("hide");
          alert("error");
        }
      } else {
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
      if(data) {
        $(".lauth_dl").toggleClass("on");

        this.common.isLoading = false;
        $(".alertLayer .in").text(this.translateEntities.alertLayer.routeAddSuccess);
        $(".alertLayer").addClass("moveAlert");

        this.ngOnInit();
      } else {
        this.common.isLoading = false;
        $(".alertLayer .in").text(this.translateEntities.alertLayer.routeAddFail);
        $(".alertLayer").addClass("moveAlert");
      }
    });
  }

  delAppRoute() {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    let params = {};
    this.appMainService.delAppRoute(this.appGuid, this.sltRouteDelGuid, params).subscribe(data => {
      if(data) {
        this.common.isLoading = false;
        $(".alertLayer .in").text(this.translateEntities.alertLayer.routeDelSuccess);
        $(".alertLayer").addClass("moveAlert");

        this.ngOnInit();
      } else {
        this.common.isLoading = false;
        $(".alertLayer .in").text(this.translateEntities.alertLayer.routeDelFail);
        $(".alertLayer").addClass("moveAlert");
      }
    });
  }

  selectBoxServiceChange(val: string) {
     var appBindParam = [];

    $.each(this.servicepacksEntitiesRe, function (key, dataobj) {
      if(dataobj.guid == val) {
        var str = dataobj.appBindParameter.replace("}", "").replace("{", "");

        // 2. parameter 를 (,)기준으로 자른 다음 쌍따옴표 제거.
        var split = str.split(",");

        for (var i = 0; i < split.length; i++) {
          var deleteSign = split[i].replace(/"/g, "");

          // 3. : 을 기준으로 value 부분을 넣어주기로 한다.
          var splitSign = deleteSign.split(":");
          // 4. 들어오는 parameter 의 변수 타입에 따라 동적인 input box 생성.
          if (splitSign != null && splitSign != "undefined" && splitSign != "") {
            var type = splitSign[1];
            var value = "";
            if(type == "default") {
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
  }

  tabShowClick(id: string) {
    $('.nav_1d li').removeClass('cur');
    $("#nav_"+id).addClass('cur');

    $("[id^='tabContent_']").hide();
    $("#"+id).show();

    if(id == "tabContent_viewchart") {
      $("#"+id+"_1").show();
    }
  }

  tabShowViewchartClick(id: string) {
    $("[id^='tab_viewchart_']").hide();
    $("#"+id).show();

    if(id == "tab_viewchart_1") {
      $('.monitor_tabs li:nth-child(1)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_on');
      $('.monitor_tabs li:nth-child(2)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
      $('.monitor_tabs li:nth-child(3)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
    } else if(id == "tab_viewchart_2") {
      $('.monitor_tabs li:nth-child(1)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
      $('.monitor_tabs li:nth-child(2)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_on');
      $('.monitor_tabs li:nth-child(3)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
    } else if(id == "tab_viewchart_3") {
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

  showPopStatsResrtartClick(index: string) {
    this.sltStatsInstance = index;
    $("#layerpop_stats_restart").modal("show");
  }

  statsResrtartClick() {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    let params = {};
    this.appMainService.terminateInstance(this.appGuid, this.sltStatsInstance, params).subscribe(data => {
      if(data) {
        this.ngOnInit();

        this.common.isLoading = false;
        $(".alertLayer .in").text(this.translateEntities.alertLayer.instanceRestartSuccess);
        $(".alertLayer").addClass("moveAlert");
      } else {
        this.common.isLoading = false;
        $(".alertLayer .in").text(this.translateEntities.alertLayer.instanceRestartFail);
        $(".alertLayer").addClass("moveAlert");
      }
    });
  }

  showEditEnvClick(index: string) {
    $("#DLid" + index).show();
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
    if($("#selectBoxService").val() == "") {
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

    if($("input[id^='serviceParamKey_']").length > 0) {
      for (var i = 0; i < $("input[id^='serviceParamKey_']").length; i++) {
        var key = $("input[id^='serviceParamKey_']:eq("+i+")").val();
        var value = $("input[id^='serviceParamVal_']:eq("+i+")").val();

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
      if(data) {
        $(".service_dl").toggleClass("on");
        this.sltServiceParam = [];

        this.common.isLoading = false;
        $(".alertLayer .in").text(this.translateEntities.alertLayer.bindServiceSuccess);
        $(".alertLayer").addClass("moveAlert");

        this.ngOnInit();
      } else {
        this.common.isLoading = false;
        $(".alertLayer .in").text(this.translateEntities.alertLayer.bindServiceFail);
        $(".alertLayer").addClass("moveAlert");
      }
    });
  }

  showPopServiceCredentialsClick(name: string, label: string) {
    var hostname = "";
    var name2 = "";
    var password = "";
    var port = "";
    var uri = "";
    var username = "";

    var useSysEnvs = this.appEnvSystemEntities;
    $.each(useSysEnvs, function (key, dataobj) {
      if(key == label) {
        $.each(dataobj, function (key2, dataobj2) {
          if(dataobj2.name == name) {
            console.log(dataobj2.credentials);
            if(dataobj2.credentials.hostname != null) {
              hostname = dataobj2.credentials.hostname;
            }
            if(dataobj2.credentials.name != null) {
              name2 = dataobj2.credentials.name;
            }
            if(dataobj2.credentials.password != null) {
              password = dataobj2.credentials.password;
            }
            if(dataobj2.credentials.port != null) {
              port = dataobj2.credentials.port;
            }
            if(dataobj2.credentials.uri != null) {
              uri = dataobj2.credentials.uri;
            }
            if(dataobj2.credentials.username != null) {
              username = dataobj2.credentials.username;
            }
          }
        })
      }
    });

    this.appSltEnvSystemName = name;
    this.appSltEnvSystemLabel = label;

    this.appSltEnvSystemCredentialsHostname = hostname;
    this.appSltEnvSystemCredentialsName = name2;
    this.appSltEnvSystemCredentialsPassword = password;
    this.appSltEnvSystemCredentialsPort = port;
    this.appSltEnvSystemCredentialsUri = uri;
    this.appSltEnvSystemCredentialsUsername = username;

    $("#layerpop_service_credentials").modal("show");
  }

  showPopServiceUnbindClick(name: string, guid: string) {
    this.sltServiceUnbindName = name;
    this.sltServiceUnbindGuid = guid;
    $("#layerpop_service_unbind").modal("show");
  }

  unbindServiceClick() {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    let params = {};
    this.appMainService.unbindService(this.appGuid, this.sltServiceUnbindGuid, params).subscribe(data => {
      if(data) {
        this.ngOnInit();

        this.common.isLoading = false;
        $(".alertLayer .in").text(this.translateEntities.alertLayer.unbindServiceSuccess);
        $(".alertLayer").addClass("moveAlert");
      } else {
        this.common.isLoading = false;
        $(".alertLayer .in").text(this.translateEntities.alertLayer.unbindServiceFail);
        $(".alertLayer").addClass("moveAlert");
      }
    });
  }

  getCpuChart() {
    var speedCanvas = document.getElementById("speedChart");

    Chart.defaults.global.defaultFontFamily = "gulim";
    Chart.defaults.global.defaultFontSize = 12;

    // TODO 하드코딩
    var guid = "2d35e19c-f223-49a3-b4b5-da2c55969f07";
    var idx = String(this.appSummaryInstance);
    var defaultTimeRange = String(this.sltChartDefaultTimeRange) + "m";
    var groupBy = String(this.sltChartGroupBy) + "s";
    var type = "All";
    var sltChartInstancesValue = this.sltChartInstances;


    this.appMainService.getCpuUsage(guid, idx, defaultTimeRange, groupBy, type).subscribe(data => {
      var levelsArray = new Array();
      var levelsArray2 = new Array();
      var levelsObj = new Object();
      var datasetsArray = new Array();

      $.each(data, function (key, dataobj) {
        for(var i=0; i< dataobj.length; i++) {
          if(dataobj[i].data.data[0].data == null) {
            continue;
          }

          var timeArray = new Array();

          for(var j=0; j< dataobj[i].data.data[0].data.length; j++) {
            var date = new Date(dataobj[i].data.data[0].data[j].time * 1000);
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var day = date.getDay();
            var hour = date.getHours();
            var min = date.getMinutes();
            var sec = date.getSeconds();
            var retVal =   (month < 10 ? "0" + month : month) + "/"
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

          if(levelsArray.length == 0) {
            levelsArray = timeArray;
          } else {
            if(levelsArray.length > timeArray.length) {

            } else if(levelsArray.length < timeArray.length) {
              levelsArray = new Array();
              levelsArray = timeArray;
            }
          }
        }

      });

      for(var k=0; k< levelsArray.length; k++) {
        levelsObj[levelsArray[k]] = "";

        var date = new Date(levelsArray[k] * 1000);
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var day = date.getDay();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        var retVal =   (month < 10 ? "0" + month : month) + "/"
          + (day < 10 ? "0" + day : day) + " "
          + (hour < 10 ? "0" + hour : hour) + ":"
          + (min < 10 ? "0" + min : min);

        levelsArray2[k] = retVal;
      }

      $.each(data, function (key, dataobj) {
        for (var i = 0; i < dataobj.length; i++) {
          if (dataobj[i].data.data[0].data == null) {
            continue;
          }

          var keyValueObject = new Object;
          keyValueObject = levelsObj;
          var valueArray = new Array();
          var valueObject = new Object();

          for(var j=0; j< dataobj[i].data.data[0].data.length; j++) {
            keyValueObject[dataobj[i].data.data[0].data[j].time] = dataobj[i].data.data[0].data[j].value;
          }
          // console.log(keyValueObject);

          var k = 0;
          $.each(keyValueObject, function (key2, dataobj2) {
            valueArray[k] = keyValueObject[key2];
            k++;
          });

          var color = ["#d7dee6", "#64afab", "#608848", "#4ca914", "#ce5e8c", "#fb0d6f", "#53b16c", "#d109f3", "#d2afd8", "#6b0a55"];

          valueObject["label"] = "Cpu_"+i;
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

          if(sltChartInstancesValue == "All") {
            valueObject["hidden"] = false;
          } else {
            if(i == Number(sltChartInstancesValue)) {
              valueObject["hidden"] = false;
            } else {
              valueObject["hidden"] = true;
            }
          }

          datasetsArray[i] = valueObject;

          // console.log(datasetsArray);
        }
      });

      // console.log(levelsObj);

      var speedData = null;
      speedData = {
        labels: levelsArray2,
        datasets : datasetsArray
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
        }
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
    var speedCanvas2 = document.getElementById("speedChart2");

    Chart.defaults.global.defaultFontFamily = "gulim";
    Chart.defaults.global.defaultFontSize = 12;

    // TODO 하드코딩
    var guid = "2d35e19c-f223-49a3-b4b5-da2c55969f07";
    var idx = String(this.appSummaryInstance);
    var defaultTimeRange = String(this.sltChartDefaultTimeRange) + "m";
    var groupBy = String(this.sltChartGroupBy) + "s";
    var type = "All";
    var sltChartInstancesValue = this.sltChartInstances;


    this.appMainService.getMemoryUsage(guid, idx, defaultTimeRange, groupBy, type).subscribe(data => {
      var levelsArray = new Array();
      var levelsArray2 = new Array();
      var levelsObj = new Object();
      var datasetsArray = new Array();

      $.each(data, function (key, dataobj) {
        for(var i=0; i< dataobj.length; i++) {
          if(dataobj[i].data.data[0].data == null) {
            continue;
          }

          var timeArray = new Array();

          for(var j=0; j< dataobj[i].data.data[0].data.length; j++) {
            var date = new Date(dataobj[i].data.data[0].data[j].time * 1000);
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var day = date.getDay();
            var hour = date.getHours();
            var min = date.getMinutes();
            var sec = date.getSeconds();
            var retVal =   (month < 10 ? "0" + month : month) + "/"
              + (day < 10 ? "0" + day : day) + " "
              + (hour < 10 ? "0" + hour : hour) + ":"
              + (min < 10 ? "0" + min : min);

            timeArray[j] = dataobj[i].data.data[0].data[j].time;
          }

          if(levelsArray.length == 0) {
            levelsArray = timeArray;
          } else {
            if(levelsArray.length > timeArray.length) {

            } else if(levelsArray.length < timeArray.length) {
              levelsArray = new Array();
              levelsArray = timeArray;
            }
          }
        }

      });

      for(var k=0; k< levelsArray.length; k++) {
        levelsObj[levelsArray[k]] = "";

        var date = new Date(levelsArray[k] * 1000);
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var day = date.getDay();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        var retVal =   (month < 10 ? "0" + month : month) + "/"
          + (day < 10 ? "0" + day : day) + " "
          + (hour < 10 ? "0" + hour : hour) + ":"
          + (min < 10 ? "0" + min : min);

        levelsArray2[k] = retVal;
      }

      $.each(data, function (key, dataobj) {
        for (var i = 0; i < dataobj.length; i++) {
          if (dataobj[i].data.data[0].data == null) {
            continue;
          }

          var keyValueObject = new Object;
          keyValueObject = levelsObj;
          var valueArray = new Array();
          var valueObject = new Object();

          for(var j=0; j< dataobj[i].data.data[0].data.length; j++) {
            keyValueObject[dataobj[i].data.data[0].data[j].time] = dataobj[i].data.data[0].data[j].value;
          }
          // console.log(keyValueObject);

          var k = 0;
          $.each(keyValueObject, function (key2, dataobj2) {
            valueArray[k] = keyValueObject[key2];
            k++;
          });

          var color = ["#d7dee6", "#64afab", "#608848", "#4ca914", "#ce5e8c", "#fb0d6f", "#53b16c", "#d109f3", "#d2afd8", "#6b0a55"];

          valueObject["label"] = "Memory_"+i;
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

          if(sltChartInstancesValue == "All") {
            valueObject["hidden"] = false;
          } else {
            if(i == Number(sltChartInstancesValue)) {
              valueObject["hidden"] = false;
            } else {
              valueObject["hidden"] = true;
            }
          }

          datasetsArray[i] = valueObject;

          // console.log(datasetsArray);
        }
      });

      // console.log(levelsObj);

      var speedData = null;
      speedData = {
        labels: levelsArray2,
        datasets : datasetsArray
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
        }
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
    var speedCanvas3 = document.getElementById("speedChart3");

    Chart.defaults.global.defaultFontFamily = "gulim";
    Chart.defaults.global.defaultFontSize = 12;

    // TODO 하드코딩
    var guid = "2d35e19c-f223-49a3-b4b5-da2c55969f07";
    var idx = String(this.appSummaryInstance);
    var defaultTimeRange = String(this.sltChartDefaultTimeRange) + "m";
    var groupBy = String(this.sltChartGroupBy) + "s";
    var type = "All";
    var sltChartInstancesValue = this.sltChartInstances;


    this.appMainService.getNetworkByte(guid, idx, defaultTimeRange, groupBy, type).subscribe(data => {
      var levelsArray = new Array();
      var levelsArray2 = new Array();
      var levelsObj = new Object();
      var datasetsArray = new Array();

      $.each(data, function (key, dataobj) {
        for(var i=0; i< dataobj.length; i++) {
          if(dataobj[i].data.data[0].data == null) {
            continue;
          }

          var timeArray = new Array();

          for(var j=0; j< dataobj[i].data.data[0].data.length; j++) {
            var date = new Date(dataobj[i].data.data[0].data[j].time * 1000);
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var day = date.getDay();
            var hour = date.getHours();
            var min = date.getMinutes();
            var sec = date.getSeconds();
            var retVal =   (month < 10 ? "0" + month : month) + "/"
              + (day < 10 ? "0" + day : day) + " "
              + (hour < 10 ? "0" + hour : hour) + ":"
              + (min < 10 ? "0" + min : min);

            timeArray[j] = dataobj[i].data.data[0].data[j].time;
          }

          if(levelsArray.length == 0) {
            levelsArray = timeArray;
          } else {
            if(levelsArray.length > timeArray.length) {

            } else if(levelsArray.length < timeArray.length) {
              levelsArray = new Array();
              levelsArray = timeArray;
            }
          }
        }

      });

      for(var k=0; k< levelsArray.length; k++) {
        levelsObj[levelsArray[k]] = "";

        var date = new Date(levelsArray[k] * 1000);
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var day = date.getDay();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        var retVal =   (month < 10 ? "0" + month : month) + "/"
          + (day < 10 ? "0" + day : day) + " "
          + (hour < 10 ? "0" + hour : hour) + ":"
          + (min < 10 ? "0" + min : min);

        levelsArray2[k] = retVal;
      }

      $.each(data, function (key, dataobj) {
        for (var i = 0; i < dataobj.length; i++) {
          if (dataobj[i].data.data[0].data == null) {
            continue;
          }

          var keyValueObject = new Object;
          keyValueObject = levelsObj;
          var valueArray = new Array();
          var valueObject = new Object();

          for(var j=0; j< dataobj[i].data.data[0].data.length; j++) {
            keyValueObject[dataobj[i].data.data[0].data[j].time] = dataobj[i].data.data[0].data[j].value;
          }
          // console.log(keyValueObject);

          var k = 0;
          $.each(keyValueObject, function (key2, dataobj2) {
            valueArray[k] = keyValueObject[key2];
            k++;
          });

          var color = ["#d7dee6", "#64afab", "#608848", "#4ca914", "#ce5e8c", "#fb0d6f", "#53b16c", "#d109f3", "#d2afd8", "#6b0a55"];

          valueObject["label"] = "Network_"+i;
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

          if(sltChartInstancesValue == "All") {
            valueObject["hidden"] = false;
          } else {
            if(i == Number(sltChartInstancesValue)) {
              valueObject["hidden"] = false;
            } else {
              valueObject["hidden"] = true;
            }
          }

          datasetsArray[i] = valueObject;

          // console.log(datasetsArray);
        }
      });

      // console.log(levelsObj);

      var speedData = null;
      speedData = {
        labels: levelsArray2,
        datasets : datasetsArray
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
        }
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

  // copyClick(id: string) {
  //   var inContent = $("#"+id).val();
  //   $("#out_a").val(inContent);
  // }

  refreshClick() {
    this.ngOnInit();
  }

  showWindowTailLogs() {
    window.open('http://localhost:8080/tailLogs?name='+this.appName+'&org='+this.orgName+'&space='+this.spaceName+'&guid='+this.appGuid+'', '_blank', 'location=no, directories=no width=1000, height=700');
  }

  showWindowAppLink(urlLink: string) {
    window.open('http://'+urlLink+'', '_blank', 'location=no, directories=no width=1000, height=700');
  }

}
