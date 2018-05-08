import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppMainService} from './app-main.service';
import {Observable} from 'rxjs/Observable';
import {CommonService} from "../../common/common.service";

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-app-main',
  templateUrl: './app-main.component.html',
  styleUrls: ['./app-main.component.css']
})
export class AppMainComponent implements OnInit {

  public appGuid: string;
  private isLoading: boolean = false;

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


  constructor(private route: ActivatedRoute, private router: Router, private appMainService: AppMainService, private common: CommonService) {
    this.common.isLoading = false;
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

    this.tabContentEventListLimit = 5;
    this.tabContentStatsListLimit = 5;

    this.route.queryParams.subscribe(params => {
      if (params != null) {
        setTimeout(() => this.showLoading(), 0);

        this.appGuid = params['guid'];
        this.getAppSummary(params['guid']);
        this.getAppStats(params['guid']);
        this.getAppEvents(params['guid']);
        this.getAppEnv(params['guid']);
        this.getAppRecentLogs(params['guid']);
      } else {
        this.router.navigate(['dashMain']);
      }
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
          if (!(null == dataobj.stats.usage.cpu || '' == dataobj.stats.usage.cpu)) cpu = cpu + dataobj.stats.usage.cpu * 100;
          if (!(null == dataobj.stats.usage.mem || '' == dataobj.stats.usage.mem)) mem = mem + dataobj.stats.usage.mem / dataobj.stats.mem_quota * 100;
          if (!(null == dataobj.stats.usage.disk || '' == dataobj.stats.usage.disk)) disk = disk + dataobj.stats.usage.disk / dataobj.stats.disk_quota * 100;
          cnt++;
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

      cpu = (Math.round((dataobj.stats.usage.cpu * 100) * Math.pow(10, 2)) / Math.pow(10, 2)).toFixed(2);
      memory = dataobj.stats.usage.mem.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      disk = dataobj.stats.usage.disk.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      uptime = (Math.round((dataobj.stats.uptime / 60) * Math.pow(10, 0)) / Math.pow(10, 0)).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

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
    this.common.isLoading = false;

    $('.BG_wrap input').each(function () {
      var BG_wrap = $(this).val();
      $(this).parent().delay(500).animate({'top': -BG_wrap + '%'}, 800);
      $(this).closest('dl').find("span.rights").html(BG_wrap);
    });
  }

  instanceDirectInputClick() {
    $(".a0001").attr("disabled", "disabled");
    var instanceS = $(".instanceS").text();
    $(".a0001").closest('dl').find("span.instanceS").html('<input class="instance_in" id="instance_in" type="text" value=' + instanceS + ' />');
  }

  instanceDirectSaveClick() {
    $(".a0001").removeAttr("disabled");
    this.updateApp();
  }

  memDirectInputClick() {
    $(".a0002").attr("disabled", "disabled");
    var memS = $(".memS").text();
    $(".a0002").closest('dl').find("span.memS").html('<input class="instance_in" id="mem_in" type="text" value=' + memS + ' />');
  }

  memDirectSaveClick() {
    $(".a0002").removeAttr("disabled");
    this.updateApp();
  }

  diskDirectInputClick() {
    $(".a0003").attr("disabled", "disabled");
    var diskS = $(".diskS").text();
    $(".a0003").closest('dl').find("span.diskS").html('<input class="instance_in" id="disk_in" type="text" value=' + diskS + ' />');
  }

  diskDirectSaveClick() {
    $(".a0003").removeAttr("disabled");
    this.updateApp();
  }

  renameAppClick() {
    $("body > div").addClass('account_modify');
    $(this).toggleClass("on");
    $(this).parents("tr").next("tr").toggleClass("on");
    $(this).parents("tr").addClass("off");
  }

  renameAppSaveClick() {
    this.updateApp();
  }

  // 앱 수정사항 저장
  updateApp() {
    var instancesChange = 0;
    var memoryChange = 0;
    var diskChange = 0;
    var name = "";

    if ($(".instanceS").text() != '') {
      instancesChange = $(".instanceS").text();
    } else {
      instancesChange = $("#instance_in").val();
    }
    if ($(".memS").text() != '') {
      memoryChange = $(".memS").text();
    } else {
      memoryChange = $("#mem_in").val();
    }
    if ($(".diskS").text() != '') {
      diskChange = $(".diskS").text();
    } else {
      diskChange = $("#disk_in").val();
    }
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
      // window.location.reload();
      this.ngOnInit();
    });
  }

  updateAppEnv(type, index) {
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
      this.ngOnInit();
      $("[id^='layerpop']").modal("hide");
      $("#add_env").hide();
    });
  }

  getAppEvents(guid: string) {
    this.appMainService.getAppEvents(guid).subscribe(data => {
      this.appEventsEntities = data.resources;

      var appEvents = [];
      $.each(data.resources, function (key, dataobj) {
        if (dataobj.entity.type == "app.cras") {
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
          iconClass = "play";
        } else if (requestText == "state:STOPPED") {
          iconClass = "stop";
        } else if (requestText == "app:CRASHED") {
          iconClass = "pause";
        } else {
          iconClass = "pause";
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
    });
  }

  addAppRoute() {
    let params = {
      applicationId: this.appGuid,
      host: $("#routeAddHostName").val(),
      domainId: $("#selectBoxDomain").val(),
      spaceId: this.appSummarySpaceGuid
    };
    this.appMainService.addAppRoute(params).subscribe(data => {
      this.ngOnInit();
      $("[id^='layerpop']").modal("hide");
      $(".lauth_dl").toggleClass("on");
    });
  }

  delAppRoute() {
    let params = {};
    this.appMainService.delAppRoute(this.appGuid, this.sltRouteDelGuid, params).subscribe(data => {
      this.ngOnInit();
      $("[id^='layerpop']").modal("hide");
    });
  }

  selectBoxServiceChange(val) {
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

  tabShowClick(id) {
    $('.nav_1d li').removeClass('cur');
    $("#nav_"+id).addClass('cur');

    $("[id^='tabContent_']").hide();
    $("#"+id).show();
  }

  eventListMoreClick() {
    this.tabContentEventListLimit = this.tabContentEventListLimit + 5;
  }

  statsListMoreClick() {
    this.tabContentStatsListLimit = this.tabContentStatsListLimit + 5;
  }

  statsResrtartClick(index) {
    let params = {};
    this.appMainService.terminateInstance(this.appGuid, index, params).subscribe(data => {
      // window.location.reload();
      this.ngOnInit();
    });
  }

  showEditEnvClick(index) {
    $("#DLid" + index).show();
  }

  hideEditEnvClick(index) {
    $("#DLid" + index).hide();
  }

  showPopEnvEditClick(index) {
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

  showPopEnvDelClick(eventID) {
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
      this.ngOnInit();
      $("[id^='layerpop']").modal("hide");
      $(".service_dl").toggleClass("on");
      this.sltServiceParam = [];
    });
  }

  showPopServiceCredentialsClick(name:string, label:string) {
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
    let params = {};
    this.appMainService.unbindService(this.appGuid, this.sltServiceUnbindGuid, params).subscribe(data => {
      this.ngOnInit();
      $("[id^='layerpop']").modal("hide");
    });
  }


  copyClick(id) {
    var inContent = $("#"+id).val();
    $("#out_a").val(inContent);
  }

}
