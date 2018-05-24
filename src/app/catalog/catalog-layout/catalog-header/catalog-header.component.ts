import { Component, OnInit } from '@angular/core';
import {CatalogService} from "../../main/catalog.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-catalog-header',
  templateUrl: './catalog-header.component.html',
  styleUrls: ['./catalog-header.component.css']
})
export class CatalogHeaderComponent implements OnInit {
  name : string;
  constructor(private catalogService: CatalogService, private router: Router) { }

  ngOnInit() {
    const url = this.router['url'].split("/")[1];
    if(url.indexOf('detail') > 0){
      this.name = '앱 템플릿';
    }
    else if(url.indexOf('development') > 0){
      this.name = '앱 개발환경';
    }
    else if(url.indexOf('service') > 0){
     this.name = '서비스';
    }
    else{
      this.name = '전체보기';
    }
  }

  goAppMain(){
    this.router.navigate(['appMain']);
  }

  goCatalog(){
    this.router.navigate(['catalog']);
  }

  goUser(){
    this.router.navigate(['usermgmt']);
  }

  goOrgs(){
    this.router.navigate(['org']);
  }

  goLogout(){
    this.router.navigate(['logout']);
  }


}
