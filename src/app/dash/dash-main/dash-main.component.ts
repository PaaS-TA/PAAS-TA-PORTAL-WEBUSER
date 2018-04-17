import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {CommonService} from '../../common/common.service';

@Component({
  selector: 'app-dash-main',
  templateUrl: './dash-main.component.html',
  styleUrls: ['./dash-main.component.css']
})
export class DashMainComponent implements OnInit {
  private loading: boolean;

  constructor(private router: Router, private common: CommonService) { }

  ngOnInit() {
  }

  gotoAppMain(name: string, guid: string) {
    let params = {name: name, guid: guid};
    this.router.navigate(['appMain'], {queryParams : params});
  }

}
