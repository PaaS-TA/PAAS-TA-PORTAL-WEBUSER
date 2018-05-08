import {Component} from '@angular/core';
import {SecurityService} from './auth/security.service';
import {CommonService} from './common/common.service';
import {Router} from '@angular/router';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  constructor(public common: CommonService) {
  }

  ngOnInit() {
  }
}

