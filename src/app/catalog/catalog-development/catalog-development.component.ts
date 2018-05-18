import { Component, OnInit } from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {BuildPack, CatalogService} from "../main/catalog.service";
import {ActivatedRoute} from "@angular/router";
import {CATALOGURLConstant} from "../common/catalog.constant";
import {Space} from "../../model/space";
import {Organization} from "../../model/organization";
import {FormGroup} from "@angular/forms/forms";

@Component({
  selector: 'app-catalog-development',
  templateUrl: './catalog-development.component.html',
  styleUrls: ['./catalog-development.component.css']
})
export class CatalogDevelopmentComponent implements OnInit {
  catalogcontans = CATALOGURLConstant;
  namecheck : number = 0;
  namepatterncheck : boolean = true;
  routecheck : number = 0;
  routepatterncheck : boolean = true;

  appplaceholder : string;
  routeplaceholder : string;

  orgname : string;
  spacename : string;
  dd : boolean;
  disableappinput : boolean;
  disablerouteinput : boolean;
  disablebutton : boolean;

  space : Space;
  org : Organization;
  orgs: Array<Organization> = new Array<Organization>(); // 조직 정보
  spaces: Array<Space> = new Array<Space>(); // 공간 정보

  inputtime : any;
  outputtime : any;

  domain: string = ''; // 도메인
  domainid : string; // 도메인id
  buildpack : BuildPack;
  appname: string; //앱 이름
  appurl: string; // 앱URL
  memory: number; // 메모리
  disk: number; // 디스크
  appStart : boolean = false; // 앱 시작 여부

  constructor(private route: ActivatedRoute, private catalogService: CatalogService, private log: NGXLogger) {

  }

  ngOnInit() {
    this.RouterInit();
    this.OrgsFrist();
    this.SpacesFrist();
    this.DomainInit();
    this.BuildInit();
    this.OrgsInit();
    this.messageInit();

    this.memory = 512;
    this.disk = 1024;
  }

  RouterInit(){
    const orgname = this.route.snapshot.params['orgname'];
    const spacename = this.route.snapshot.params['spacename'];
    orgname == null ? (this.orgname = CATALOGURLConstant.OPTIONORG, this.placeholderSetting(true)) : (this.orgname = orgname, this.placeholderSetting(false));
    spacename == null ? (this.spacename = CATALOGURLConstant.OPTIONSPACE, this.placeholderSetting(true)) : (this.spacename = spacename, this.placeholderSetting(false));
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

  OrgsFrist(){
    this.org = new Organization(null, null);
    this.org.name = CATALOGURLConstant.OPTIONORG;
    this.orgs.push(this.org);
  }

  SpacesFrist(){
    this.space = new Space(null, null, null);
    this.space.name = CATALOGURLConstant.OPTIONSPACE;
    this.spaces.push(this.space);
  }


  OrgsInit(){
    this.catalogService.getOrglist().subscribe(data => {
      data['resources'].forEach(res => {
        const _org = new Organization(res['metadata'], res['entity']);
        this.orgs.push(_org);
        if(_org.name === this.orgname){
          this.org = _org;
        }
      });
      if(this.space.name !=='' && this.org.name !== ''){
        this.catalogService.getSpacelist(this.org.guid).subscribe(data => {
          data['spaceList']['resources'].forEach(res => {
            const _space = new Space(res['metadata'], res['entity'], null);
            this.spaces.push(_space);
            if(_space.name === this.spacename){
              this.space = _space;
            } });
        }); }
    });
  }

  messageInit(){

  }

  orgSelect() {
    this.spaces = new Array<Space>();
    this.placeholderSetting(true);
    this.SpacesFrist();
    this.catalogService.getSpacelist(this.org.guid).subscribe(data => {
      data['spaceList']['resources'].forEach(res => {
        this.spaces.push(new Space(res['metadata'], res['entity'], null));
      });
    });
  }

  spaceSelect(){
    this.placeholderSetting(this.space.name === CATALOGURLConstant.OPTIONSPACE)
  }

  initAppUrl() {
    if(!this.space){
      //스페이스 조직이 없거나 선택안했을시 처리
      return;
    }
    if(!this.pattenTest()){
      return;
    }

    if (this.appname.length < 1 || this.appname.trim() === ''){
      this.appurl = '';
      this.disableButton(true);
      return;
    }
    this.appurl = this.appname + '.' + this.domain;
    this.disableButton(false);
     this.nameCheck();
    this.routeCheck();
  }

  placeholderSetting(value : boolean){
    this.disableInput(value);
    this.disableButton(true);
    if(value){
      this.appplaceholder = CATALOGURLConstant.SELECTORGANDSPACE;
      this.routeplaceholder = CATALOGURLConstant.SELECTORGANDSPACE;
    }
    else{
      this.appplaceholder = CATALOGURLConstant.INPUTAPPNAME;
      this.routeplaceholder = CATALOGURLConstant.INPUTHOSTNAME;
    }
  }

  disableInput(value : boolean){
    this.disableappinput = value;
    this.disablerouteinput = value;
  }

  disableButton(value : boolean){
    this.disablebutton = value;
  }

  pattenTest(){
    const regExpPattern = /[\{\}\[\]\/?,;:|\)*~`!^+<>\#$%&\\\=\(\'\"]/gi;
    const regExpBlankPattern = /[\s]/g;
    this.namepatterncheck = !(regExpPattern.test(this.appname) || regExpBlankPattern.test(this.appname));
    if(!this.namepatterncheck){
      this.namecheck = CATALOGURLConstant.NO;
    }
    return this.namepatterncheck;
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

  nameCheck() {
    this.catalogService.getNameCheck(CATALOGURLConstant.NAMECHECK+this.appname+'?orgid='+this.org.guid+'&spaceid='+this.space.guid).subscribe(data => {
      let map = new Map<number, string>();
      map = data;
      if(map.get(this.catalogService.lasttime)){
        this.namecheck = CATALOGURLConstant.OK;
        this.catalogService.namecheckmap = new Map<number, string>();
      }
        }, error => {
      this.namecheck = CATALOGURLConstant.NO;
      this.disableButton(true);
    });;
  }

  routeCheck(){
    return this.catalogService.getRouteCheck(CATALOGURLConstant.ROUTECHECK+this.appname).subscribe(data => {
      if(data['RESULT']===CATALOGURLConstant.SUCCESS) {
        this.routecheck = CATALOGURLConstant.OK;
        return true;
      }
      else if (data['RESULT']===CATALOGURLConstant.FAIL){
        this.routecheck = CATALOGURLConstant.NO;
        this.disableButton(true);
        return false;
      }
    }, error => {
      this.routecheck = CATALOGURLConstant.NO;
      this.disableButton(true);
      return false;
    });
  }
}
