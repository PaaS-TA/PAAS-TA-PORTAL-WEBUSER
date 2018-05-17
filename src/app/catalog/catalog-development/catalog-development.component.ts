import { Component, OnInit } from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {BuildPack, CatalogService} from "../main/catalog.service";
import {ActivatedRoute} from "@angular/router";
import {CATALOGURLConstant} from "../common/catalog.constant";
import {Space} from "../../model/space";
import {Organization} from "../../model/organization";

@Component({
  selector: 'app-catalog-development',
  templateUrl: './catalog-development.component.html',
  styleUrls: ['./catalog-development.component.css']
})
export class CatalogDevelopmentComponent implements OnInit {

  namemsg : string = '';
  routemsg : string ='';

  namecheck : number = 0;
  routecheck : number = 0;

  successapp : string;
  falseapp : string;
  successroute : string;
  falseroute : string;

  domain: string; // 도메인
  domainid : string; // 도메인id
  buildpack : BuildPack;
  appname: string; //앱 이름
  appurl: string; // 앱URL
  memory: number; // 메모리
  disk: number; // 디스크
  space : Space;
  org : Organization;
  orgs: Array<Organization> = new Array<Organization>(); // 조직 정보
  spaces: Array<Space> = new Array<Space>(); // 공간 정보
  appStart : boolean = false; // 앱 시작 여부
  constructor(private route: ActivatedRoute, private catalogService: CatalogService, private log: NGXLogger) {

  }

  ngOnInit() {
    this.DomainInit();
    this.BuildInit();
    this.OrgsInit();
    this.messageInit();
    this.memory = 512;
    this.disk = 1024;
  }

  DomainInit(){
    this.catalogService.getDomain().subscribe(data => {
      this.domain = data['resources'][0]['entity']['name'];
      this.domainid = data['resources'][0]['metadata']['id'];
    });
  }


  BuildInit() {
    this.catalogService.getBuildPacks(CATALOGURLConstant.GETBUILDPACKS+'/'+this.route.snapshot.params['id']).subscribe(data => {
      console.log(data);
      this.buildpack =  data['list'][0];
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

  messageInit(){
    this.successapp = CATALOGURLConstant.CREATESUCCESSAPP;
    this.falseapp = CATALOGURLConstant.CREATEFALSEAPP;
    this.successroute = CATALOGURLConstant.CREATESUCCESSROUTE;
    this.falseroute = CATALOGURLConstant.CREATEFASLEROUTE;
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

  initAppUrl() {
    if(!this.space){
      //스페이스 조직이 없거나 선택안했을시 처리
      return;
    }
    this.appurl = this.appname + '.' + this.domain;
    if (this.appname.length < 1 || this.appname.trim() === '')
    {this.appurl = ''; return;}
    this.nameCheck();
    this.routeCheck();
  }

  createApp() {
    const url = CATALOGURLConstant.CREATEAPP+'';
    let appSampleFilePath = this.buildpack['appSampleFilePath'];
    if(appSampleFilePath ==='' || appSampleFilePath === null)
      appSampleFilePath = 'N';
    let params = {
      appSampleStartYn : this.appStart ? 'Y' : 'N',
      appSampleFileName: this.buildpack['appSampleFileName'],
      spaceId: this.space.guid,
      spaceName: this.space.name,
      orgName: this.org.name,
      appName: this.appname,
      name : this.appname,
      hostName: this.appurl,
      domainName: this.domainid,
      memorySize : this.memory,
      diskSize : this.disk,
      buildPackName: this.buildpack['buildPackName'],
      appSampleFilePath : appSampleFilePath
    };
    this.catalogService.postApp(url, params).subscribe(data => {
      console.log(data);
    });
  }

  async nameCheck(){
    this.catalogService.getNameCheck(CATALOGURLConstant.NAMECHECK+this.appname+'?orgid='+this.org.guid+'&spaceid='+this.space.guid).subscribe(data => {
      if(data.toString() === CATALOGURLConstant.CREATESUCCESSAPP){
        this.namecheck = 1;
      }
      else if(data.toString() === CATALOGURLConstant.CREATEFALSEAPP){
        this.namecheck = -1;
      }
    }, error => {
      this.namecheck = -1;
    });
  }

  async routeCheck(){
    this.catalogService.getRouteCheck(CATALOGURLConstant.ROUTECHECK+this.appname).subscribe(data => {
      this.routecheck = 1;
    }, error => {
      this.routecheck = -1;
    });
  }


}
