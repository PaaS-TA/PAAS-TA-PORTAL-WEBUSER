import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../common/common.service';
import {NGXLogger} from "ngx-logger";
import {CatalogService} from "../main/catalog.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CATALOGURLConstant} from "../common/catalog.constant";
import {Space} from "../../model/space";
import {Organization} from "../../model/organization";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {isNullOrUndefined, isUndefined} from "util";
declare var $: any;
declare var jQuery: any;

declare var require: any;
let appConfig = require('assets/resources/env/config.json');

@Component({
  selector: 'app-catalog-development',
  templateUrl: './catalog-development.component.html',
  styleUrls: ['./catalog-development.component.css']
})
export class CatalogDevelopmentComponent implements OnInit {

  apiversion = appConfig['apiversion'];

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

  diskoption : any = [];
  memoryoption : any = [];
  sharedomain : any;
  currentdomain : any;
  domainList : Array<any>;
  buildpack : any; //빌드팩 정보
  appname: string = ''; //앱 이름
  hostname: string =''; // 앱 호스트
  memory: number; // 메모리
  disk: number; // 디스크
  appStart : boolean = true; // 앱 시작 여부
  
  userAppStoredName: String;
  userAppFileName: String;
  userAppFilePath: String;
  
  public appFileToUpload: File = null;

  constructor(private translate: TranslateService, private common: CommonService, private router : Router, private route: ActivatedRoute, private catalogService: CatalogService, private log: NGXLogger) {
    this.catalogService.isLoading(false);
    this.translate.get('catalog').subscribe((res: string) => {
      this.translateEntities = res;
      this.orgsFirst();
      this.spacesFirst();
      this.activatedRouteInit();
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateEntities = event.translations.catalog;
      if(this.orgs.length > 1){
      this.orgs[0].name = event.translations.catalog.nav.org_name;
      this.spaces[0].name = event.translations.catalog.nav.space_name;
      }
    });
    this.catalogService.navView = 'appDevelopment';
  }

  ngOnInit() {
    this.navInit();
    this.domainList = new Array<any>();
    this.setting();
    this.shareDomainInit();
    this.buildInit();
    this.getRoutes();
    this.orgsInit();
    this.doLayout();
    setTimeout(() => this.keyPressInit(), 1000);

  }
  
  navInit(){
    $('#nav_first').attr('class','');
    $('#nav_second').attr('class','');
    $('#nav_third ').attr('class','cur');
    $('#nav_fourth').attr('class','');
  }

  setting(){
    this.catalogService.getDiskOption().subscribe(data => {
      this.diskoption = data.list;
      this.disk = this.diskoption[0].value2
    });
    this.catalogService.getMemoryOption().subscribe(data => {
      this.memoryoption = data.list;
      this.memory = this.memoryoption[0].value2
    });
  }

  keyPressInit(){
    $('#orgname').trigger('focus');
    window.scrollTo(0,0);

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
        })
        .fail(function (jqxhr, settings, exception) {
        });

    });
  }

  activatedRouteInit(){
    const orgname = this.catalogService.getOrgName();
    if(orgname !== null){
      this.catalogService.getOrgPrivateDomain('/portalapi/' + this.apiversion + '/'+this.catalogService.getOrgGuid()+'/domains').subscribe(data =>{
        data.resources.forEach(domain => {
          this.domainList.push(domain);
        });
      },error => {
        this.errorMsg(error);
      });
    }
    const spacename = this.catalogService.getSpaceName();
    orgname == null ? this.orgname =this.translateEntities.nav.org_name : this.orgname = orgname;
    spacename == null ? this.spacename = this.translateEntities.nav.space_name : this.spacename = spacename;
  }

  shareDomainInit(){
    this.catalogService.getDomain('/portalapi/' + this.apiversion + '/domains/shared').subscribe(data => {
      this.sharedomain = data['resources'][0];
      this.currentdomain = this.sharedomain;
      this.domainList.unshift(this.sharedomain);
    });
  }

  privateDomainInit(value){
    this.catalogService.getOrgPrivateDomain('/portalapi/' + this.apiversion + '/'+value+'/domains').subscribe(data =>{
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
      return;
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
            this.buildpack.img = reader.result;
          }, false);
          if (data) {
            reader.readAsDataURL(data);
          }
        }, error => {
        this.buildpack.img = '../../../assets/resources/images/catalog/catalog_3.png';
      });
      }catch(e){
        this.buildpack.img = '../../../assets/resources/images/catalog/catalog_3.png';
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
      this.errorMsg(this.translateEntities.result.errorGetRoutes);
    });
  }

  getAppNames(){
    this.catalogService.getAppNames('/portalapi/'+this.apiversion+'/catalogs/apps/'+this.org.guid+'/'+this.space.guid).subscribe(data => {
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

  orgsFirst(){
    this.org = new Organization(null, null);
    this.org.name = this.translateEntities.nav.org_name;
    this.orgs.unshift(this.org);
  }

  spacesFirst(){
    this.space = new Space(null, null, null);
    this.space.name = this.translateEntities.nav.space_name;
    this.spaces.unshift(this.space);
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
    this.spacesFirst();
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
    $('#orgname').val($('#orgname').val().replace(regExpPattern, ''));
    this.appname =$('#orgname').val().substring(0,50);
  }
  routepattenTest(){
    $('#routename').val($('#routename').val().replace(/[^a-z0-9]/gi,''));
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
  
  onAppFileChanged_click(event) {
  	let appFile = event.target.files[0];
  	if (isNullOrUndefined(appFile)) {
      return;
    }
    
    this.appFileToUpload = appFile;
    $("#dispFileName").val(appFile.name);
  }
  
  deleteUserApp() {
  	if (isNullOrUndefined(this.userAppStoredName)) {
      return;
    }
    
    this.catalogService.userAppDelete(this.userAppStoredName).subscribe(data => {
    	console.log("APP FILE DELETE SUCCESS");
    	
    	this.resetUserAppInfo();
    }, error => {
    	console.log("APP FILE DELETE FAIL");
    });
    
    
  }
  
  checkUserAppSize() {
  	let isValid = true;
  	
  	if (!isNullOrUndefined(appConfig['userAppSizeMb'])) {
  		let userAppSize = parseInt(appConfig['userAppSizeMb']);
  		if(userAppSize > 0) {
	    	let uploadFileSize = this.appFileToUpload.size;
	    	if((userAppSize << 20) < uploadFileSize) {
	    		
	    		this.translate.get('catalog.result.appFileSizeError', {fileSize: userAppSize}).subscribe((fileSizeErrorMessage: string) => {
				    this.catalogService.alertMessage(fileSizeErrorMessage, false);
				    isValid = false;
				});
	    	}
	    }
  	}
  	
	return isValid;  	
  }
  
  registUserApp() {
  	if (isNullOrUndefined(this.appFileToUpload)) {
  	  this.catalogService.alertMessage(this.translateEntities.contants.notSelectUserApp, false);
      return;
    }
    
    let isFileValid = this.checkUserAppSize();
    
    if(isFileValid) {
	    this.catalogService.isLoading(true);
	    
	    let formData = new FormData();
	    formData.append('file', this.appFileToUpload, this.appFileToUpload.name);
	    formData.append('isUserApp' , 'true');
	    
	    this.catalogService.userAppRegistration(formData).subscribe(data => {
	
	    	this.userAppStoredName = data.storedFilename;
	    	this.userAppFileName = data.filename;
	    	this.userAppFilePath = data.fileURL;
		    
		    this.createApp();
	    }, error => {
		    if(error.status == 413) {
		    	this.translate.get('catalog.result.appFileSizeError', {fileSize: error.error.FILE_MAX_SIZE}).subscribe((fileSizeErrorMessage: string) => {
				    this.catalogService.alertMessage(fileSizeErrorMessage, false);
				});
				this.catalogService.isLoading(false);
		    } else {
		    	this.catalogService.alertMessage(this.translateEntities.result.appUploadError, false);
		    }
	    	this.resetUserAppInfo();
	    });
    }
  }
  
  resetUserAppInfo() {
  	this.userAppFileName = '';
  	this.userAppStoredName = '';
    this.userAppFilePath = '';
  }
  
  createApp() {
    if(this.errorCheck()){
      return;
    }
    this.pattenTest();
    this.routepattenTest();
    this.catalogService.isLoading(true);
    this.catalogService.getNameCheck('/portalapi/'+this.apiversion+'/catalogs/apps/'+this.appname+'/?orgid='+this.org.guid+'&spaceid='+this.space.guid).subscribe(data => {
      this.catalogService.getRouteCheck(CATALOGURLConstant.ROUTECHECK+this.hostname).subscribe(data => {
      	let isUserApp = isNullOrUndefined(this.userAppFilePath) ? false : true;
      
        if(data['RESULT']===CATALOGURLConstant.SUCCESS) {
          let appSampleFilePath = this.buildpack['appSampleFilePath'];
          
          if(appSampleFilePath ==='' || appSampleFilePath === null)
            appSampleFilePath = 'N';
            
          let params = {
            appSampleStartYn : this.appStart ? 'Y' : 'N',
            appSampleFileName: isUserApp ? this.userAppFileName : this.buildpack['appSampleFileName'],
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
            appSampleFilePath : isUserApp ? this.userAppFilePath : appSampleFilePath,
            catalogType : CATALOGURLConstant.BUILDPACK,
            catalogNo : this.buildpack.no,
            userId : this.catalogService.getUserid(),
            appStoredName : isUserApp ? this.userAppStoredName : ""
          };
      	
          this.catalogService.postApp('/portalapi/'+this.apiversion+'/catalogs/app', params).subscribe(data => {
          
            if(data['RESULT']===CATALOGURLConstant.SUCCESS) {
              this.successMsg(this.translateEntities.result.buildPackSusses);
              this.router.navigate(['dashboard']);
            }else {
              this.errorMsg(data['msg']);
            }
            
            this.deleteUserApp();
          }, error =>{
            this.errorMsg(this.translateEntities.result.buildPackError);
            this.deleteUserApp();
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
        this.deleteUserApp();
      });
    }, error => {
      this.errorMsg(this.translateEntities.result.appNameError);
      this.getAppNames();
      this.namecheck = CATALOGURLConstant.NO;
      this.deleteUserApp();
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
