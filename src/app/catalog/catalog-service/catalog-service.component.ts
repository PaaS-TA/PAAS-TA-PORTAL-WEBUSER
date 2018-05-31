import { Component, OnInit } from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {BuildPack, CatalogService, ServicePack} from "../main/catalog.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CATALOGURLConstant} from "../common/catalog.constant";
import {Space} from "../../model/space";
import {Organization} from "../../model/organization";
import {cataloghistroy} from "../model/cataloghistory";
import {App} from "../../model/app";
import {ServicePlan} from "../model/Serviceplan";

@Component({
  selector: 'app-catalog-service',
  templateUrl: './catalog-service.component.html',
  styleUrls: ['./catalog-service.component.css']
})
export class CatalogServiceComponent implements OnInit {
  catalogcontans = CATALOGURLConstant;
  namecheck:number = 0;

  disableserviceinput:boolean;
  disablebutton:boolean;
  serviceplaceholder:string;
  orgname:string;
  spacename:string;

  servicenamelist:Array<string>;
  servicepack:ServicePack;
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


  radionumber:number;

  constructor(private router : Router, private route:ActivatedRoute, private catalogService:CatalogService, private log:NGXLogger) {

  }

  ngOnInit() {
    this.catalogService.isLoading(true);
    this.activatedRouteInit();
    this.DomainInit();
    this.orgsFirst();
    this.spacesFirst();
    this.appsFirst();
    this.ServiceInit();
    this.OrgsInit();
  }

  activatedRouteInit() {
    const orgname = this.route.snapshot.params['orgname'];
    const spacename = this.route.snapshot.params['spacename'];
    orgname == null ? this.orgname = CATALOGURLConstant.OPTIONORG : this.orgname = orgname;
    spacename == null ? (this.spacename = CATALOGURLConstant.OPTIONSPACE, this.placeholderSetting(true)) : (this.spacename = spacename, this.placeholderSetting(false));
  }

  placeholderSetting(value:boolean) {
    this.disableInput(value);
    this.disableButton(true);
    if (value) {
      this.serviceplaceholder = CATALOGURLConstant.SELECTORGANDSPACE;
    } else {
      this.serviceplaceholder = CATALOGURLConstant.INPUTSERVICE;
    }
  }

  disableInput(value:boolean) {
    this.disableserviceinput = value;
  }

  disableButton(value:boolean) {
    this.disablebutton = value;
  }

  DomainInit() {
    this.catalogService.getDomain().subscribe(data => {
      this.domain = data['resources'][0]['entity']['name'];
      this.domainid = data['resources'][0]['metadata']['guid'];
    });
  }

  orgsFirst() {
    this.org = new Organization(null, null);
    this.org.name = CATALOGURLConstant.OPTIONORG;
    this.orgs.push(this.org);
  }

  spacesFirst() {
    this.space = new Space(null, null, null);
    this.space.name = CATALOGURLConstant.OPTIONSPACE;
    this.spaces.push(this.space);
  }

  appsFirst() {
    this.app = new App(null, null);
    this.app.name = CATALOGURLConstant.NOTAPPBINDING;
    this.apps.push(this.app);
  }


  ServiceInit() {
    this.catalogService.getServicePacks(CATALOGURLConstant.GETSERVICEPACKS + '/' + this.route.snapshot.params['id']).subscribe(data => {

      this.servicepack = data['list'][0];
      this.serviceParameterSetting(this.servicepack.parameter, 'parameter');
      this.serviceParameterSetting(this.servicepack.appBindParameter, 'appBindParameter');
      this.serviceplan = new Array<ServicePlan>();
      this.catalogService.getServicePlan(CATALOGURLConstant.GETSERVICEPLAN + this.servicepack.servicePackName).subscribe(data => {
        console.log(data);
        data['resources'].forEach(a => {
          this.serviceplan.push(new ServicePlan(a['entity'], a['metadata']));
        })
        this.plan = this.serviceplan[0];
      }, error => {
        alert("서비스 플랜이 없습니다.");
      });
    });
  }

  serviceAmountSetting(value){
    value = JSON.parse(value);
    let amount;
    if(value.costs){
      amount = value.costs[0]['amount'].usd;
      if(amount == 0){
        return '무료';
      }return amount + '/' + value.costs[0]['unit'];
    } return '무료';
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
        this.orgs.push(new Organization(res['metadata'], res['entity']));
      });
      this.org = this.orgs[0];
      this.catalogService.getSpacelist(this.orgs[0].guid).subscribe(data => {
        data['spaceList']['resources'].forEach(res => {
          this.spaces.push(new Space(res['metadata'], res['entity'], null));
        });
        if (this.spaces[0])this.space = this.spaces[0];
        this.catalogService.isLoading(false);
      });
    });
  }

  orgSelect() {
    this.catalogService.isLoading(true);
    this.space = null;
    this.spaces = new Array<Space>();
    this.placeholderSetting(true);
    this.spacesFirst();
    this.catalogService.getSpacelist(this.org.guid).subscribe(data => {
      data['spaceList']['resources'].forEach(res => {
        this.spaces.push(new Space(res['metadata'], res['entity'], null));
      });
      if (this.spaces[0])this.space = this.spaces[0];
      this.catalogService.isLoading(false);
    });
  }

  appList() {
    this.catalogService.isLoading(true);
    if(this.servicepack.appBindYn === CATALOGURLConstant.YN)
    {this.apps = new Array<App>();
    this.appsFirst();
    this.catalogService.getAppNames(CATALOGURLConstant.GETLISTAPP + this.org.guid + '/' + this.space.guid).subscribe(data => {
      data['resources'].forEach(app => {
        this.apps.push(new App(app['metadata'], app['entity']));
      })
      this.placeholderSetting(this.space.name === CATALOGURLConstant.OPTIONSPACE);
      this.serviceInstanceList();
    });}


  }

  serviceInstanceList() {
    this.servicenamelist = new Array<string>();
    this.catalogService.getServiceInstance(CATALOGURLConstant.GETSERVICEINSTANCE + this.org.guid + '/' + this.space.guid).subscribe(data => {
      data['resources'].forEach(resources => {
        this.servicenamelist.push(resources['entity']['name']);
      })
      this.serviceNameCheck();
      this.catalogService.isLoading(false);
    });
  }

  serviceNameCheck() {
    this.disableButton(true);
    if (this.servicename.length < 1 || this.servicename.trim() === '') {
      this.namecheck = 0;
      return;
    }
    this.namecheck = CATALOGURLConstant.OK;
    this.servicenamelist.forEach(name => {
      if (name === this.servicename) {
        this.namecheck = CATALOGURLConstant.NO;
        return;
      }
    });
    this.disableButton(false);
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

  insertHistroy() {

    this.catalogService.postHistroy(CATALOGURLConstant.INSERTHISTROY, new cataloghistroy(this.servicepack.no, CATALOGURLConstant.SERVICEPACK, this.catalogService.getUserid())).subscribe(data => data);
  }

  createService() {
    let params = {
      name: this.servicename,
      spaceId: this.space.guid,
      servicePlan: this.plan.guid,
      appGuid: this.app.guid,
      parameter: this.setParmeterData(this.parameter, this.hiddenparameter),
      app_bind_parameter: this.setParmeterData(this.appparameter, this.hiddenappparameter)
    };
    this.catalogService.postCreateService(CATALOGURLConstant.CREATESERVICE, params).subscribe(data =>
    {
      alert("서비스생성 완료");
      this.router.navigate(['dashboard']);
    }, error => {
      alert("서비스생성 실패");
    });
  }

  settingRadioId() {

  }

  changePlan(value) {
    this.plan = value;
  }

  setParmeterData(value, value2):string {
    let data = '';
    if (value != 'undefined' && value != null && value !== 'undefined' && value !== null) {
      value.forEach(param => {
        if (data !== '') {
          data = data + ',' + param.getParameter();
        } else {
          data = param.getParameter();
        }});
    }if (value2 != 'undefined' && value2 != null && value2 !== 'undefined' && value2 !== null) {
      value2.forEach(param => {
        param.value = "default";
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



