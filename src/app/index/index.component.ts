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
    });


  }

  ngOnDestroy(){
    console.log("삭제실행");
    $('#fp-nav').remove();
  }

}
