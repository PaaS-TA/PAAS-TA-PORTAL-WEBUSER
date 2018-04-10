import {Component, OnInit} from '@angular/core';
import {CommonService} from '../common/common.service';
import {NGXLogger} from 'ngx-logger';
import {UaaSecurityService} from '../auth/uaa-security.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DashboardService, OrgEntity} from './dashboard.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {

  public observable: Observable<any[]>;
  public orgEntities: Observable<any[]>;
  public observable2: Observable<any[]>;
  public orgEntityIn: any[];
  private isLoading: boolean = false;
  private count: number = 0;

  constructor(private commonService: CommonService, private dashboardService: DashboardService, private log: NGXLogger, private uaa: UaaSecurityService, router: Router, private http: HttpClient) {
    if (commonService.getToken() == null) {
      router.navigate(['/']);
    }
    this.doOrgEntities();
  }

  ngOnInit() {

  }


  doOrgEntities() {

    this.isLoading = true;
    this.observable = this.dashboardService.OrgEntities();
    //---orgs
    this.observable.subscribe(data => {
      this.orgEntities = data;
      this.isLoading = false;
    });
    // this.isLoading = false;

  }

  observableTest() {
    this.observable = this.dashboardService.observation();
    this.observable.subscribe(data => {
      this.log.debug('COUNT :: ' + this.count++);
    }).add(this.observableTest2())
      .add(this.observableTest3())
      .add(this.observableTest4());
  }

  observableTest2(){
    this.log.debug('COUNT :: ' + this.count++);
  }
  observableTest3(){
    this.log.debug('COUNT :: ' + this.count++);
  }
  observableTest4(){
    this.log.debug('COUNT :: ' + this.count++);
  }
}

export interface OrgEntityIn {
  applicationEventsUrl: string,
  auditorsUrl: string,
  billingEnabled: boolean,
  billingManagersUrl: string,
  defaultIsolationSegmentId: string,
  domainsUrl: string,
  isolationSegmentUrl: string,
  managersUrl: string,
  name: string,
  privateDomainsUrl: string,
  quotaDefinitionId: string,
  quotaDefinitionUrl: string,
  spaceQuotaDefinitionsUrl: string,
  spacesUrl: string,
  status: string,
  usersUrl: string
}
