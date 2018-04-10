import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  promise: Promise<string>;
  observable: Observable<number>;
  subscription: Object = null;
  observableData: number;

  constructor() {
    // this.promise = this.getPromise();
    // this.observable = this.getObservable();
    // this.subscribeObservable();

  }

  ngOnInit() {
  }


  getObservable() {
    return Observable
      .interval(1000)
      .take(10)
      .map((v) => v * v);
  }

  subscribeObservable() {
    this.subscription = this.getObservable()
      .subscribe((v) => this.observableData = v);
  }

  getPromise() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve("Promise complete!"), 3000);
    });
  }

  // exitSubscribe(){
  //   console.log("EXit");
  //   this.subscription.unsubscribe();
  // }

}
