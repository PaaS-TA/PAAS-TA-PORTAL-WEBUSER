import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {CommonService} from '../common/common.service';
declare var $: any; declare var jQuery: any;

@Component({
  selector: 'app-org',
  templateUrl: './org.component.html',
  styleUrls: ['./org.component.css']
})


export class OrgComponent implements OnInit {

  orgs : Array<Organization> = [];
  constructor(private common: CommonService) {
    var url = '/portalapi/v2/orgs/getorgs';
    this.common.doGET(url, this.common.getToken()).subscribe(data => {
      let length = data['resources']['length'];
      console.log(data);
      for (var i = 0; i < length; i++) {
        let org = new Organization();
        org.orgname = data['resources'][i]['entity']['name'];
        this.orgs[i] = org;
      }
    });
  }
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

class Organization
{
  orgname : string;
  orgid : string;
  orgspacename : string;
  orgdomain : string;

  constructor() { }
}
