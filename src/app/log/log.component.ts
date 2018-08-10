import {Component, InjectionToken, OnInit} from '@angular/core';
import {CommonService} from "../common/common.service";


@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {



  constructor(private common: CommonService) {

  }

  ngOnInit() {
  }


}
