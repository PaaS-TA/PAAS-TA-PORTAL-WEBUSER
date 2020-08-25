import { Component, OnInit } from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {CatalogService} from "../main/catalog.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CATALOGURLConstant} from "../common/catalog.constant";
import {Space} from "../../model/space";
import {Organization} from "../../model/organization";
import {App} from "../../model/app";
import {ServicePlan} from "../model/Serviceplan";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {isNullOrUndefined, isUndefined} from "util";
declare var $: any;
declare var jQuery: any;

declare var require: any;
let appConfig = require('assets/resources/env/config.json');

@Component({
  selector: 'app-catalog-service',
  templateUrl: './catalog-service.component.html',
  styleUrls: ['./catalog-service.component.css']
})

export class CatalogServiceComponent implements OnInit {

  apiversion = appConfig['apiversion'];

  catalogcontans = CATALOGURLConstant;
  namecheck:number = 0;
  translateEntities : any;
  orgname:string;
  spacename:string;

  servicenamelist:Array<string>;
  servicepack:any;
  space:Space;
  org:Organization;
  orgs:Array<Organization> = new Array<Organization>(); // 조직 정보
  spaces:Array<Space> = new Array<Space>(); // 공간 정보
  domain:string; // 도메인
  domainid:string; // 도메인id
  serviceplan:Array<ServicePlan>;
  plan:ServicePlan;
  apps:Array<App> = new Array<App>();
  app:App;
  parameter:Array<Parameter>;
  appparameter:Array<Parameter>;
  hiddenparameter:Array<Parameter>;
  hiddenappparameter:Array<Parameter>;
  servicename:string = '';




  constructor(private translate: TranslateService, private router : Router, private route:ActivatedRoute, private catalogService:CatalogService, private log:NGXLogger) {
    this.translate.get('catalog').subscribe((res: string) => {
      this.translateEntities = res;
      this.orgsFirst();
      this.spacesFirst();
      this.appsFirst();
      this.activatedRouteInit();
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateEntities = event.translations.catalog;
      if(this.orgs.length > 1) {
        this.orgs[0].name = event.translations.catalog.nav.org_name;
        this.spaces[0].name = event.translations.catalog.nav.space_name;
      }
      if(this.apps.length > 1) {
        this.apps[0].name =  this.translateEntities.nav.not_bind_start;
      }
    });
    this.catalogService.navView = 'service';
  }

  ngOnInit() {
    $('#nav_first').attr('class','');
    $('#nav_second').attr('class','');
    $('#nav_third ').attr('class','');
    $('#nav_fourth').attr('class','cur');
    this.catalogService.isLoading(false);

    this.DomainInit();
    this.ServiceInit();
    this.OrgsInit();
    this.doLayout();
    setTimeout(() => this.keyPressInit(), 1000);
  }


  doLayout() {
    $(document).ready(() => {
      //TODO 임시로...
      $.getScript("../../assets/resources/js/common2.js")
        .done(function (script, textStatus) {
        })
        .fail(function (jqxhr, settings, exception) {
        });
    });
  }

  errorMsg(value : any){
    this.catalogService.alertMessage(value, false);
    this.catalogService.isLoading(false);
  }

  successMsg(value : any){
    this.catalogService.alertMessage(value, true);
    this.catalogService.isLoading(false);
  }

  keyPressInit(){
    $('#servicename').trigger('focus');
    window.scrollTo(0,0);

    $('input[name=servicename]').keydown(function (key) {
      if(key.keyCode == 13){
        $('#createService').trigger('click');
      }
    });
  }


  activatedRouteInit() {
    const orgname = this.catalogService.getOrgName();
    const spacename = this.catalogService.getSpaceName();
    orgname == null ? this.orgname = this.translateEntities.nav.org_name : this.orgname = orgname;
    spacename == null ? (this.spacename = this.translateEntities.nav.space_name) : (this.spacename = spacename);
  }

  DomainInit() {
    this.catalogService.getDomain('/portalapi/' + this.apiversion + '/domains/shared').subscribe(data => {
      this.domain = data['resources'][0]['entity']['name'];
      this.domainid = data['resources'][0]['metadata']['guid'];
    });
  }

  orgsFirst() {
    this.org = new Organization(null, null);
    this.org.name = this.translateEntities.nav.org_name;
    this.orgs.push(this.org);
  }

  spacesFirst() {
    this.space = new Space(null, null, null);
    this.space.name = this.translateEntities.nav.space_name;
    this.spaces.push(this.space);
  }

  appsFirst() {
    this.app = new App(null, null);
    this.app.name = this.translateEntities.nav.not_bind_start;
    this.apps.unshift(this.app);
  }

  pattenTest(){
    const regExpPattern = /[\{\}\[\]\/?,;:|\)*~`!^+<>\#$%&\\\=\(\'\"]/gi;
    $('#servicename').val($('#servicename').val().replace(regExpPattern, ''));
    this.servicename =$('#servicename').val();
  }

  ServiceInit() {
    if(isNullOrUndefined(this.catalogService.getCurrentCatalogNumber())){
      this.router.navigate(['catalog']);
      return;
    }
    this.catalogService.getServicePacks(CATALOGURLConstant.GETSERVICEPACKS + '/' + this.catalogService.getCurrentCatalogNumber()).subscribe(data => {
      try{
      this.servicepack = data['list'][0];
      var pathHeader = this.servicepack.thumbImgPath.lastIndexOf("/");
      var pathEnd = this.servicepack.thumbImgPath.length;
      var fileName = this.servicepack.thumbImgPath.substring(pathHeader + 1, pathEnd);
      this.catalogService.getImg(CATALOGURLConstant.GETIMG+fileName).subscribe(data => {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
          this.servicepack.img = reader.result;
        }, false);
        if (data) {
          reader.readAsDataURL(data);
        }

      }, error => {
        this.servicepack.thumbImgPath = 'assets/resources/images/catalog/catalog_3.png';
      });
      } catch(e){
        this.servicepack.thumbImgPath = 'assets/resources/images/catalog/catalog_3.png';
      }
      this.serviceParameterSetting(this.servicepack.parameter, 'parameter');
      this.serviceParameterSetting(this.servicepack.appBindParameter, 'appBindParameter');
      this.serviceplan = new Array<ServicePlan>();
      this.catalogService.getServicePlan('/portalapi/'+this.apiversion+'/catalogs/serviceplan/' + this.servicepack.servicePackName).subscribe(data => {
        data['resources'].forEach(a => {
          this.serviceplan.push(new ServicePlan(a['entity'], a['metadata']));
        })
        this.plan = this.serviceplan[0];
      }, error => {
        this.errorMsg(this.translateEntities.service.notServicePlan);
        this.router.navigate(['catalog']);
      });
    },error => {
     this.router.navigate(['catalog']);
    });
  }

  serviceAmountSetting(value){
    try{
    value = JSON.parse(value);
    let amount;
    if(value.costs){
      amount = value.costs[0]['amount'].usd;
      }
    return amount + '/' + value.costs[0]['unit'];
    }
    catch(error){
      return '0/MONTHLY';
    }
  }

  serviceBulletSetting(value){
    value = JSON.parse(value);
    let bullet;
    if(value.bullets){
      return value.bullets[0];
    }
  }
  serviceSubBulletSetting(value){
    try{
    value = JSON.parse(value);
    value = value.bullets.pop();
      return value;
    }catch (ex){
      return '';
    }
  }

  OrgsInit() {
    this.catalogService.getOrglist().subscribe(data => {
      data['resources'].forEach(res => {
        const _org = new Organization(res['metadata'], res['entity']);
        this.orgs.push(_org);
        if(_org.name === this.orgname){
          this.org = _org;
        }
      }, error => {
        this.errorMsg(error.message);
      });
      this.catalogService.getSpacelist(this.org.guid).subscribe(data => {
        data['spaceList']['resources'].forEach(res => {
          const _space = new Space(res['metadata'], res['entity'], null);
          this.spaces.push(_space);
          if(_space.name === this.spacename){
            this.space = _space;
            this.appList();
          } });
        this.catalogService.isLoading(false);
      }, error => {
        this.errorMsg(error.message);
      });
    });
  }

  orgSelect() {
    this.catalogService.isLoading(true);
    this.catalogService.setCurrentOrg(this.org.name, this.org.guid);
    this.space = null;
    this.spaces = new Array<Space>();
    this.spacesFirst();
    this.catalogService.getSpacelist(this.org.guid).subscribe(data => {
      data['spaceList']['resources'].forEach(res => {
        this.spaces.push(new Space(res['metadata'], res['entity'], null));
      });
      if (this.spaces[0])this.space = this.spaces[0];
      this.catalogService.isLoading(false);
    }, error => {
      this.errorMsg(error.message);
    });
  }

  appList() {
    this.catalogService.setCurrentSpace(this.space.name, this.space.guid);
      this.catalogService.isLoading(true);
      this.apps = new Array<App>();
    this.appsFirst();
    this.catalogService.getAppNames('/portalapi/'+this.apiversion+'/catalogs/apps/' + this.org.guid + '/' + this.space.guid).subscribe(data => {
      data['resources'].forEach(app => {
        this.apps.push(new App(app['metadata'], app['entity']));
      })
    }, error => {
      this.errorMsg(error.message);
    });
    this.serviceInstanceList();
  }

  serviceInstanceList() {
    this.servicenamelist = new Array<string>();
    this.catalogService.getServiceInstance('/portalapi/'+this.apiversion+'/catalogs/servicepack/' + this.org.guid + '/' + this.space.guid).subscribe(data => {
      data['resources'].forEach(resources => {
        this.servicenamelist.push(resources['entity']['name']);
      })
      this.serviceNameCheck();
      this.catalogService.isLoading(false);
    }, error => {
      this.errorMsg(error.message);
    });
  }

  serviceNameCheck() {
    this.pattenTest();
    this.namecheck = CATALOGURLConstant.OK;
    this.servicenamelist.some(name => {
      if (name === this.servicename) {
        this.namecheck = CATALOGURLConstant.NO;
        return true;
      }
    });
  }

  serviceParameterSetting(value, key) {
    let param = new Array<Parameter>();
    let hiddenparam = new Array<Parameter>();
    if (value != 'undefined' && value != null && value != '{}' && value != '') {
      const str = value.replace("}", "");
      const str2 = str.replace("{", "");
      const split = str2.split(",");
      split.forEach(data => {
        const deleteSign = data.replace(/"/g, "");
        const splitSign = deleteSign.split(":");
        if (splitSign != null && splitSign != 'undefined' && splitSign != '') {
          if (splitSign[1].trim() == "text") {
            param.push(new Parameter("text", splitSign[0]));
          }if (splitSign[1].trim() == "password") {
            param.push(new Parameter("password", splitSign[0]));
          } if (splitSign[1].trim() == "default") {
            hiddenparam.push(new Parameter("hidden", splitSign[0]));
          }}});
      if (key == 'parameter') {
        this.parameter = param;
        this.hiddenparameter = hiddenparam;
      } else if (key == 'appBindParameter') {
        this.appparameter = param;
        this.hiddenappparameter = hiddenparam;
      }
    }
  }

  //org_name,space_name,owner
  errorCheck() : boolean{
    if(this.org.guid === '(id_dummy)'){
      this.catalogService.alertMessage(this.translateEntities.contants.selectOrgAndSpace, false);
      return true;
    } if(this.space.guid === '(id_dummy)'){
      this.catalogService.alertMessage(this.translateEntities.contants.selectOrgAndSpace, false);
      return true;
    } if(this.namecheck !== 1 || this.servicename.length <= 0){
      this.errorMsg(this.translateEntities.contants.createFalseService);
      return true;
    } return false;
  }

  createService() {
    if(this.errorCheck()){
      return;
    }
    this.catalogService.isLoading(true);
    let params = {
      name: this.servicename,
      spaceId: this.space.guid,
      servicePlan: this.plan.guid,
      appGuid: this.app.guid,
      parameter: this.servicepack.onDemandYn === "Y" ? this.setParmeterData(this.appparameter, this.hiddenappparameter) : this.setParmeterData(this.parameter, this.hiddenparameter),
      app_bind_parameter: this.setParmeterData(this.appparameter, this.hiddenappparameter),
      catalogType : CATALOGURLConstant.SERVICEPACK,
      catalogNo : this.servicepack.no,
      userId : this.catalogService.getUserid(),
      onDemandYn : this.servicepack.onDemandYn
    };
    this.catalogService.postCreateService('/portalapi/'+this.apiversion+'/catalogs/serviceinstances', params).subscribe(data =>
    {
      if(data.RESULT === 'SUCCESS'){
        this.successMsg(this.translateEntities.result.serviceSusses);
        this.router.navigate(['dashboard']);
      }else if(data.RESULT === 'FAIL'){
        this.errorMsg(data.MSG);
      }

    }, error => {
      this.errorMsg(this.translateEntities.result.serviceError+ ' : ' + error.message);
    });
  }

  changePlan(value) {
    this.plan = value;
  }

  setParmeterData(value, value2):string {
    let data = '';
    if (value != 'undefined' && value != null && value !== 'undefined' && value !== null && value.length > 0) {
      value.forEach(param => {
        if (data !== '') {
          data = data + ',' + param.getParameter();
        } else {
          data = param.getParameter();
        }});
    }if (value2 != 'undefined' && value2 != null && value2 !== 'undefined' && value2 !== null && value2.length > 0) {
      value2.forEach(param => {
        let name = param.name.toUpperCase();
        if(name === 'OWNER'){
          param.value = this.catalogService.getUserId();
        }
        else if(name === 'ORG_NAME'){
          param.value = this.catalogService.getOrgName();
        }
        else if(name === 'SPACE_NAME'){
          param.value = this.catalogService.getSpaceName();
        } else if(name === 'APP_GUID'){
          param. value = this.app.guid;
        } else{
          param.value = "default";
        }
        if (data !== '') {
          data = data + ',' + param.getParameter();
        } else {
          data = param.getParameter();
        }});
    }
    return '{' + data + '}';
  }
}

export class Parameter{
  type : string;
  value : string = '';
  name : string;
  constructor(type, name){
    this.type = type;
    this.name = name;
  }
  getParameter() : string {
    return '"'+ this.name + '":"' + this.value +'"';
    //return this.value + ':' + this.type;
  }
}



