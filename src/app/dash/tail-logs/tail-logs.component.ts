import { Component, OnInit } from '@angular/core';
import {TailLogsService} from './tail-logs.service';

@Component({
  selector: 'app-tail-logs',
  templateUrl: './tail-logs.component.html',
  styleUrls: ['./tail-logs.component.css']
})
export class TailLogsComponent implements OnInit {
  public appLogs: string;

  constructor(private tailLogsService: TailLogsService) {
  }

  ngOnInit() {
    this.getTailLogs();

    this.appLogs = "";

    this.tailLogsService.messages.subscribe(msg => {
      this.appLogs += msg + '<br>';
    })
  }

  getTailLogs() {
    this.tailLogsService.getTailLogs("{aa:'aa'}");
    // this.tailLogsService.getTailLogs("aa").subscribe(data => {
    //   console.log(data);
    // });
  }
}
