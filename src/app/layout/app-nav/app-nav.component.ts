import { Component, OnInit } from '@angular/core';
import {CommonService} from "../../common/common.service";

declare var $: any; declare var jQuery: any;

@Component({
  selector: 'app-app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.css']
})
export class AppNavComponent implements OnInit {

  constructor(public common : CommonService) { }

  ngOnInit() {
  }

  tabShowClick(id) {
    $("[id^='tabContent_']").hide();
    $("#"+id).show();

    if(id == "tabContent_viewchart") {
      $("#tab_viewchart_1").show();

      $('.monitor_tabs li:nth-child(1)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_on');
      $('.monitor_tabs li:nth-child(2)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
      $('.monitor_tabs li:nth-child(3)').removeClass('monitor_tabs_on monitor_tabs_right monitor_tabs_left').addClass('monitor_tabs_right');
    } else {
      $("[id^='tab_viewchart_']").hide();
    }
  }

}
