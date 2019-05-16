import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import * as Rx from 'rxjs/Rx';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class WebsocketService {

  // Our socket connection
  private socket;

  constructor() {
  }

  connect(): Rx.Subject<MessageEvent> {
    this.socket = io({
      path: "/ws/tailLog",
      transportOptions: {
        polling: {
          'Authorization': "Basic YWRtaW46b3BlbnBhYXN0YQ=="
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
