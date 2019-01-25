import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CatalogService} from "../main/catalog.service";
import {NGXLogger} from "ngx-logger";
import {Organization} from "../../model/organization";
import {Space} from "../../model/space";
import {CATALOGURLConstant} from "../common/catalog.constant";
import {TranslateService, LangChangeEvent} from "@ngx-translate/core";
import {isNullOrUndefined} from "util";

declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-catalog-detail',
  templateUrl: './catalog-detail.component.html',
  styleUrls: ['./catalog-detail.component.css']
})
export class CatalogDetailComponent implements OnInit {
  catalogcontans = CATALOGURLConstant;

  template: any;
  public translateEntities: any = [];
  trans : string;


  apptemplate: Array<any> = new Array<any>(); // 앱 구성에 나오는 목록
  serviceplanlist : Array<any> = new Array<any>();
  servicenamelist : Array<any>;
  namecheck : number = 0;
  routecheck : number = 0;

  appnames: Array<string>; //앱 이름
  hostnames : Array<string>;
  orgname : string;
  spacename : string;
  region: string; // 지역
  appname: string = ''; //앱 이름
  hostname: string; // 앱URL
  sharedomain : any;
  currentdomain : any;
  domainList : Array<any>;
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
  radioid : number = 0;


  constructor(private translate: TranslateService, private router : Router, private route: ActivatedRoute, private catalogService: CatalogService, private log: NGXLogger) {

    this.translate.get('catalog').subscribe((res: string) => {
      this.translateEntities = res;
    });
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateEntities = event.translations.catalog;
    });

    this.catalogService.navView = 'appTemplate';
  }

  ngOnInit() {
    this.navInit();
    this.domainList = new Array<any>();
    this.shareDomainInit();
    this.activatedRouteInit();
    this.buildAndServiceInit();
    this.getRoutes();
    this.orgsFrist();
    this.spacesFrist();
    this.orgsInit();
    setTimeout(() => this.doLayout(), 500);
    setTimeout(() => this.keyPressInit(), 1000);
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
    $('input[id=servicename_]').keydown(function (key) {
      if(key.keyCode == 13){
        $('#createApp').trigger('click');
      }
    });
  }

  // 카탈로그 네비 초기화
  navInit(){
    $('#nav_first').attr('class','');
    $('#nav_second').attr('class','cur');
    $('#nav_third ').attr('class','');
    $('#nav_fourth').attr('class','');
    if(isNullOrUndefined(this.catalogService.getCurrentCatalogNumber())){
      this.router.navigate(['catalog']);
    }
  }

  // 알럿 메시지(오류)
  errorMsg(value : any){
    this.catalogService.alertMessage(value, false);
    this.catalogService.isLoading(false);
  }

  // 알럿 메시지(성공)
  successMsg(value : any){
    this.catalogService.alertMessage(value, true);
    this.catalogService.isLoading(false);
  }

  //공용 도메인 가져오기
  shareDomainInit(){
    this.catalogService.getDomain('/portalapi/v2/domains/shared').subscribe(data => {
      this.sharedomain = data['resources'][0];
      this.currentdomain = this.sharedomain;
      this.domainList.unshift(this.sharedomain);
    }, error => {
      this.errorMsg(error.toLocaleString());
    });
  }

  //프라이빗 도메인 가져오기(org 선택시)
  privateDomainInit(value){
    this.catalogService.getOrgPrivateDomain('/portalapi/v2/'+value+'/domains').subscribe(data =>{
      this.domainList = new Array<any>();
      this.domainList.unshift(this.sharedomain);
      this.currentdomain = this.sharedomain;
      data.resources.forEach(domain => {
        this.domainList.push(domain);
      });
    },error => {
      this.errorMsg(error.toLocaleString());
    });
  }

  //프라이빗 도메인 가져오기(페이지 이동시)
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
    spacename == null ? this.spacename = CATALOGURLConstant.OPTIONSPACE : this.spacename = spacename;
  }

  // 라우트 목록을
  getRoutes(){
    this.hostnames = new Array<string>();
    this.catalogService.getRoutes(CATALOGURLConstant.GETLISTROUTE).subscribe(data => {
      data.forEach(route => {
        this.hostnames.push(route['host']);
      });
      this.catalogService.isLoading(false);
    });
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
            if(!list.entity){
            //list.bullet = this.serviceBulletSetting(list.entity.extra);
            //list.subbullet = this.serviceSubBulletSetting(list.entity.extra);
            list.amount = this.serviceAmountSetting(list.entity.extra);
            }else {
              list.bullet = 'Free';
              list.subbullet = 'Free';
              list.amount = 'Free';
            }
            list.radioid = this.radioid++;
          });
          planlist.id = 'ra' + ++this.buttonid;
          planlist.switchid = 'switch' + ++this.switchid;
          planlist.plan = planlist.plans[0];
          this.serviceParameterSetting(planlist, 'parameter', planlist.parameter);
          this.serviceParameterSetting(planlist, 'appBindParameter', planlist.appBindParameter);
          this.serviceplanlist.push(planlist);
        }, error => {
          this.errorMsg(this.translateEntities.service.notServicePlan);
          this.router.navigate(['catalog']);
        });
      });
    },error => {
        this.router.navigate(['catalog']);
    },() =>{
      this.apptemplate.forEach(app => {
        try{
        var pathHeader = app.thumbImgPath.lastIndexOf("/");
        var pathEnd = app.thumbImgPath.length;
        var fileName = app.thumbImgPath.substring(pathHeader + 1, pathEnd);
        this.catalogService.getImg(CATALOGURLConstant.GETIMG+fileName).subscribe(data => {
          let reader = new FileReader();
          reader.addEventListener("load", () => {
            app.thumbImgPath = reader.result;
          }, false);
          if (data) {
            reader.readAsDataURL(data);
          }
        }, error => {
          app.thumbImgPath = '../../../assets/resources/images/catalog/catalog_3.png';
        });
        } catch(e){
          app.thumbImgPath = '../../../assets/resources/images/catalog/catalog_3.png';
        } }
      );
    });
    this.disk = 512;
    this.memory = 256;
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
    this.orgs.unshift(this.org);
  }

  spacesFrist(){
    this.space = new Space(null, null, null);
    this.space.name = CATALOGURLConstant.OPTIONSPACE;
    this.spaces.unshift(this.space);
  }

  spaceSelect(){
    this.catalogService.isLoading(true);
    this.catalogService.setCurrentSpace(this.space.name, this.space.guid);
    this.getAppNames();
    this.serviceInstanceList();
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
      });
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
    this.catalogService.setCurrentSpace(null, null);
    this.spaces = new Array<Space>();
    this.spacesFrist();
    this.privateDomainInit(this.org.guid);
    this.catalogService.getSpacelist(this.org.guid).subscribe(data => {
      data['spaceList']['resources'].forEach(res => {
        this.spaces.push(new Space(res['metadata'], res['entity'], null));
      });
      this.catalogService.isLoading(false);
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
    const regExpPattern = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
    const regExpBlankPattern = /[\s]/g;
    const regKoreanPatten = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;
    $('#routename').val($('#routename').val().replace(regExpPattern, '')
      .replace(regExpBlankPattern, '')
      .replace(regKoreanPatten, ''));
    this.hostname =$('#routename').val();
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

  serviceNameCheck(id : any) {
    this.servicepattenTest(id);
    this.serviceplanlist[id].servicenamecheck = CATALOGURLConstant.OK;
    if(!isNullOrUndefined(this.servicenamelist)) {
      this.servicenamelist.some(name => {
        if (name === this.serviceplanlist[id].servicename) {
          this.serviceplanlist[id].servicenamecheck = CATALOGURLConstant.NO;
          return true;
        }
      });
      this.serviceplanlist.some(plan => {
        plan.servicenamecheck = CATALOGURLConstant.OK;
        if(plan !== this.serviceplanlist[id] && plan.servicename===this.serviceplanlist[id].servicename){
          this.serviceplanlist[id].servicenamecheck = 2;
          plan.servicenamecheck = 2;
          return true;
        }
      });
    }

  }
  servicepattenTest(id : any){
    const regExpPattern = /[\{\}\[\]\/?,;:|\)*~`!^+<>\#$%&\\\=\(\'\"]/gi;
    const regExpBlankPattern = /[\s]/g;
    const regKoreanPatten = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    $('#servicename_'+id).val($('#servicename_'+id).val().replace(regExpPattern, '')
      .replace(regExpBlankPattern, '')
      .replace(regKoreanPatten, ''));
    this.serviceplanlist[id].servicename =$('#servicename_'+id).val();
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
    if (value != 'undefined' && value != null && value !== 'undefined' && value !== null && value.length > 0)  {
      value.forEach(param => {
        if (data !== '') {
         data = data + ',' + '"'+ param[1] + '":"' + param[2] +'"';
        } else {
           data = '"'+ param[1] + '":"' + param[2] +'"';
        }});
    }if (value2 != 'undefined' && value2 != null && value2 !== 'undefined' && value2 !== null && value2.length > 0){
      value2.forEach(param => {
        let caseName = param[1].toUpperCase();
        if(caseName === 'OWNER'){
          param[2] = this.catalogService.getUserId();
        } else if(caseName === 'ORG_NAME'){
          param[2] = this.catalogService.getOrgName();
        } else if(caseName === 'SPACE_NAME'){
          param[2] = this.catalogService.getSpaceName();
        } else{
          param[2] = "default";
        }
        if (data !== '') {
          data = data + ',' + '"'+ param[1] + '":"' + param[2] +'"';
        } else {
          data = '"'+ param[1] + '":"' + param[2] +'"';
        }});
    }
    return '{' + data + '}';
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
    } if(this.serviceplanlist.some(plan => {if(plan.servicenamecheck !== 1 && plan.servicename.length <= 0){ return true;}}) || this.serviceplanlist.length <= 0){
      this.catalogService.alertMessage(this.translateEntities.contants.createFalseService, false);
      return true;
    }
    return false;
  }

  createApp(values : TranslateService) {
    this.pattenTest();
    this.routepattenTest();
    let min = 0;
    let max = this.serviceplanlist.length;
    for(min; min < max; min++){
      this.servicepattenTest(min);
    }
   if(this.errorCheck()){
     return;
   }
    this.catalogService.isLoading(true);
    this.catalogService.getNameCheck(CATALOGURLConstant.NAMECHECK+this.appname+'/?orgid='+this.org.guid+'&spaceid='+this.space.guid).subscribe(data => {
      this.catalogService.getRouteCheck(CATALOGURLConstant.ROUTECHECK+this.hostname).subscribe(data => {
        if(data['RESULT']===CATALOGURLConstant.SUCCESS) {
          const url = CATALOGURLConstant.CREATEAPPTEMPLATE+'';
          let appSampleFilePath = this.apptemplate[0]['appSampleFilePath'];
          if(appSampleFilePath ==='' || appSampleFilePath === null)
            appSampleFilePath = 'N';
          let paramlist = new Array<any>();
          this.serviceplanlist.forEach(plan => {
            let serviceparam = {
              name: plan.servicename,
              servicePlan: plan.plan.metadata.guid,
              parameter: this.setParmeterData(plan.serviceparameter, plan.hiddenserviceparameter),
              app_bind_parameter: this.setParmeterData(plan.appparameter, plan.hiddenappparameter),
              appGuid : plan.appbind ? '' : '(id_dummy)',
            };
            paramlist.push(serviceparam);
          });
          let param ={
            appSampleStartYn : this.appStart ? 'Y' : 'N',
            appSampleFileName: this.apptemplate[0]['appSampleFileName'],
            spaceId: this.space.guid,
            spaceName: this.space.name,
            orgName: this.org.name,
            appName: this.appname,
            name : this.appname,
            hostName: this.hostname,
            domainId: this.currentdomain.metadata.guid,
            memorySize : this.memory,
            diskSize : this.disk,
            buildPackName: this.apptemplate[0]['buildPackName'],
            appSampleFilePath : appSampleFilePath,
            servicePlanList : paramlist,
            catalogType : CATALOGURLConstant.STARTERPACK,
            catalogNo : this.template.no,
            userId : this.catalogService.getUserid()
          };
          this.catalogService.postApp(url, param).subscribe(data => {
            this.catalogService.isLoading(false);
            this.catalogService.alertMessage(this.translateEntities.result.appTemplateSusses, true);
            this.router.navigate(['dashboard']);
          }, error => {
            this.catalogService.isLoading(false);
            this.catalogService.alertMessage(this.translateEntities.result.appTemplateError, false);
          });
        }
      }, error => {
        this.catalogService.alertMessage(this.translateEntities.result.routeNameError, false);
        this.getRoutes();
        this.routecheck = CATALOGURLConstant.NO;
      });
    }, error => {
      this.catalogService.alertMessage(this.translateEntities.result.appNameError, false);
      this.getAppNames();
      this.namecheck = CATALOGURLConstant.NO;
    });
  }
}
