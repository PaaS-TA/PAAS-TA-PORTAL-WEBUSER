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
    // If you aren't familiar with environment variables then
    // you can hard code `environment.ws_url` as `http://localhost:5000`
    // this.socket = io.connect('http://localhost:5555');

    this.socket = io({
      path: "/ws",
      transportOptions: {
        polling: {
          'Authorization': "Basic YWRtaW46b3BlbnBhYXN0YQ=="
        }
      }
    });
    //
    //
    // // We define our observable which will observe any incoming messages
    // // from our socket.io server.
    let observable = new Observable(observer => {
      this.socket.on('event', event => {
        console.log(event);
      });

      this.socket.on('message', (data) => {
        console.log("Received message from Websocket Server")
        // this.socket.emit('method', 'GET');
        // this.socket.emit('Content-Type', 'application/json');
        // this.socket.emit('Authorization', 'Basic YWRtaW46b3BlbnBhYXN0YQ==');
        // this.socket.emit('X-Broker-Api-Version', '2.4');
        // this.socket.emit('X-Requested-With', 'XMLHttpRequest');
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      }
    });

    // let ws = new WebSocket("http://localhost:5555");
    //
    // let observable = Rx.Observable.create(
    //   (obs: Rx.Observer<MessageEvent>) => {
    //     ws.onmessage = obs.next.bind(obs);
    //     ws.onerror = obs.error.bind(obs);
    //     ws.onclose = obs.complete.bind(obs);
    //     return ws.close.bind(ws);
    //   })

    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the `next()` method is called.
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

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return Rx.Subject.create(observer, observable);
  }

}
