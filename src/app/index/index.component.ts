import {Component, OnDestroy, OnInit} from '@angular/core';
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() {

    $(document).ready(function() {
      $('#fullpage').fullpage({
        scrollBar: true,

        navigation: true,
        navigationPosition: 'right',

        verticalCentered: true,
        css3:false,
      });

      var agent = navigator.userAgent.toLowerCase();

      if(agent.indexOf("chrome") != -1 || agent.indexOf("edge") != -1 || agent.indexOf("firefox") != -1) {
      } else {
        $("#layerpop_index_browser_notice").modal("show");
      }

    });

  }

  ngOnDestroy(){
    $('#fp-nav').remove();
  }

}
