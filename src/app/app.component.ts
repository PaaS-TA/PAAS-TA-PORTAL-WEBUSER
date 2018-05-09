import {Component, DoCheck} from '@angular/core';
import {CommonService} from './common/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements DoCheck {
  isLoading: boolean = false;

  constructor(public common: CommonService) {

  }

  ngDoCheck() {
    if (this.isLoading != this.common.isLoading)
      this.isLoading = this.common.isLoading;
  }
}

