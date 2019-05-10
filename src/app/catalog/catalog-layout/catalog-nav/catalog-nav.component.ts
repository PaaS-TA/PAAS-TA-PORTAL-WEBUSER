import { Component, OnInit } from '@angular/core';
import {CatalogService} from "../../main/catalog.service";
import {Router} from "@angular/router";
import {isNullOrUndefined, isUndefined} from "util";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {CatalogComponent} from "../../main/catalog.component";
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-catalog-nav',
  templateUrl: './catalog-nav.component.html',
  styleUrls: ['./catalog-nav.component.css']
})
export class CatalogNavComponent implements OnInit {
  translateEntities : any;
  constructor(public catalogService: CatalogService, public router: Router) {

  }

  ngOnInit() {
    this.navStyle(1);
  }

  viewMain(number) {
    this.router.navigate(['catalog']);
    this.catalogService.viewPacks(true, true, true);
    this.navStyle(number);
    this.classNavSetting(number);
    this.catalogService.navView = 'viewAll';
    this.catalogService.buildPackfilter = '';
    this.catalogService.buildPackFilter();
    this.catalogService.servicePackfilter = '';
    this.catalogService.servicePackFilter();
  }

  viewStarterPack(number){
    if(this.router.url !== '/catalog'){
      this.catalogService.check = false;
      this.catalogService.classname = '#nav_second';
    }
    this.router.navigate(['catalog']);
    this.catalogService.viewPacks(true, false, false);
    this.navStyle(number);
    this.classNavSetting(number);
    if(number === 2){
    this.catalogService.navView = 'appTemplate';}
    else{this.catalogService.navView = 'basicType';}
  }

  viewBuildPack(value, number){
    if(this.router.url !== '/catalog'){
      this.catalogService.check = false;
      this.catalogService.classname = '#nav_third';
    }
    this.router.navigate(['catalog']);
    this.catalogService.viewPacks(false, true, false);

    if(!isNullOrUndefined(value)) {
      this.catalogService.buildPackfilter = value;
      this.catalogService.navView = value;
    }
    else {
      this.catalogService.buildPackfilter = '';
      number = 4;
      this.catalogService.navView = 'appDevelopment';
    }
    this.catalogService.buildPackFilter();
    this.classNavSetting(number);
    this.navStyle(number);

  }

  viewServicePack(value, number){
    if(this.router.url !== '/catalog'){
      this.catalogService.check = false;
      this.catalogService.classname = '#nav_fourth';
    }
    this.router.navigate(['catalog']);
    this.catalogService.viewPacks(false, false, true);
    if(!isNullOrUndefined(value)) {
      this.catalogService.servicePackfilter = value;

      this.catalogService.navView = value;
  }
    else{
      this.catalogService.servicePackfilter = '';
      this.catalogService.navView = 'service';
      number = 7;
    }
    this.catalogService.servicePackFilter();
    this.classNavSetting(number);
    this.navStyle(number);

  }

  navSearch(){

  }


  navStyle(number){
    let max = 13;
    let min = 1;
    for(min; min <= max; min++){
      if(number === min){
        $("#catlog_nav"+min).css('line-height', '54px');
        $("#catlog_nav"+min).css('color', '#fff');
        $("#catlog_nav"+min).css('background-color', '#32798c');
        $("#catlog_nav"+min).css('margin-bottom', '10px');
        $("#catlog_nav"+min).css('cursor', 'cursor');
        $("#catlog_nav"+min).css('font-size', '16px');
      }else {
        $("#catlog_nav"+min).css('line-height', '');
        $("#catlog_nav"+min).css('color', '');
        $("#catlog_nav"+min).css('background-color', '');
        $("#catlog_nav"+min).css('margin-bottom', '');
        $("#catlog_nav"+min).css('cursor', '');
        $("#catlog_nav"+min).css('font-size', '');
      }
    }
  }

  classNavSetting(number){
    $('#nav_first').attr('class','');
    $('#nav_second').attr('class','');
    $('#nav_third ').attr('class','');
    $('#nav_fourth').attr('class','');
    if(number == 1){
      $('#nav_first').attr('class','cur');
    } else if(number > 1 && number < 4){
      $('#nav_second').attr('class','cur');
    } else if(number > 3 && number < 7){
      $('#nav_third ').attr('class','cur');
    } else {
      $('#nav_fourth').attr('class','cur');
    }
  }
  }
