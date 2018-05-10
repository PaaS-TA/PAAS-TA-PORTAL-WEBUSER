import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import {WebsocketService} from './websocket.service';
import { Observable, Subject } from 'rxjs/Rx';

@Injectable()
export class TailLogsService {
  messages: Subject<any>;

  // Our constructor calls our wsService connect method
  constructor(private wsService: WebsocketService) {
    this.messages = <Subject<any>>wsService
      .connect()
      .map((response: any): any => {
        return response;
      })
  }

  getTailLogs(param: string) {
    this.messages.next(param);

    // return this.commonService.doGET('/portalapi/v2/apps/'+guid+'/taillogs', '').map((res: Response) => {
    //   return res;
    // }).do(console.log);
  }
}
