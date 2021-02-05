import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import * as Rx from 'rxjs/Rx';
import {Observable} from 'rxjs/Rx';
import {CommonService} from "../../common/common.service";

declare var require: any;
let appConfig = require('assets/resources/env/config.json');

@Injectable()
export class WebsocketService {

  // Our socket connection
  private socket;


  private apiUri;
  private authorization;
  private point: number;
  private endpoint: number;

  constructor(private commonService: CommonService) {
    this.apiUri = commonService.getApiUri();
    console.log("commonService.getApiUri()="+commonService.getApiUri());
    this.point = this.apiUri.lastIndexOf('/');
    this.endpoint = this.apiUri.lastIndexOf(':');
    //this.apiUri = this.apiUri.substring(this.point + 1, this.endpoint);
    this.authorization = commonService.getAuthorization();
  }

  connect(): Rx.Subject<MessageEvent> {
    
    var apiTarget = document.createElement('a');
    apiTarget.href = this.apiUri;
    console.log("apiTarget.hostname="+apiTarget.hostname);    
    var socketUri="ws://"+ apiTarget.hostname +":1024";

    var socketPath="/tailLog";
    var socketParams="";

    if(location.href.indexOf("?") > -1){
      socketParams = location.href.substr(location.href.indexOf("?") + 1);
    }

    if(appConfig.tailLogUri.length > 0){
      if(appConfig.tailLogUri.lastIndexOf("/") + 1 == appConfig.tailLogUri.length){
        socketUri=appConfig.tailLogUri.substr(0,appConfig.tailLogUri.lastIndexOf("/"));  
      }else{
        socketUri=appConfig.tailLogUri;
      }
      socketPath="/tailLog/";
    }

    this.socket = io(socketUri, {
      path: socketPath,
      query: socketParams,
      transportOptions: {
        polling: {
          'Authorization': this.authorization
        }
      }
    });

    let observable = new Observable(observer => {
      this.socket.on('event', event => {
      });

      this.socket.on('message', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      }
    });

    let observer = {
      next: (data: Object) => {
        var jsonObject = {
          userName: "111",
          message: "222"
        };

        this.socket.emit('message', jsonObject);
        // this.socket.emit('message', JSON.stringify(data));
      },
    };

    return Rx.Subject.create(observer, observable);
  }

}
