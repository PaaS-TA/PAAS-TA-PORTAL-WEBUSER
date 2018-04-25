import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommonService} from '../common/common.service';
import {NGXLogger} from 'ngx-logger';
import 'rxjs/add/operator/map';
import {Jsonp} from '@angular/http';



@Injectable()
export class DashboardService {

  constructor(private commonService: CommonService, private http: HttpClient, private log: NGXLogger, private jsonp: Jsonp) {
  }
}

