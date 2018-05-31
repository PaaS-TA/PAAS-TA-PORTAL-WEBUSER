import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CatalogService, BuildPack, ServicePack, StarterPack} from "../main/catalog.service";
import {NGXLogger} from "ngx-logger";
import {Organization} from "../../model/organization";
import {Space} from "../../model/space";
import {forEach} from "@angular/router/src/utils/collection";
import {CATALOGURLConstant} from "../common/catalog.constant";
import {Catalog} from "../model/Catalog";
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-catalog-detail',
  templateUrl: './catalog-detail.component.html',
  styleUrls: ['./catalog-detail.component.css']
})
export class CatalogDetailComponent implements OnInit {

  template: StarterPack;
  apptemplate: Array<BuildPack|ServicePack> = new Array<BuildPack|ServicePack>(); // 앱 구성에 나오는 목록
  region: string; // 지역
  appname: string; //앱 이름
  appurl: string; // 앱URL
  domain: string; // 도메인
  domainid : string; // 도메인id
  memory: number; // 메모리
  disk: number; // 디스크
  space : Space;
  org : Organization;
  orgs: Array<Organization> = new Array<Organization>(); // 조직 정보
  spaces: Array<Space> = new Array<Space>(); // 공간 정보
  appStart : boolean = false; // 앱 시작 여부
  catalog : Catalog;
  constructor(private route: ActivatedRoute, private catalogService: CatalogService, private log: NGXLogger) {
    this.catalog = new Catalog();
  }

  ngOnInit() {
    this.domainInit();
    this.buildAndServiceInit();
    this.doOrg();
  }
  domainInit(){
    this.catalogService.getDomain().subscribe(data => {
      this.catalog.setDomainName(data['resources'][0]['entity']['name']);
      this.catalog.setDomainId( data['resources'][0]['metadata']['guid']);
    });
  }

  buildAndServiceInit(){
    this.catalogService.CatalogDetailInit(this.route.snapshot.params['id']).subscribe(data => {
      this.template = data['Starter'];
      this.apptemplate.push(data['Buildpack']);
      data['Servicepack'].forEach(data => {
        this.apptemplate.push(data);
      })
      this.doLayout();
      this.catalog.setMemorySize(512);
      this.catalog.setDiskSize(1024);
    });
  }

  doOrg() {
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

  doSpace() {

  }

  doLayout() {
    $(document).ready(() => {
      //TODO 임시로...
      $.getScript("../../assets/resources/js/common2.js")
        .done(function (script, textStatus) {
          //console.log( textStatus );
        })
        .fail(function (jqxhr, settings, exception) {
          console.log(exception);
        });
    });
  }

  orgSelect() {
    this.spaces = new Array<Space>();
    this.catalogService.getSpacelist(this.org.guid).subscribe(data => {
      data['spaceList']['resources'].forEach(res => {
        this.spaces.push(new Space(res['metadata'], res['entity'], null));
      });
      if(this.spaces[0])this.space = this.spaces[0];
    });
    this.catalog.setOrgId(this.org.guid);
  }

  spaceSelect(){
    this.catalog.setSpaceId(this.space.guid);
  }

  initAppUrl() {
    this.appurl = this.appname + '.' + this.catalog.getDomainName();
    if (this.appname.length < 1 || this.appname.trim() === '')
      this.appurl = '';
  }

  createApp() {
    const url = CATALOGURLConstant.CREATEAPP+'';
    let appSampleFilePath = this.apptemplate[0]['appSampleFilePath'];
    if(appSampleFilePath ==='' || appSampleFilePath === null)
      appSampleFilePath = 'N';
    this.catalog.setAppSampleStartYn(this.appStart ? 'Y' : 'N');
    this.catalog.setAppSampleFileName(this.apptemplate[0]['appSampleFileName']);
    this.catalog.setBuildPackName(this.apptemplate[0]['buildPackName']);
    this.catalog.setAppSampleFilePath(appSampleFilePath);
    this.catalog.setHostName(this.appurl);
    this.catalog.setAppName(this.appname);
    this.catalog.setOrgName(this.org.name);
    this.catalog.setSpaceName(this.space.name);
    this.catalog.setSpaceId(this.space.guid);

    this.catalogService.postApp(url, this.catalog).subscribe(data => {
      console.log(data);
    });

  }
}
