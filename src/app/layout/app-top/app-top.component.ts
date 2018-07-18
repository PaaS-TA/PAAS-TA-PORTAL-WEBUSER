import {Component, Input, OnInit} from '@angular/core';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {NGXLogger} from "ngx-logger";
import {CommonService} from "../../common/common.service";
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from "@angular/router";

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-app-top',
  templateUrl: './app-top.component.html',
  styleUrls: ['./app-top.component.css']
})
export class AppTopComponent implements OnInit {
  @Input('cursorId') cursorId: string;
  @Input('app-view') isAppView: Boolean;
  @Input('catalog-view') isCatalogView: Boolean;

  location: string;
  orgName: string;
  orgGuid: string;
  spaceName: string;
  spaceGuid: string;
  appName: string;
  appGuid: string;
  catalogName: number;
  translateEntities : any;
  allMenuCursorIds: string[] = [
    'cur_dashboard', 'cur_dashboard_app', 'cur_catalog', 'cur_paasta-doc',
    'cur_usermgmt', 'cur_org', 'cur_org2', 'cur_quantity', 'cur_login',
  ];

  constructor(private translate: TranslateService, private common: CommonService,
              private router: Router, private logger: NGXLogger) {
    if (this.isAppView == null)
      this.isAppView = false;
    if (this.isCatalogView == null)
      this.isCatalogView = false;

  }

  ngOnInit() {
    this.allMenuCursorIds.forEach(id => $('#' + id).removeClass('cur'));
    $('#' + this.cursorId).addClass('cur');
    const url = this.router['url'].split("/")[1];

    if (this.common.getCurrentAppGuid != null) {
      this.location = this.common.getCurrentLocation();
      this.orgName = this.common.getCurrentOrgName();
      this.orgGuid = this.common.getUserGuid();
      this.spaceName = this.common.getCurrentSpaceName();
      this.spaceGuid = this.common.getCurrentSpaceGuid();
      this.appName = this.common.getCurrentAppName();
      this.appGuid = this.common.getCurrentAppGuid();
    }
    this.translate.get('catalog').subscribe((res: string) => {
      this.translateEntities = res;
      if(url.indexOf('detail') > 0){
        this.catalogName = this.translateEntities.nav.appTemplate;
      }
      else if(url.indexOf('development') > 0){
        this.catalogName = this.translateEntities.nav.appDevelopment;
      }
      else if(url.indexOf('service') > 0){
        this.catalogName = this.translateEntities.nav.service;
      }
      else{
        this.catalogName = this.translateEntities.nav.viewAll;
      }
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateEntities = event.translations.catalog;
      if(url.indexOf('detail') > 0){
        this.catalogName = this.translateEntities.nav.appTemplate;
      }
      else if(url.indexOf('development') > 0){
        this.catalogName = this.translateEntities.nav.appDevelopment;
      }
      else if(url.indexOf('service') > 0){
        this.catalogName = this.translateEntities.nav.service;
      }
      else{
        this.catalogName = this.translateEntities.nav.viewAll;
      }
    })
  }

  changeLangClick(lang: string) {
    this.translate.use(lang);
    this.common.useLang = lang;

    $("li[id^='lang_']").removeClass("cur");
    $("#lang_"+lang+"").addClass("cur");
  }

  get isShortHeader() {
    let short: boolean;

    switch(this.cursorId) {
      case 'cur_dashboard':
      case 'cur_usermgmt':
      case 'cur_org':
      case 'cur_org2':
      case 'cur_quantity':
      case 'cur_login' :
        short = true;
        break;
      default:
        short = false;
        break;
    }

    return short;
  }

  get isDashboardApp() {
    return this.cursorId === 'cur_dashboard_app';
  }

  get isCatalog() {
    return this.cursorId === 'cur_catalog';
  }

  get isLogin() {
    return this.cursorId !== 'cur_login';
  }

  get name() {
    return this.common.getUserName();
  }

  get id() {
    return this.common.getUserid();
  }

  get pictureUrl() {
    return this.common.getImagePath();
  }

  get notifications(): String[] {
    // TODO request get notification of PaaS-TA

    let notis = [
      '파스타 공지사항-1-테스트1234',
      '파스타 공지사항-2-테스트4567',
      '파스타 공지사항-3-테스트8901'
    ];
    return notis;
  }

  public alertMsg(msg: string) {
    window.alert(msg);
  }
}
