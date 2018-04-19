import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppMainService} from './app-main.service';
import {Observable} from 'rxjs/Observable';

declare var $: any; declare var jQuery: any;

@Component({
  selector: 'app-app-main',
  templateUrl: './app-main.component.html',
  styleUrls: ['./app-main.component.css']
})
export class AppMainComponent implements OnInit {

  public appSummaryEntities: Observable<any[]>;
  public appStatsEntities: Observable<any[]>;
  public appEventsEntities: Observable<any[]>;
  public appEventsEntitiesRe: any = [];
  public appStatusEntities: any = [];
  private isLoading: boolean = false;

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

  constructor(private route: ActivatedRoute, private router: Router, private appMainService: AppMainService) { }

  ngOnInit() {
    $(document).ready(() => {
      //TODO 임시로...
      $.getScript( "../../assets/resources/js/common2.js" )
        .done(function( script, textStatus ) {
          //console.log( textStatus );
        })
        .fail(function( jqxhr, settings, exception ) {
          console.log( exception );
        });
    });

    this.route.queryParams.subscribe(params => {
      if (params != null) {
        this.getAppSummary(params['guid']);
        this.getAppStats(params['guid']);
        this.getAppEvents(params['guid']);
      } else {
        this.router.navigate(['dashMain']);
      }
    });
  }

  getAppSummary(guid: string) {
    this.isLoading = true;
    this.appMainService.getAppSummary(guid).subscribe(data => {
      this.appSummaryEntities = data;
      this.isLoading = false;

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

      //TODO instance, cpu, memory, disk 다구하고 밑에
      $('.BG_wrap input').each( function(){
        var BG_wrap = $(this).val();
        $(this).parent().delay(500).animate({'top':- BG_wrap + '%'},800);
        $(this).closest('dl').find("span.rights").html(BG_wrap);
      });

    });
  }

  getAppStats(guid: string) {
    this.appMainService.getAppStats(guid).subscribe(data => {
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

      this.appStatsCpuPer = Math.round(cpu / cnt);
      this.appStatsMemoryPer = Math.round(mem / cnt);
      this.appStatsDiskPer = Math.round(disk / cnt);

      $("#cpuPer").val(this.appStatsCpuPer);
      $("#memoryPer").val(this.appStatsMemoryPer);
      $("#diskPer").val(this.appStatsDiskPer);

      this.procSetAppStatusTab();
    });
  }

  procSetAppStatusTab() {
    var appStatus = [];
    $.each(this.appStatsEntities, function (key, dataobj) {
      var statusClass;
      var statusText;
      var cpu;
      var memory;
      var disk;

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

      var obj = {
        statusClass : statusClass,
        statusText : statusText,
        cpu : cpu,
        memory : memory,
        disk : disk
      };
      appStatus.push(obj);
    });
    this.appStatusEntities = appStatus;
  }

  instanceDirectInputClick() {
    $(".a0001").attr("disabled","disabled");
    var instanceS = $(".instanceS").text();
    $(".a0001").closest('dl').find("span.instanceS").html('<input class="instance_in" id="instance_in" type="text" value='+ instanceS +' />');
  }

  instanceDirectSaveClick() {
    $(".a0001").removeAttr("disabled");
    this.updateApp();
  }

  memDirectInputClick() {
    $(".a0002").attr("disabled","disabled");
    var memS = $(".memS").text();
    $(".a0002").closest('dl').find("span.memS").html('<input class="instance_in" id="mem_in" type="text" value='+ memS +' />');
  }

  memDirectSaveClick() {
    $(".a0002").removeAttr("disabled");
    this.updateApp();
  }

  diskDirectInputClick() {
    $(".a0003").attr("disabled","disabled");
    var diskS = $(".diskS").text();
    $(".a0003").closest('dl').find("span.diskS").html('<input class="instance_in" id="disk_in" type="text" value='+ diskS +' />');
  }

  diskDirectSaveClick() {
    $(".a0003").removeAttr("disabled");
    this.updateApp();
  }

  // 앱 수정사항 저장
  updateApp() {
    var instancesChange = 0;
    var memoryChange = 0;
    var diskChange = 0;

    if($(".instanceS").text() != '') {
      instancesChange = $(".instanceS").text();
    } else {
      instancesChange = $("#instance_in").val();
    }
    if($(".memS").text() != '') {
      memoryChange = $(".memS").text();
    } else {
      memoryChange = $("#mem_in").val();
    }
    if($(".diskS").text() != '') {
      diskChange = $(".diskS").text();
    } else {
      diskChange = $("#disk_in").val();
    }

    let params = {
      guid: this.appSummaryGuid,
      instances: instancesChange,
      memory: memoryChange,
      diskQuota: diskChange
    };
    this.appMainService.updateApp(params).subscribe(data => {
      window.location.reload();
    });
  }

  getAppEvents(guid: string) {
    this.appMainService.getAppEvents(guid).subscribe(data => {
      this.appEventsEntities = data.resources;

      var appEvents = [];
      $.each(data.resources, function (key, dataobj) {
        if(dataobj.entity.type == "app.cras") {
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
          iconClass : iconClass,
          date : dataobj.metadata.created_at.replace('T', '  ').replace('Z', ''),
          type : dataobj.entity.type,
          actor_name : dataobj.entity.actor_name,
          requestText : requestText
        };
        appEvents.push(obj);
      });
      this.appEventsEntitiesRe = appEvents;
    });
  }

}
