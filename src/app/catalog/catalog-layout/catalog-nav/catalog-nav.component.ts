import { Component, OnInit } from '@angular/core';
import {CatalogService} from "../../main/catalog.service";
import {Router} from "@angular/router";
import {isUndefined} from "util";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-catalog-nav',
  templateUrl: './catalog-nav.component.html',
  styleUrls: ['./catalog-nav.component.css']
})
export class CatalogNavComponent implements OnInit {

  constructor(private catalogService: CatalogService, private router: Router) {
  }

  ngOnInit() {
  }

  viewMain() {
    this.router.navigate(['catalog']);
    this.catalogService.viewPacks(true, true, true);
  }

  viewStarterPack(value){
    if(this.router.url !== '/catalog'){
      this.catalogService.check = false;
      this.catalogService.classname = '#nav_second';
    }
    this.router.navigate(['catalog']);
    this.catalogService.viewPacks(true, false, false);
  }

  viewBuildPack(value){
    if(this.router.url !== '/catalog'){
      this.catalogService.check = false;
      this.catalogService.classname = '#nav_third';
    }
    this.router.navigate(['catalog']);
    this.catalogService.viewPacks(false, true, false);

    if(!isUndefined(value)) {
      this.catalogService.buildPackfilter = value;
      this.catalogService.buildPackFilter();
    }
    else {
      this.catalogService.buildPackfilter = '';
    }
  }

  viewServicePack(value){
    if(this.router.url !== '/catalog'){
      this.catalogService.check = false;
      this.catalogService.classname = '#nav_fourth';
    }
    this.router.navigate(['catalog']);
    this.catalogService.viewPacks(false, false, true);
    if(!isUndefined(value)) {
      this.catalogService.servicePackfilter = value;
    this.catalogService.servicePackFilter();
  }
    else{
      this.catalogService.servicePackfilter = '';
    }
  }
  }
