import { Component, OnInit } from '@angular/core';
import {TailLogsService} from './tail-logs.service';

declare var $: any;
declare var require: any;
let appConfig = require('assets/resources/env/config.json');

@Component({
  selector: 'app-tail-logs',
  templateUrl: './tail-logs.component.html',
  styleUrls: ['./tail-logs.component.css']
})
export class TailLogsComponent implements OnInit {
  public appLogs: string;
  public currentTime: string;
  public guid: string;
  tailLogIntervalMillisecond = appConfig['tailLogIntervalMillisecond']


  constructor(private tailLogsService: TailLogsService) {
  }

  ngOnInit() {
    this.appLogs = "";
    this.guid = document.location.href.split("guid=")[1];
    this.getInitTime(this.guid);


  }

  getInitTime(guid: String) {
    let time: string;
    this.tailLogsService.getInitTime(this.guid).subscribe(data => {
      this.currentTime = data.log.batch[0].timestamp + 1000;
      this.getTailLogs(this.currentTime);

    });
  }



  getTailLogs(currentTime: string) {
    this.tailLogsService.getTailLogs(this.guid, currentTime).subscribe(data => {

      var str = this.appLogs;

      $.each(data.log.batch, function (key, dataobj) {
      str += dataobj.log.payload + '<br>';
              });
      this.appLogs = str;

      if(data.log.batch.length > 0){
        let lastTime = data.log.batch[data.log.batch.length - 1].timestamp;
	this.currentTime = lastTime + 1000;
        setTimeout(() => this.getTailLogs(this.currentTime) , this.tailLogIntervalMillisecond);
      }else{
        setTimeout(() => this.getTailLogs(this.currentTime) , this.tailLogIntervalMillisecond);
      }

    });
  }
}
