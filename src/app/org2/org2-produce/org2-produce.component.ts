import { Component, OnInit } from '@angular/core';
import {Org2ProduceService} from "./org2-produce.service";
import {Observable} from "rxjs/Observable";
import {OrgURLConstant} from "../../org/common/org.constant";
import {Parser} from "@angular/compiler";
import {_finally} from "rxjs/operator/finally";
import { TranslateService, LangChangeEvent, TranslationChangeEvent } from '@ngx-translate/core';
import {isNullOrUndefined} from "util";


declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-org2-produce',
  templateUrl: './org2-produce.component.html',
  styleUrls: ['./org2-produce.component.css']
})
export class Org2ProduceComponent implements OnInit {
  public orgname :string = '';
  public errorMessage: string = '';
  public orgnamelist: any;
  public orgquotalist : any = [];
  public isError : boolean;
  public aquota : any;

  public translateEntities: any = [];

  constructor(public orgService : Org2ProduceService, public translate: TranslateService) {
    this.translate.get('orgProduce').subscribe((res: string) => {
      this.translateEntities = res;
    });

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateEntities = event.translations.orgProduce;
    });
  }

  ngOnInit() {
    this.orgService.isLoding(true);
    this.doLayout();
    this.getOrgNameList();
    this.getOrgQuota();
    setTimeout(() => this.orgNameCheck(), 500);
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

  getOrgNameList() {
    let page = 1;
    this.orgService.getOrgNameList(OrgURLConstant.URLOrgListUsingToken + '-admin/' + page++).subscribe(data => {
      console.log(data);
      this.orgnamelist = new Array<any>();
      data['resources'].forEach(a => {
        this.orgnamelist.push(a.entity.name);
      });
      for(page; data.total_pages >= page ; page++){
        this.orgService.getOrgNameList(OrgURLConstant.URLOrgListUsingToken + '-admin/' + page).subscribe( data2 =>{
          data2['resources'].forEach(b => {
            this.orgnamelist.push(b.entity.name);
          });
        });
      }
    }, error => {
      this.serverError();
    },()=>{
      this.orgService.isLoding(false);
    });
  }
  getOrgQuota(){
    this.orgService.getOrgQuota(OrgURLConstant.URLOrgAvailableQuotasHead + OrgURLConstant.URLOrgAvailableQuotasTail).subscribe(data => {
      data['resources'].forEach(a => {
        a.entity.guid =  a.metadata.guid;
        this.orgquotalist.push(a.entity);
      });
      console.log(this.orgquotalist);
      this.aquota = this.orgquotalist[0];
      this.orgService.isLoding(false);
    }, error => {
      this.serverError();
    });
  }

  serverError(){
    this.orgService.alertSetting(this.translateEntities.alertLayer.serverError, false);
    this.orgService.back();
    this.orgService.isLoding(false);
  }

  orgNameCheck(){
    this.pattenTest();
    if ( isNullOrUndefined(this.orgname) || "" === this.orgname.trim()) {
      this.msgSetting('blue','red',true,this.translateEntities.alertLayer.orgNameCheck1);
      return;
    }
    if(this.orgnamelist.some(a=>{if(a === this.orgname){return true;} })){
      this.msgSetting('blue','red',true,this.translateEntities.alertLayer.orgNameCheck2);
      return;
    }
    this.msgSetting('red','blue',false,this.translateEntities.alertLayer.orgNameCheck3);
  }

  msgSetting(removeClass : string, addClass : string, isError : boolean, errorMessage : string){
    const msgElement = $('#action-info-message');
    msgElement.removeClass(removeClass);
    msgElement.addClass(addClass);
    this.isError = isError;
    this.errorMessage = errorMessage;
  }

  pattenTest(){
    const regExpPattern = /[\{\}\[\]\/?,;:|\)*~`!^+<>\#$%&\\\=\(\'\"]/gi;
    const regExpBlankPattern = /[\s]/g;
    const regKoreanPatten = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;
    $('#orgname').val($('#orgname').val().replace(regExpPattern, '')
      .replace(regExpBlankPattern, '')
      .replace(regKoreanPatten, '').substring(0, 64));
    this.orgname =$('#orgname').val();
  }

  createOrg(){
    this.orgNameCheck();
    const url = OrgURLConstant.URLOrgRequestBase + this.orgname + '/exist';
    const url2 = OrgURLConstant.URLOrgRequestBase;
    const body = {
      orgName: this.orgname,
      quotaGuid: this.aquota.guid,
      name : this.orgService.getuserId()
    };
    if (!this.isError) {
      this.orgService.isLoding(true);
    this.orgService.getOrgName(url).subscribe(data=>{
      if (data === false || data === 'false') {
        this.orgService.postOrg(url2, body).subscribe(data => {
          if(data.RESULT==='SUCCESS'){
            this.showPopAppStartClick();
          } else if(data.RESULT==='FAIL'){
            this.orgService.alertSetting(data.MSG, false);
          }
        },error => {
          this.isError = true;
        });
      } else if (data === true || data === 'true') {
        this.isError = true;
        this.errorMessage = this.translateEntities.alertLayer.orgNameCheck2;
      } else {
        this.isError = true;
        this.errorMessage = this.translateEntities.alertLayer.orgNameCheck4;
      }
    },error => {
      this.isError = true;
      this.errorMessage = this.translateEntities.alertLayer.serverError;
    },()=>{
      this.orgService.isLoding(false);
    });
    } else{
      this.showPopAppStartClick();
    }
  }

  limitvalue(value) : any{
    return value === -1 ? '무제한' : value;
  }

  quotaFree(value) : any{
    return value ? '무료' : '유료';
  }

  changeQuota(value){
    this.aquota = value;
  }
  whoQuota(value) : any{
    return value === this.aquota ? 'checked' : '';
  }
  isSelectedQuota(extQuota: any) {
    if (this.aquota !== null)
      return this.aquota.name === extQuota.name;
    else
      return false;
  }

  showPopAppStartClick() {
    $("#create-popup").modal("show");
  }

  goBack(){
    this.orgService.back();
  }
}

