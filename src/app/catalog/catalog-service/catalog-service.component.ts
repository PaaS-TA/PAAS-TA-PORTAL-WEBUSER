import { Component, OnInit } from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {BuildPack, CatalogService, Service} from "../main/catalog.service";
import {ActivatedRoute} from "@angular/router";
import {CATALOGURLConstant} from "../common/catalog.constant";
import {Space} from "../../model/space";
import {Organization} from "../../model/organization";
import {cataloghistroy} from "../model/cataloghistory";
import {App} from "../../model/app";

@Component({
  selector: 'app-catalog-service',
  templateUrl: './catalog-service.component.html',
  styleUrls: ['./catalog-service.component.css']
})
export class CatalogServiceComponent implements OnInit {

  servicepack : Service;
  space : Space;
  org : Organization;
  orgs: Array<Organization> = new Array<Organization>(); // 조직 정보
  spaces: Array<Space> = new Array<Space>(); // 공간 정보
  domain: string; // 도메인
  domainid : string; // 도메인id
  serviceplan : Array<plan>;
  plan : plan;
  apps : Array<App>;
  app : App;
  parameter : Array<Parameter>;
  appparameter : Array<Parameter>;
  servicename : string;
  constructor(private route: ActivatedRoute, private catalogService: CatalogService, private log: NGXLogger) {

  }

  ngOnInit() {
    this.DomainInit();
    this.ServiceInit();
    this.OrgsInit();


  }

  DomainInit(){
    this.catalogService.getDomain().subscribe(data => {
      this.domain = data['resources'][0]['entity']['name'];
      this.domainid = data['resources'][0]['metadata']['guid'];
    });
  }


  ServiceInit() {
    this.catalogService.getServicePacks(CATALOGURLConstant.GETSERVICEPACKS+'/'+this.route.snapshot.params['id']).subscribe(data => {
      this.servicepack =  data['list'][0];
      this.serviceParameterSetting(this.servicepack.parameter, 'parameter');
      this.serviceParameterSetting(this.servicepack.appBindParameter, 'appBindParameter');
      this.serviceplan = new Array<plan>();
      this.catalogService.getServicePlan(CATALOGURLConstant.GETSERVICEPLAN+this.servicepack.servicePackName).subscribe(data =>{
        let num = 1;
        data['resources'].forEach(a => {
          this.serviceplan.push(new plan(a['entity']['description'], a['entity']['extra'], a['metadata']['guid'], num++))
        })
        console.log(this.serviceplan);
      });

    });
  }

  serviceParameterSetting(value, key){
    let param = new Array<Parameter>();

    if(value != 'undefined' && value != null && value != ''){
      const str = value.replace("}","");
      const str2 = str.replace("{","");

      const split = str2.split(",");
      split.forEach(data => {
        const deleteSign = data.replace(/"/g, "");
        const splitSign = deleteSign.split(":");
        if (splitSign != null && splitSign != 'undefined' && splitSign != '') {
          console.log(splitSign[1]);
          if (splitSign[1].trim() == "text") {
          //htmlString.push(splitSign[0] + '  <input type="text" class="form-control" id="'+paramterName+'_' + splitSign[0] + '" maxlength="60"  value="" /><br>');
            param.push(new Parameter("text", splitSign[0]));
        }

        if (splitSign[1].trim() == "password") {
          //htmlString.push(splitSign[0] + '  <input type="password" class="form-control" id="'+paramterName+'_' + splitSign[0] + '" maxlength="60"  value="" /><br>');
          param.push(new Parameter("password", splitSign[0]));
        }

        if (splitSign[1].trim() == "dafalut") {
          //htmlString.push(splitSign[0] + '  <input type="hidden" class="form-control" id="'+paramterName+'_' + splitSign[0] + '" maxlength="60"  value="dafalut" /><br>');
          param.push(new Parameter("hidden", splitSign[0]));
        }

        //parameterIds.push(splitSign[0])

      }

      });
      if(key == 'parameter'){
        this.parameter = param;
      }
      else if(key == 'appBindParameter'){
        this.appparameter = param;
      }
    }

  }

  OrgsInit(){
    this.catalogService.getOrglist().subscribe(data => {
      data['resources'].forEach(res => {
        this.orgs.push(new Organization(res['metadata'], res['entity']));
      });
      this.org =  this.orgs[0];
      this.catalogService.getSpacelist(this.orgs[0].guid).subscribe(data => {
        data['spaceList']['resources'].forEach(res => {
          this.spaces.push(new Space(res['metadata'], res['entity'], null));
        });
        if(this.spaces[0])this.space = this.spaces[0];
      });
    });
  }

  orgSelect() {
    this.space = null;
    this.spaces = new Array<Space>();
    this.catalogService.getSpacelist(this.org.guid).subscribe(data => {
      data['spaceList']['resources'].forEach(res => {
        this.spaces.push(new Space(res['metadata'], res['entity'], null));
      });
      if(this.spaces[0])this.space = this.spaces[0];
    });
  }

  appList(){
    this.apps = new Array<App>();
    this.catalogService.getAppNames(CATALOGURLConstant.GETLISTAPP + this.org.guid +'/'+this.space.guid).subscribe(data => {
      data['resources'].forEach(app => {
        this.apps.push(new App(app['metadata'], app['entity']));
      })
      console.log(this.apps);
    });
    this.serviceInstanceList();
  }

  serviceInstanceList(){
    this.catalogService.getServiceInstance(CATALOGURLConstant.GETSERVICEINSTANCE+this.org.guid +'/'+this.space.guid).subscribe(data => {
      console.log(data);
    });
  }

  insertHistroy(){

    this.catalogService.postHistroy(CATALOGURLConstant.INSERTHISTROY, new cataloghistroy(this.servicepack.no, CATALOGURLConstant.SERVICEPACK, this.catalogService.getUserid())).subscribe(data => console.log(data));
  }
  createService(){
    let params = {
      name: this.servicename,
      spaceId: this.space.guid,
      servicePlan: this.plan.guid,
      appGuid: this.app.guid
    };
    this.catalogService.postCreateService(CATALOGURLConstant.CREATESERVICE, params).subscribe(data =>
    {
    });
  }

}

export class plan
{
  description : string;
  guid : string;
  extra : Array<any>;
  classnumber :number;
  constructor(description, extra, guid, num) {
    this.description = description;
    this.extra = extra;
    this.guid = guid;
    this.classnumber = num;
  }
}

export class Parameter{
  key : string;
  value : string;
  text : string;
  display : string;
  constructor(key, value){
    this.key = key;
    this.value = value;
  }
}



