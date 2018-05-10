import {AfterViewChecked, Component, Input, OnInit} from '@angular/core';
import {CommonService} from '../common/common.service';
import {NGXLogger} from 'ngx-logger';
import {SecurityService} from '../auth/security.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DashboardService} from './dashboard.service';
import {OrgService} from "../org/common/org.service";
import {Organization} from "../model/organization";
import {SpaceService} from "../space/space.service";
import {Space} from '../model/space';
import {count} from "rxjs/operator/count";

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  public userid: string;
  public token: string;
  public isEmpty:boolean;
  public isSpace :boolean;
  public isMessage : boolean;

  orgs: Array<Organization>;
  org: Organization;
  spaces: Array<Space>;

  private isLoadingSpaces = false;

  constructor(private commonService: CommonService,
              private dashboardService: DashboardService,
              private orgService: OrgService,
              private spaceService: SpaceService,
              private log: NGXLogger,
              private uaa: SecurityService,
              router: Router, private http: HttpClient) {
    if (commonService.getToken() == null) {
      router.navigate(['/']);
    }
    this.userid = this.commonService.getUserid();
    this.token = this.commonService.getToken();

    this.orgs = orgService.getOrgList();

    this.org = null;
    this.spaces = [];

    this.isEmpty = true;
    this.isSpace = false;

  }

  getOrg(value: string, org: Organization) {

    console.log('::::::::::::::::: ' + value + '::::::::::::::::: ');
    this.org = this.orgs.find(org => org.name === value);
    this.isLoadingSpaces = true;

    this.isEmpty = true;
    this.isSpace = false;

    if (this.org != null && this.isLoadingSpaces && this.spaces.length <= 0) {
      this.isLoadingSpaces = false;
      this.spaces = this.spaceService.getOrgSpaceList(this.org.guid);
    }
    console.log('::::::::::::::::: find org is ', org, '::::::::::::::::: ');
  }

  getApps(value:string){
    this.isEmpty = false;
    this.isSpace = true;
   }

  ngOnInit() {
    console.log('ngOnInit fired');
    $(document).ready(() => {
      //TODO 임시로...
      $.getScript("../../assets/resources/js/common.js")
        .done(function (script, textStatus) {
          //console.log( textStatus );
        })
        .fail(function (jqxhr, settings, exception) {
          console.log(exception);
        });
    });
  }

}

