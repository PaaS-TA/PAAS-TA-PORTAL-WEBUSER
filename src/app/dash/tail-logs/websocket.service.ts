import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import * as Rx from 'rxjs/Rx';
import {Observable} from 'rxjs/Rx';
import {CommonService} from "../../common/common.service";

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
    this.point = this.apiUri.lastIndexOf('/');
    this.endpoint = this.apiUri.lastIndexOf(':');
    this.apiUri = this.apiUri.substring(this.point + 1, this.endpoint);
    this.authorization = commonService.getAuthorization();
  }

  connect(): Rx.Subject<MessageEvent> {
    this.socket = io('ws://'+this.apiUri+':5555', {
      path: "/tailLog",
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
