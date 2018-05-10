import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CatalogService, BuildPack, Service, Template} from "../main/catalog.service";
import {NGXLogger} from "ngx-logger";
import {Organization} from "../../model/organization";
import {Space} from "../../model/space";
import {forEach} from "@angular/router/src/utils/collection";
import {CATALOGURLConstant} from "../common/catalog.constant";
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-catalog-detail',
  templateUrl: './catalog-detail.component.html',
  styleUrls: ['./catalog-detail.component.css']
})
export class CatalogDetailComponent implements OnInit {

  template: Template;
  apptemplate: Array<BuildPack|Service> = new Array<BuildPack|Service>(); // 앱 구성에 나오는 목록
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
  constructor(private route: ActivatedRoute, private catalogSerive: CatalogService, private log: NGXLogger) {
  }

  ngOnInit() {
    this.catalogSerive.getDomain().subscribe(data => {
      this.domain = data['resources'][0]['entity']['name'];
      this.domainid = data['resources'][0]['metadata']['id'];
    });
    this.catalogSerive.CatalogDetailInit(this.route.snapshot.params['id']).subscribe(data => {
      this.template = data['Starter'];
      this.apptemplate.push(data['Buildpack']);
      for (let i = 0; i < data['Servicepack'].length; i++) {
        this.apptemplate.push(data['Servicepack'][i]);
      }
      this.doLayout();
      this.memory = 512;
      this.disk = 1024;
    });
    this.doOrg();
  }

  doOrg() {
    this.catalogSerive.getOrglist().subscribe(data => {
      data['resources'].forEach(res => {
        this.orgs.push(new Organization(res['metadata'], res['entity']));
      });
      this.org =  this.orgs[0];
      this.catalogSerive.getSpacelist(this.orgs[0].guid).subscribe(data => {
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
    console.log(this.org);
    this.spaces = new Array<Space>();
    this.catalogSerive.getSpacelist(this.org.guid).subscribe(data => {
      data['spaceList']['resources'].forEach(res => {
        this.spaces.push(new Space(res['metadata'], res['entity'], null));
      });
      if(this.spaces[0])this.space = this.spaces[0];
    });
  }

  initAppUrl() {
    console.log(this.space);
    this.appurl = this.appname + '.' + this.domain;
    if (this.appname.length < 1 || this.appname.trim() === '')
      this.appurl = '';
  }

  createApp() {
    const url = CATALOGURLConstant.CREATEAPP+'';
    let appSampleFilePath = this.apptemplate[0]['appSampleFilePath'];
    if(appSampleFilePath ==='' || appSampleFilePath === null)
      appSampleFilePath = 'N';
    let params = {
      appSampleStartYn : this.appStart ? 'Y' : 'N',
      appSampleFileName: this.apptemplate[0]['appSampleFileName'],
      spaceId: this.space.guid,
      spaceName: this.space.name,
      orgName: this.org.name,
      appName: this.appname,
      name : this.appname,
      hostName: this.appurl,
      domainName: this.domainid,
      memorySize : this.memory,
      diskSize : this.disk,
      buildPackName: this.apptemplate[0]['buildPackName'],
      appSampleFilePath : appSampleFilePath
    };
    this.catalogSerive.postApp(url, params).subscribe(data => {
      console.log(data);
    });

  }
}
