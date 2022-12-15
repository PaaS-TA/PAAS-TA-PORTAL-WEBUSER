import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Observable, Subject } from 'rxjs/Rx';

import {CommonService} from '../../common/common.service';

declare var require: any;
let appConfig = require('assets/resources/env/config.json');

@Injectable()
export class TailLogsService {
  apiversion = appConfig['apiversion']

  private getToken() {
    return this.commonService.getToken();
  }
  messages: Subject<any>;

  // Our constructor calls our wsService connect method
  constructor( private commonService: CommonService) {
  }

  getTailLogs(guid: string, time: string) {
    return this.commonService.doGet('/portalapi/' + this.apiversion + '/apps/' + guid + '/taillogs/' + time, this.getToken()).map((res: any) => {
      return res;
    });
  }

  getInitTime(guid: string) {
    return this.commonService.doGet('/portalapi/' + this.apiversion + '/apps/' + guid + '/taillogs/recent' , this.getToken()).map((res: any) => {
      return res;
    });
  }
}
