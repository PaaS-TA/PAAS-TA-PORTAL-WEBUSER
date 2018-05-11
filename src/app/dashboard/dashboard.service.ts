import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommonService} from '../common/common.service';
import {NGXLogger} from 'ngx-logger';
import 'rxjs/add/operator/map';
import {Jsonp} from '@angular/http';



@Injectable()
export class DashboardService {

  constructor(private common: CommonService, private http: HttpClient, private log: NGXLogger, private jsonp: Jsonp) {
    console.log(this.common.getToken());
  }

  // @RequestMapping(value = {Constants.V2_URL+"/spaces/{spaceid}/summary"}, method = RequestMethod.GET)
  getAppSummary(spaceid: string) {
    return this.common.doGET('/portalapi/v2/spaces/'+spaceid+'/summary','').map((res: Response) => {
      console.log(res);
      return res;
    }).do(console.log);
  }
}

