import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CatalogService, StarterPack} from "../main/catalog.service";
import {NGXLogger} from "ngx-logger";
import {Organization} from "../../model/organization";
import {Space} from "../../model/space";
import {CATALOGURLConstant} from "../common/catalog.constant";
import {TranslateService, LangChangeEvent} from "@ngx-translate/core";

declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-catalog-detail',
  templateUrl: './catalog-detail.component.html',
  styleUrls: ['./catalog-detail.component.css']
})
export class CatalogDetailComponent implements OnInit {
  catalogcontans = CATALOGURLConstant;

  template: StarterPack;
  public translateEntities: any = [];
  trans : string;


  apptemplate: Array<any> = new Array<any>(); // 앱 구성에 나오는 목록
  serviceplanlist : Array<any> = new Array<any>();
  servicenamelist : Array<any>;
  namecheck : number = 0;
  routecheck : number = 0;
  appplaceholder : string;
  routeplaceholder : string;
  disableappinput : boolean;
  disablerouteinput : boolean;
  disablebutton : boolean;
  appnames: Array<string>; //앱 이름
  hostnames : Array<string>;
  orgname : string;
  spacename : string;
  region: string; // 지역
  appname: string = ''; //앱 이름
  hostname : string;
  appurl: string; // 앱URL
  domain: string =''; // 도메인
  domainid : string; // 도메인 guid
  memory: number; // 메모리
  disk: number; // 디스크
  space : Space;
  org : Organization;
  orgs: Array<Organization> = new Array<Organization>(); // 조직 정보
  spaces: Array<Space> = new Array<Space>(); // 공간 정보
  appStart : boolean = true; // 앱 시작 여부
  appbind : boolean = true;
  buttonid : number = 0;
  switchid : number = 3;
  constructor(private translate: TranslateService, private router : Router, private route: ActivatedRoute, private catalogService: CatalogService, private log: NGXLogger) {

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateEntities = event.translations.catalog;
    });
  }

  ngOnInit() {
    $('#nav_first').attr('class','');
    $('#nav_second').attr('class','cur');
    $('#nav_third ').attr('class','');
    $('#nav_fourth').attr('class','');
    this.domainInit();
    this.activatedRouteInit();
    this.buildAndServiceInit();
    this.getRoutes();
    this.orgsFrist();
    this.spacesFrist();
    this.orgsInit();
    this.doLayout();
  }

  domainInit(){
    this.catalogService.getDomain().subscribe(data => {
      this.domain = data['resources'][0]['entity']['name'];
      this.domainid = data['resources'][0]['metadata']['guid'];
    });
  }
  activatedRouteInit(){
    const orgname = this.catalogService.getOrgName();
    console.log(orgname);
    const spacename = this.catalogService.getSpaceName();
    console.log(orgname, spacename);
    orgname == null ? this.orgname = CATALOGURLConstant.OPTIONORG : this.orgname = orgname;
    spacename == null ? (this.spacename = CATALOGURLConstant.OPTIONSPACE, this.placeholderSetting(true)) : (this.spacename = spacename, this.placeholderSetting(false));
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

  placeholderSetting(value : boolean){
    this.disableInput(value);
    this.disableButton(true);
    // if(value){
    //   this.appplaceholder = "{{'catalog.contants.selectOrgAndSpace' | translate }} ";
    //   this.routeplaceholder = "'catalog.contants.selectOrgAndSpace' | translate";
    // }
    // else{
    //   this.appplaceholder = "'catalog.contants.inputAppName' | translate";
    //   this.routeplaceholder = "'catalog.contants.inputHostName' | translate";
    // }
  }
  disableInput(value : boolean){
    this.disableappinput = value;
    this.disablerouteinput = value;
  }
  disableButton(value : boolean){
    this.disablebutton = value;
  }

  buildAndServiceInit(){
    this.catalogService.CatalogDetailInit(this.catalogService.getCurrentCatalogNumber()).subscribe(data => {
      this.template = data['Starter'];
      this.apptemplate.push(data['Buildpack']);
      data['Servicepack'].forEach(data => {
        this.apptemplate.push(data);
        this.catalogService.getServicePlan(CATALOGURLConstant.GETSERVICEPLAN + data.servicePackName).subscribe(list => {
          let planlist = data;
          planlist.appbind = planlist.appBindYn==='Y' ? true : false;
          planlist.servicename = '';
          planlist.servicenamecheck = 0;
          planlist.plans = list['resources'];
          planlist.plans.forEach(list => {
            list.bullet = this.serviceBulletSetting(list.entity.extra);
            list.subbullet = this.serviceSubBulletSetting(list.entity.extra);
            list.amount = this.serviceAmountSetting(list.entity.extra);
          });
          planlist.id = 'ra' + ++this.buttonid;
          planlist.switchid = 'switch' + ++this.switchid;
          planlist.plan = planlist.plans[0];
          this.serviceParameterSetting(planlist, 'parameter', planlist.parameter);
          this.serviceParameterSetting(planlist, 'appBindParameter', planlist.appBindParameter);
          this.serviceplanlist.push(planlist);
          console.log(this.serviceplanlist);
          $.getScript("../../assets/resources/js/common2.js")
            .done(function (script, textStatus) {
              //console.log( textStatus );
            })
            .fail(function (jqxhr, settings, exception) {
              console.log(exception);
            });
        }, error => {
          alert("서비스 플랜이 없습니다.");
        });
      });
    },error => {
        this.router.navigate(['catalog']);
    });
    this.disk = 512;
    this.memory = 512;
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
            this.serviceInstanceList();
          } });
      });
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

  spaceSelect(){
    this.catalogService.isLoading(true);
    this.catalogService.setCurrentSpace(this.space.name, this.space.guid);
    this.getAppNames();
    this.serviceInstanceList();
    this.placeholderSetting(this.space.name === CATALOGURLConstant.OPTIONSPACE);
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

  serviceInstanceList() {
    this.servicenamelist = new Array<string>();
    this.catalogService.getServiceInstance(CATALOGURLConstant.GETSERVICEINSTANCE + this.org.guid + '/' + this.space.guid).subscribe(data => {
      data['resources'].forEach(resources => {
        this.servicenamelist.push(resources['entity']['name']);
      })
//      this.serviceNameCheck();
      this.catalogService.isLoading(false);
    });
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
    this.doLayout();
    console.log(this.trans);
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

  serviceNameCheck(service) {
    this.disableButton(true);
    if (service.servicename.length < 1 || service.servicename.trim() === '') {
      service.servicenamecheck = 0;
      this.disableButton(true);
      return;
    }
    if(this.pattenTest(service.servicename)){
      service.servicenamecheck = CATALOGURLConstant.NO;
      this.disableButton(true);
      return;
    }
    service.servicenamecheck = CATALOGURLConstant.OK;
    if(this.servicenamelist.some(name => {
      if (name === service.servicename) {
        service.servicenamecheck = CATALOGURLConstant.NO;
        return true;
      }
    })){
      return;
    }
    this.serviceplanlist.some(plan => {
      plan.servicenamecheck = CATALOGURLConstant.OK;
      if(plan !== service && plan.servicename===service.servicename){
        service.servicenamecheck = 2;
        plan.servicenamecheck = 2;
        return true;
      }
    });
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

  changePlan(serviceplan ,plan) {
    serviceplan.plan = plan;
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

  serviceAmountSetting(value){
    value = JSON.parse(value);
    let amount;
    if(value.costs){
      amount = value.costs[0]['amount'].usd;
    }
    return amount + '/' + value.costs[0]['unit'];

  }

  serviceParameterSetting(planlist, key, params) {
    let param = new Array<any>();
    let hiddenparam = new Array<any>();
    if (params != 'undefined' && params != null && params != '{}' && params != '') {
      const str = params.replace("}", "");
      const str2 = str.replace("{", "");
      const split = str2.split(",");
      split.forEach(data => {
        const deleteSign = data.replace(/"/g, "");
        const splitSign = deleteSign.split(":");
        if (splitSign != null && splitSign != 'undefined' && splitSign != '') {
          if (splitSign[1].trim() == "text") {
            param.push(new Array("text", splitSign[0], ""));
          }if (splitSign[1].trim() == "password") {
            param.push(new Array("password", splitSign[0], ""));
          } if (splitSign[1].trim() == "default") {
            hiddenparam.push(new Array("default", splitSign[0], ""));
          }}});
      if (key == 'parameter') {
        planlist.serviceparameter = param;
        planlist.hiddenserviceparameter = hiddenparam;
      } else if (key == 'appBindParameter') {
        planlist.appparameter = param;
        planlist.hiddenappparameter = hiddenparam;
      }
    }
  }

  settingradiobuttionid() : string{
    return 'ra' + this.buttonid++;
  }

  setParmeterData(value, value2):string {
    let data = '';
    if (value != 'undefined' && value != null && value !== 'undefined' && value !== null) {
      value.forEach(param => {
        if (data !== '') {
         data = data + ',' + '"'+ param[1] + '":"' + param[2] +'"';
        } else {
           data = '"'+ param[1] + '":"' + param[2] +'"';
        }});
    }if (value2 != 'undefined' && value2 != null && value2 !== 'undefined' && value2 !== null) {
      value2.forEach(param => {
        param[2] = "default";
        if (data !== '') {
          data = data + ',' + '"'+ param[1] + '":"' + param[2] +'"';
        } else {
          data = '"'+ param[1] + '":"' + param[2] +'"';
        }});
    }
    return '{' + data + '}';
  }


  createApp(values : TranslateService) {
    this.translate.get('catalog').subscribe(data => {
      console.log(data);
    });
    console.log(this.translateEntities);
    this.catalogService.alertMessage(this.translateEntities.result.appNameError, false);
    //
    // this.catalogService.isLoading(true);
    // this.catalogService.getNameCheck(CATALOGURLConstant.NAMECHECK+this.appname+'?orgid='+this.org.guid+'&spaceid='+this.space.guid).subscribe(data => {
    //   this.catalogService.getRouteCheck(CATALOGURLConstant.ROUTECHECK+this.hostname).subscribe(data => {
    //     if(data['RESULT']===CATALOGURLConstant.SUCCESS) {
    //       const url = CATALOGURLConstant.CREATEAPPTEMPLATE+'';
    //       let appSampleFilePath = this.apptemplate[0]['appSampleFilePath'];
    //       if(appSampleFilePath ==='' || appSampleFilePath === null)
    //         appSampleFilePath = 'N';
    //       let paramlist = new Array<any>();
    //       this.serviceplanlist.forEach(list => {
    //         let serviceparam = {
    //           name: list.servicename,
    //           servicePlan: list.plan.metadata.guid,
    //           parameter: this.setParmeterData(list.serviceparameter, list.hiddenserviceparameter),
    //           app_bind_parameter: this.setParmeterData(list.appparameter, list.hiddenappparameter),
    //           appGuid : list.appbind ? '' : '(id_dummy)',
    //         };
    //         paramlist.push(serviceparam);
    //       });
    //       let param ={
    //         appSampleStartYn : this.appStart ? 'Y' : 'N',
    //         appSampleFileName: this.apptemplate[0]['appSampleFileName'],
    //         spaceId: this.space.guid,
    //         spaceName: this.space.name,
    //         orgName: this.org.name,
    //         appName: this.appname,
    //         name : this.appname,
    //         hostName: this.appurl,
    //         domainId: this.domainid,
    //         memorySize : this.memory,
    //         diskSize : this.disk,
    //         buildPackName: this.apptemplate[0]['buildPackName'],
    //         appSampleFilePath : appSampleFilePath,
    //         servicePlanList : paramlist,
    //         catalogType : CATALOGURLConstant.STARTERPACK,
    //         catalogNo : this.template.no,
    //         userId : this.catalogService.getUserid()
    //       };
    //       this.catalogService.postApp(url, param).subscribe(data => {
    //         this.catalogService.isLoading(false);
    //         alert("앱 템플릿 생성 완료");
    //         this.router.navigate(['dashboard']);
    //       }, error => {
    //         this.catalogService.isLoading(false);
    //         alert("앱 템플릿 생성 실패");
    //       });
    //     }
    //   }, error => {
    //     alert("라우트 증복 오류");
    //     this.getRoutes();
    //     this.routecheck = CATALOGURLConstant.NO;
    //     this.disableButton(true);
    //     return false;
    //   });
    // }, error => {
    //   this.catalogService.alertMessage(this.translateEntities['result']['appNameError'], false);
    //   this.getAppNames();
    //   this.namecheck = CATALOGURLConstant.NO;
    //   this.disableButton(true);
    // });
  }
}
