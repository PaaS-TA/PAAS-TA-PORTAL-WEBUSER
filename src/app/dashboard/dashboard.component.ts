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

  public orgEntities: Observable<any[]>;
  private isLoading: boolean = false;

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
    this.dashboardService.OrgEntities().subscribe(data => {
      this.orgEntities = data;
      this.isLoading = false;
    });

  }

}

