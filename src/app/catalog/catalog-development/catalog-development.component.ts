import { Component, OnInit } from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {CatalogService} from "../main/catalog.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CATALOGURLConstant} from "../common/catalog.constant";
import {Space} from "../../model/space";
import {Organization} from "../../model/organization";
import {cataloghistroy} from "../model/cataloghistory";
import {CatalogComponent} from "../main/catalog.component";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {isNullOrUndefined, isUndefined} from "util";
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-catalog-development',
  templateUrl: './catalog-development.component.html',
  styleUrls: ['./catalog-development.component.css']
})
export class CatalogDevelopmentComponent implements OnInit {
  catalogcontans = CATALOGURLConstant;
  translateEntities : any;
  namecheck : number = 0;
  routecheck : number = 0;

  orgname : string;
  spacename : string;

  appnames : Array<string>;
  hostnames : Array<string>;

  org : Organization; // 선택한 조직정보
  space : Space; // 선택한 공간정보
  orgs: Array<Organization> = new Array<Organization>(); // 조직 정보 리스트
  spaces: Array<Space> = new Array<Space>(); // 공간 정보 리스트

  sharedomain : any;
  currentdomain : any;
  domainList : Array<any>;
  buildpack : any; //빌드팩 정보
  appname: string = ''; //앱 이름
  hostname: string =''; // 앱 호스트
  memory: number; // 메모리
  disk: number; // 디스크
  appStart : boolean = true; // 앱 시작 여부

  constructor(private translate: TranslateService,private router : Router, private route: ActivatedRoute, private catalogService: CatalogService, private log: NGXLogger) {
    this.catalogService.isLoading(false);
    this.translate.get('catalog').subscribe((res: string) => {
      this.translateEntities = res;
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateEntities = event.translations.catalog;
    });
    this.catalogService.navView = 'appDevelopment';
  }

  ngOnInit() {
    this.navInit();
    this.domainList = new Array<any>();
    this.activatedRouteInit();
    this.shareDomainInit();
    this.buildInit();
    this.getRoutes();
    this.orgsFrist();
    this.spacesFrist();
    this.orgsInit();
    this.doLayout();
    setTimeout(() => this.keyPressInit(), 1000);
    this.memory = 256;
    this.disk = 512;
  }

  navInit(){
    $('#nav_first').attr('class','');
    $('#nav_second').attr('class','');
    $('#nav_third ').attr('class','cur');
    $('#nav_fourth').attr('class','');
  }

  keyPressInit(){
    $('#orgname').trigger('focus');

    $('input[name=appname]').keydown(function (key) {
      if(key.keyCode == 13){
        $('#createApp').trigger('click');
      }
    });
    $('input[name=route]').keydown(function (key) {
      if(key.keyCode == 13){
        $('#createApp').trigger('click');
      }
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

  activatedRouteInit(){
    const orgname = this.catalogService.getOrgName();
    if(orgname !== null){
      this.catalogService.getOrgPrivateDomain('/portalapi/v2/'+this.catalogService.getOrgGuid()+'/domains').subscribe(data =>{
        data.resources.forEach(domain => {
          this.domainList.push(domain);
        });
      },error => {
        this.errorMsg(error);
      });
    }
    const spacename = this.catalogService.getSpaceName();
    orgname == null ? this.orgname = CATALOGURLConstant.OPTIONORG : this.orgname = orgname;
    spacename == null ? (this.spacename = CATALOGURLConstant.OPTIONSPACE) : (this.spacename = spacename);
  }

  shareDomainInit(){
    this.catalogService.getDomain('/portalapi/v2/domains/shared').subscribe(data => {
      this.sharedomain = data['resources'][0];
      this.currentdomain = this.sharedomain;
      this.domainList.unshift(this.sharedomain);
    });
  }

  privateDomainInit(value){
    this.catalogService.getOrgPrivateDomain('/portalapi/v2/'+value+'/domains').subscribe(data =>{
      this.domainList = new Array<any>();
      this.domainList.unshift(this.sharedomain);
      this.currentdomain = this.sharedomain;
      data.resources.forEach(domain => {
        this.domainList.push(domain);
      });
    },error => {
      this.errorMsg(error);
    });
  }

  buildInit() {
    if(isNullOrUndefined(this.catalogService.getCurrentCatalogNumber())){
      this.router.navigate(['catalog']);
    }
    this.catalogService.getBuildPacks(CATALOGURLConstant.GETBUILDPACKS+'/'+this.catalogService.getCurrentCatalogNumber()).subscribe(data => {
      try {
      this.buildpack =  data['list'][0];
      var pathHeader = this.buildpack.thumbImgPath.lastIndexOf("/");
      var pathEnd = this.buildpack.thumbImgPath.length;
      var fileName = this.buildpack.thumbImgPath.substring(pathHeader + 1, pathEnd);
      this.catalogService.getImg(CATALOGURLConstant.GETIMG+fileName).subscribe(data => {

          let reader = new FileReader();
          reader.addEventListener("load", () => {
            this.buildpack.thumbImgPath = reader.result;
          }, false);
          if (data) {
            reader.readAsDataURL(data);
          }
        }, error => {
        this.buildpack.thumbImgPath = '../../../assets/resources/images/catalog/catalog_3.png';
      });
      }catch(e){
        this.buildpack.thumbImgPath = '../../../assets/resources/images/catalog/catalog_3.png';
      }},error => {
      this.router.navigate(['catalog']);
    });
  }

  getRoutes(){
    this.hostnames = new Array<string>();
    this.catalogService.getRoutes(CATALOGURLConstant.GETLISTROUTE).subscribe(data => {
      data.forEach(route => {
        this.hostnames.push(route['host']);
      });
      this.catalogService.isLoading(false);
    },error => {
      this.errorMsg(error);
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
    },error => {
      this.errorMsg(error);
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
        },error => {
          this.errorMsg(error);
        });
    },error => {
      this.errorMsg(error);
    });
  }


  orgSelect() {
    this.catalogService.isLoading(true);
    this.catalogService.setCurrentOrg(this.org.name, this.org.guid);
    this.catalogService.setCurrentSpace(null, null);
    this.spaces = new Array<Space>();
    this.spacesFrist();
    this.privateDomainInit(this.org.guid);
    this.catalogService.getSpacelist(this.org.guid).subscribe(data => {
      data['spaceList']['resources'].forEach(res => {
        this.spaces.push(new Space(res['metadata'], res['entity'], null));
      });
      this.catalogService.isLoading(false);
    },error => {
      this.errorMsg(error);
    });
  }

  spaceSelect(){
    this.catalogService.isLoading(true);
    this.catalogService.setCurrentSpace(this.space.name, this.space.guid);
    this.getAppNames();
  }

  checkAppName() {
    this.pattenTest();
    $('#routename').val(this.appname);
    this.nameCheck();
    this.checkHostName();
  }

  checkHostName(){
    this.routepattenTest();
    this.routeCheck();
  }

  pattenTest(){
    const regExpPattern = /[\{\}\[\]\/?,;:|\)*~`!^+<>\#$%&\\\=\(\'\"]/gi;
    const regExpBlankPattern = /[\s]/g;
    const regKoreanPatten = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;
    $('#orgname').val($('#orgname').val().replace(regExpPattern, '')
      .replace(regExpBlankPattern, '')
      .replace(regKoreanPatten, ''));
    this.appname =$('#orgname').val().substring(0,50);
  }
  routepattenTest(){
    const regExpPattern = /[\@\{\}\[\]\/?.,;:|\)*~`!^+<>\#$%&\\\=\(\'\"]/gi;
    const regExpBlankPattern = /[\s]/g;
    const regKoreanPatten = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;
    $('#routename').val($('#routename').val().replace(regExpPattern, '')
      .replace(regExpBlankPattern, '')
      .replace(regKoreanPatten, ''));
    this.hostname =$('#routename').val();
  }

  errorCheck() : boolean{
    if(this.org.guid === '(id_dummy)'){
      this.catalogService.alertMessage(this.translateEntities.contants.selectOrgAndSpace, false);
      return true;
    } if(this.space.guid === '(id_dummy)'){
      this.catalogService.alertMessage(this.translateEntities.contants.selectOrgAndSpace, false);
      return true;
    } if(this.namecheck !== 1 || this.appname.length <= 0){
      this.catalogService.alertMessage(this.translateEntities.result.appNameError, false);
      return true;
    } if(this.routecheck !== 1 || this.hostname.length <= 0){
      this.catalogService.alertMessage(this.translateEntities.result.routeNameError, false);
      return true;
    } return false;
  }

  createApp() {
    if(this.errorCheck()){
      return;
    }
    this.pattenTest();
    this.routepattenTest();
    this.catalogService.isLoading(true);
    this.catalogService.getNameCheck(CATALOGURLConstant.NAMECHECK+this.appname+'/?orgid='+this.org.guid+'&spaceid='+this.space.guid).subscribe(data => {
      this.catalogService.getRouteCheck(CATALOGURLConstant.ROUTECHECK+this.hostname).subscribe(data => {
        if(data['RESULT']===CATALOGURLConstant.SUCCESS) {
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
            hostName: this.hostname,
            domainId: this.currentdomain.metadata.guid,
            memorySize : this.memory,
            diskSize : this.disk,
            buildPackName: this.buildpack['buildPackName'],
            appSampleFilePath : appSampleFilePath,
            catalogType : CATALOGURLConstant.BUILDPACK,
            catalogNo : this.buildpack.no,
            userId : this.catalogService.getUserid()
          };
          this.catalogService.postApp(CATALOGURLConstant.CREATEAPP, params).subscribe(data => {
            this.successMsg(this.translateEntities.result.buildPackSusses);
            this.router.navigate(['dashboard']);
          }, error =>{
            this.errorMsg(this.translateEntities.result.buildPackError);
          });
        }
        else if (data['RESULT']===CATALOGURLConstant.FAIL){
          this.errorMsg(this.translateEntities.result.routeNameError);
          this.getRoutes();
          this.routecheck = CATALOGURLConstant.NO;
        }
      }, error => {
        this.errorMsg(this.translateEntities.result.routeNameError);
        this.getRoutes();
        this.routecheck = CATALOGURLConstant.NO;
      });
    }, error => {
      this.errorMsg(this.translateEntities.result.appNameError);
      this.getAppNames();
      this.namecheck = CATALOGURLConstant.NO;
    });

  }

  nameCheck() {
    this.namecheck = CATALOGURLConstant.OK;
    if(!isNullOrUndefined(this.appnames)){
    this.appnames.forEach(name => {
      if(name === this.appname){
        this.namecheck = CATALOGURLConstant.NO;
        return;
      }
    });
    }
  }

  routeCheck(){

    this.routecheck = CATALOGURLConstant.OK;
    this.hostnames.forEach(host => {
      if(host === this.hostname){
        this.routecheck = CATALOGURLConstant.NO;
        return;
      }
    });
  }
}
