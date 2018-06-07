import { Component, OnInit } from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {BuildPack, CatalogService} from "../main/catalog.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CATALOGURLConstant} from "../common/catalog.constant";
import {Space} from "../../model/space";
import {Organization} from "../../model/organization";
import {cataloghistroy} from "../model/cataloghistory";
import {CatalogComponent} from "../main/catalog.component";

@Component({
  selector: 'app-catalog-development',
  templateUrl: './catalog-development.component.html',
  styleUrls: ['./catalog-development.component.css']
})
export class CatalogDevelopmentComponent implements OnInit {
  catalogcontans = CATALOGURLConstant;

  namecheck : number = 0;
  routecheck : number = 0;

  appplaceholder : string;
  routeplaceholder : string;

  orgname : string;
  spacename : string;
  disableappinput : boolean;
  disablerouteinput : boolean;
  disablebutton : boolean;

  appnames : Array<string>;
  hostnames : Array<string>;

  org : Organization; // 선택한 조직정보
  space : Space; // 선택한 공간정보
  orgs: Array<Organization> = new Array<Organization>(); // 조직 정보 리스트
  spaces: Array<Space> = new Array<Space>(); // 공간 정보 리스트

  domain: string = ''; // 도메인
  domainid : string; // 도메인id
  buildpack : BuildPack; //빌드팩 정보
  appname: string = ''; //앱 이름
  hostname : string;
  appurl: string =''; // 앱URL
  memory: number; // 메모리
  disk: number; // 디스크
  appStart : boolean = true; // 앱 시작 여부

  constructor(private router : Router, private route: ActivatedRoute, private catalogService: CatalogService, private log: NGXLogger) {
    this.catalogService.isLoading(false);
  }

  ngOnInit() {
    this.activatedRouteInit();
    this.domainInit();
    this.buildInit();
    this.getRoutes();
    this.orgsFrist();
    this.spacesFrist();
    this.orgsInit();
    this.memory = 512;
    this.disk = 1024;
  }

  goDocUrl(){

  }

  activatedRouteInit(){
    const orgname = this.catalogService.getOrgName();
    const spacename = this.catalogService.getSpaceName();
    console.log(orgname, spacename);
    orgname == null ? this.orgname = CATALOGURLConstant.OPTIONORG : this.orgname = orgname;
    spacename == null ? (this.spacename = CATALOGURLConstant.OPTIONSPACE, this.placeholderSetting(true)) : (this.spacename = spacename, this.placeholderSetting(false));
  }

  domainInit(){
    this.catalogService.getDomain().subscribe(data => {
      this.domain = data['resources'][0]['entity']['name'];
      this.domainid = data['resources'][0]['metadata']['guid'];
    });
  }

  buildInit() {
    this.catalogService.getBuildPacks(CATALOGURLConstant.GETBUILDPACKS+'/'+this.catalogService.getCurrentCatalogNumber()).subscribe(data => {
      this.buildpack =  data['list'][0];
    });
  }

  getRoutes(){
    this.hostnames = new Array<string>();
    this.catalogService.getRoutes(CATALOGURLConstant.GETLISTROUTE).subscribe(data => {
      data.forEach(route => {
        this.hostnames.push(route['host']);
      });
      this.catalogService.isLoading(false);
    });
  }

  getAppNames(){
    this.catalogService.getAppNames(CATALOGURLConstant.GETLISTAPP+this.org.guid+'/'+this.space.guid).subscribe(data => {
      this.appnames = new Array<string>();
      data['resources'].forEach(res => {
        this.appnames.push(res['entity']['name']);
      });
      this.checkAppName();
      this.catalogService.isLoading(false);
    });
  }

  orgsFrist(){
    this.org = new Organization(null, null);
    this.org.name = CATALOGURLConstant.OPTIONORG;
    this.orgs.push(this.org);
  }

  spacesFrist(){
    this.space = new Space(null, null, null);
    this.space.name = CATALOGURLConstant.OPTIONSPACE;
    this.spaces.push(this.space);
  }


  orgsInit(){
    this.catalogService.getOrglist().subscribe(data => {
      data['resources'].forEach(res => {
        const _org = new Organization(res['metadata'], res['entity']);
        this.orgs.push(_org);
        if(_org.name === this.orgname){
          this.org = _org;
        }
      });
        this.catalogService.getSpacelist(this.org.guid).subscribe(data => {
          data['spaceList']['resources'].forEach(res => {
            const _space = new Space(res['metadata'], res['entity'], null);
            this.spaces.push(_space);
            if(_space.name === this.spacename){
              this.space = _space;
              this.getAppNames();
            } });
        });
    });
  }


  orgSelect() {
    this.catalogService.isLoading(true);
    this.catalogService.setCurrentOrg(this.org.name, this.org.guid);
    this.spaces = new Array<Space>();
    this.placeholderSetting(true);
    this.spacesFrist();
    this.catalogService.getSpacelist(this.org.guid).subscribe(data => {
      data['spaceList']['resources'].forEach(res => {
        this.spaces.push(new Space(res['metadata'], res['entity'], null));
      });
      this.catalogService.isLoading(false);
    });
  }

  spaceSelect(){
    this.catalogService.isLoading(true);
    this.catalogService.setCurrentSpace(this.space.name, this.space.guid);
    this.getAppNames();
    this.placeholderSetting(this.space.name === CATALOGURLConstant.OPTIONSPACE);
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

  checkAppName() {
    this.disableButton(true);
    if (this.appname.length < 1 || this.appname.trim() === ''){
      this.appurl = '';
      return;
    }
    if(this.pattenTest(this.appname)){
      this.namecheck = CATALOGURLConstant.NO;
      return;
    }
    if(this.appname.length < 64){
      this.appurl = this.appname + '.' + this.domain;
      this.hostname = this.appname;
    }
    this.disableButton(false);
    this.nameCheck();
    this.checkHostName();
  }

  checkHostName(){
    if(this.appurl.indexOf('.'+this.domain) == -1){
      this.routecheck = CATALOGURLConstant.NO;
      this.disableButton(true);
      return;
    }
    const _hostname = this.appurl.split('.'+this.domain);
    this.hostname = _hostname[0];
    if(this.routepattenTest( this.hostname)){
      this.routecheck = CATALOGURLConstant.NO;
      this.disableButton(true);
      return;
    }
    this.disableButton(false);
    this.routeCheck();

  }

  disableInput(value : boolean){
    this.disableappinput = value;
    this.disablerouteinput = value;
  }

  disableButton(value : boolean){
    this.disablebutton = value;
  }

  pattenTest(value){
    const regExpPattern = /[\{\}\[\]\/?,;:|\)*~`!^+<>\#$%&\\\=\(\'\"]/gi;
    const regExpBlankPattern = /[\s]/g;
    const regKoreanPatten = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;
    return (regExpPattern.test(value) || regExpBlankPattern.test(value) || regKoreanPatten.test(value));
  }
  routepattenTest(value){
    const regExpPattern = /[\@\{\}\[\]\/?,;:|\)*~`!^+<>\#$%&\\\=\(\'\"]/gi;
    const regExpBlankPattern = /[\s]/g;
    const regKoreanPatten = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;
    return (regExpPattern.test(value) || regExpBlankPattern.test(value) || regKoreanPatten.test(value));
  }

  createApp() {
    this.catalogService.isLoading(true);
    this.catalogService.getNameCheck(CATALOGURLConstant.NAMECHECK+this.appname+'?orgid='+this.org.guid+'&spaceid='+this.space.guid).subscribe(data => {
      this.namecheck = CATALOGURLConstant.OK;
      this.catalogService.getRouteCheck(CATALOGURLConstant.ROUTECHECK+this.hostname).subscribe(data => {
        if(data['RESULT']===CATALOGURLConstant.SUCCESS) {
          this.routecheck = CATALOGURLConstant.OK;

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
            domainId: this.domainid,
            memorySize : this.memory,
            diskSize : this.disk,
            buildPackName: this.buildpack['buildPackName'],
            appSampleFilePath : appSampleFilePath,
            catalogType : CATALOGURLConstant.BUILDPACK,
            catalogNo : this.buildpack.no,
            userId : this.catalogService.getUserid()
          };
          this.catalogService.postApp(CATALOGURLConstant.CREATEAPP, params).subscribe(data => {
            this.log.debug(data);
             this.catalogService.isLoading(false);
             this.router.navigate(['dashboard']);
            // this.catalogService.postHistroy(CATALOGURLConstant.INSERTHISTROY, new cataloghistroy(this.buildpack.no, CATALOGURLConstant.BUILDPACK, this.catalogService.getUserid())).subscribe
            // (data => {
            //   alert("앱생성 성공");
            //   this.log.debug(data);

            // });
          }, error =>{
            alert("Time out Error");
            this.log.debug(error);
            this.catalogService.isLoading(false);
            this.router.navigate(['dashboard']);
          });
        }
        else if (data['RESULT']===CATALOGURLConstant.FAIL){
          alert("앱생성 실패");
          this.getRoutes();
          this.routecheck = CATALOGURLConstant.NO;
          this.disableButton(true);
          return false;
        }
      }, error => {
        alert("라우트 증복 오류");
        this.getRoutes();
        this.routecheck = CATALOGURLConstant.NO;
        this.disableButton(true);
        return false;
      });
    }, error => {
      alert("앱 이름중복 오류");
      this.getAppNames();
      this.namecheck = CATALOGURLConstant.NO;
      this.disableButton(true);
    });;

  }

  nameCheck() {
    this.namecheck = CATALOGURLConstant.OK;
    this.appnames.forEach(name => {
      if(name === this.appname){
        this.namecheck = CATALOGURLConstant.NO;
        this.disableButton(true);
        return;
      }
    });
  }

  routeCheck(){
    this.routecheck = CATALOGURLConstant.OK;
    this.hostnames.forEach(host => {
      if(host === this.appname){
        this.routecheck = CATALOGURLConstant.NO;
        this.disableButton(true);
        return;
      }
    });
  }
}
