import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import {CommonService} from '../../common/common.service';

@Injectable()
export class AppMainService {

  constructor(private commonService: CommonService) { }

  getAppSummary(name: string, guid: string) {
    let params = {name: name, guid: guid};
    return this.commonService.doPost('/portalapi/app/getAppSummary', params, '').map((res: Response) => {
      return res;
      // let resources = res['resources'];
      // return resources.map(value => {
      //   return value.entity;
      // });
    }).do(console.log);
  }
}
