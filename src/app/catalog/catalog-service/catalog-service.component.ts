import { Component, OnInit } from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {BuildPack, CatalogService, Service} from "../main/catalog.service";
import {ActivatedRoute} from "@angular/router";
import {CATALOGURLConstant} from "../common/catalog.constant";
import {Space} from "../../model/space";
import {Organization} from "../../model/organization";
import {cataloghistroy} from "../model/cataloghistory";

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
      this.domainid = data['resources'][0]['metadata']['id'];
    });
  }


  ServiceInit() {
    this.catalogService.getServicePacks(CATALOGURLConstant.GETSERVICEPACKS+'/'+this.route.snapshot.params['id']).subscribe(data => {
      this.servicepack =  data['list'][0];
      this.serviceplan = new Array<plan>();
      this.catalogService.getRouteCheck('/portalapi/v2/serviceplan/'+this.servicepack.servicePackName).subscribe(data =>{
        let num = 1;
        data['list']['resources'].forEach(a => {
          this.serviceplan.push(new plan(a['entity']['description'], a['entity']['extra'], a['metadata']['guid'], num++))
        })
        console.log(this.serviceplan);
      });

    });
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
    this.catalogService.getAppList('/portalapi/v2/catalogs/apps/' + this.org.guid +'/'+this.space.guid).subscribe(data => console.log(data));
  }
  
  insertHistroy(){
    this.catalogService.postHistroy(CATALOGURLConstant.INSERTHISTROY, new cataloghistroy(this.servicepack.no, CATALOGURLConstant.SERVICEPACK, this.catalogService.getUserid())).subscribe(data => console.log(data));
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


