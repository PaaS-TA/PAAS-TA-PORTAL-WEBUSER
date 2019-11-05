import {Component, Input, OnInit} from '@angular/core';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {NGXLogger} from "ngx-logger";
import {CommonService} from "../../common/common.service";
import {Router} from "@angular/router";
import {CatalogService} from "../../catalog/main/catalog.service";
import {isNullOrUndefined} from "util";
import {SecurityService} from "../../auth/security.service";
import {Organization} from "../../model/organization";


declare var $: any;

declare var require: any;
let appConfig = require('assets/resources/env/config.json');

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
  mySign: string;
  orgMng: string;
  viewusage: any;
  public marketplace_URL: any = [];
  public ismarketplace: boolean = false;
  translateEntities: any;
  // regions: Array<any>;
  public regions: any = [];
  index: boolean;
  allMenuCursorIds: string[] = [
    'cur_dashboard', 'cur_dashboard_app', 'cur_catalog', 'cur_paasta-doc',
    'cur_usermgmt', 'cur_org', 'cur_org2', 'cur_quantity', 'cur_login',
  ];

  constructor(private translate: TranslateService, private common: CommonService,
              private router: Router, private logger: NGXLogger, private catalogservice: CatalogService, private sec: SecurityService) {
    if (this.isAppView == null)
      this.isAppView = false;
    if (this.isCatalogView == null)
      this.isCatalogView = false;
    this.marketplaceUrl();
  }

  ngOnInit() {
    // this.regions = appConfig['region'];
    // if (this.regions.length > 0){
    //   this.isRegion = true;
    // }


    this.common.getInfras().subscribe(data => {
      var regionsObj = [];
      $.each(data, function (key, dataobj) {
        var obj = {
          key: dataobj.key,
          name: dataobj.name,
          authorization: dataobj.authorization,
          apiUri: dataobj.apiUri,
          uaaUri: dataobj.uaaUri,
        };
        regionsObj.push(obj);
      });
      if (regionsObj.length == 0) {
        var obj = {
          key: "error",
          name: "error",
          apiUri: "error",
          uaaUri: "error",
          authorization: ""
        };
        this.regions.push(obj);
      } else {
        this.regions = regionsObj;
      }
    });
    this.allMenuCursorIds.forEach(id => $('#' + id).removeClass('cur'));
    $('#' + this.cursorId).addClass('cur');
    const url = this.router['url'].split("/")[1];

    this.changeLangClick(this.common.useLang);

    if (!isNullOrUndefined(this.common.getCurrentAppGuid)) {
      this.location = this.common.getCurrentLocation();
      this.orgName = this.common.getCurrentOrgName();
      this.orgGuid = this.common.getUserGuid();
      this.spaceName = this.common.getCurrentSpaceName();
      this.spaceGuid = this.common.getCurrentSpaceGuid();
      this.appName = this.common.getCurrentAppName();
      this.appGuid = this.common.getCurrentAppGuid();
    }

    this.translate.get('common').subscribe((res: string) => {
      this.translateEntities = res;
      this.viewusage = this.translateEntities.nav.viewUsage;
      this.orgMng = this.translateEntities.nav.orgManage;
      this.mySign = this.translateEntities.nav.myAccount;
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateEntities = event.translations;
      this.viewusage = this.translateEntities.common.nav.viewUsage;
      this.orgMng = this.translateEntities.common.nav.orgManage;
      this.mySign = this.translateEntities.common.nav.myAccount;
    })
  }

  changeLangClick(lang: string) {
    this.translate.use(lang);
    this.common.useLang = lang;

    $("li[id^='lang_']").removeClass("cur");
    $("#lang_" + lang + "").addClass("cur");

    $.cookie("useLang", this.common.useLang);
  }

  loginClick() {
    this.sec.doAuthorization();
  }

  changeRegionClick(key: string) {
    this.regions.forEach(region => {
      if (key == region["key"]) {
        this.common.setInfra(region["key"], region["apiUri"], region["uaaUri"], region["authorization"]);
        this.sec.doMulitRegionAuthorization(region["uaaUri"]);
      }
    });

  }

  get isShortHeader() {
    let short: boolean;

    switch (this.cursorId) {

      case 'cur_dashboard':
      case 'cur_login' :
        short = true;
        break;
      default:
        short = false;
        break;
    }

    return short;
  }

  get aLink() {
    let result: boolean;
    switch (this.cursorId) {
      case 'cur_login' :
        result = true;
        break;
      default:
        result = false;
        break;
    }
    return result
  }

  catalogInit() {
    this.catalogservice.viewPacks(true, true, true);
  }

  getCode(groudid: string) {
    return this.common.doGet('/commonapi/v2/' + groudid + '/codedetail', this.common.getToken()).map((res: any) => {
      return res;
    });
  }

  get isDashboardApp() {
    return this.cursorId === 'cur_dashboard_app';
  }

  get isCatalog() {
    return this.cursorId === 'cur_catalog';
  }

  get isManagement() {
    return (this.cursorId === 'cur_usermgmt') || (this.cursorId === 'cur_org2') || (this.cursorId === 'cur_quantity')
  }

  get menagementName() {
    if (this.cursorId === 'cur_usermgmt') {
      return this.mySign;
    } else if (this.cursorId === 'cur_org2') {
      return this.orgMng;
    } else if (this.cursorId === 'cur_quantity') {
      return this.viewusage;
    }
  }

  get catalogName() {
    return this.catalogservice.navView;
  }

  get isLogin() {
    return !isNullOrUndefined(this.common.getToken());
  }

  get isMonitoring() {
    return this.common.getMonitoring();
  }

  get isIcon() {
    return (this.cursorId === 'cur_login' || this.cursorId === 'cur_dashboard');
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

  marketplaceUrl() {
    if(!isNullOrUndefined(this.common.getToken()))
    {
      this.getCode('MARKET_PLACE_URL').subscribe(data => {
        data.list.forEach(r => {
          if(r.useYn==="Y"){
            this.marketplace_URL.push(r);
          }
        });
        if(this.marketplace_URL.length > 0){
        this.ismarketplace = true;
        }
        });
    }
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

  public new_tap_window_marketplace(url : string){
    window.open(url);
  }
}
