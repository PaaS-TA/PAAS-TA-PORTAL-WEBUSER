import { Component, OnInit } from '@angular/core';

declare var $: any; declare var jQuery: any;

@Component({
  selector: 'app-app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.css']
})
export class AppNavComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  tabShowClick(id) {
    $("[id^='tabContent_']").hide();
    $("#"+id).show();

    if(id == "tabContent_viewchart") {
      $("#tab_viewchart_1").show();
    }
  }

}
