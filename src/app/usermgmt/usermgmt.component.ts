import { Component, OnInit } from '@angular/core';

declare var $: any; declare var jQuery: any;

@Component({
  selector: 'app-usermgmt',
  templateUrl: './usermgmt.component.html',
  styleUrls: ['./usermgmt.component.css']
})
export class UsermgmtComponent implements OnInit {

  constructor() { }

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
  }

}
