import { Component, OnInit, Injectable,
  Injector,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  ApplicationRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrgMainService } from './org-main.service';
import { Observable } from 'rxjs/Observable';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { CommonService } from "../../common/common.service";
import {OrgTempComponent} from "../org-temp/org-temp.component";


declare var $: any;

@Component({
  selector: 'app-org2-main',
  templateUrl: './org-main.component.html',
  styleUrls: ['./org-main.component.css']
})
export class OrgMainComponent implements OnInit {

  public domainsEntities: Observable<any[]>;
  public quotaDefinitionsEntities: Observable<any[]>;
  public orgsEntities: any;
  public orgsDetailEntities: any;
  public inviteOrgList: Observable<any[]>;

  public sltEntity: any;
  public sltIndex: number;
  public sltOrgGuid: string;
  public sltOrgRename: string;
  public sltOrgDelname: string;
  public sltSpaceGuid: string;
  public sltSpaceRename: string;
  public sltSpaceDelname: string;
  public sltDomainName: string;
  public sltQuotaGuid: string;
  public sltMemberName: string;
  public sltUserGuid: string;
  public sltOrgRole: string;
  public sltOrgRoleId: string;
  public sltDelete: boolean;
  public sltInvite: any;
  public sltSpaceRole : any;
  public sltSpaceName : string;
  public sltflag : boolean = false;
  public sltplus : boolean = false;
  private showIndexArray: Array<string> = [];
  private sltPage : number;

  public translateEntities: any = [];

  constructor(private route: ActivatedRoute, private router: Router, private translate: TranslateService, private orgMainService: OrgMainService, private common: CommonService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector) {
    this.common.isLoading = false;

    this.translate.get('orgMain').subscribe((res: string) => {
      this.translateEntities = res;
    });

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateEntities = event.translations.orgMain;
    });
    this.sltPage = 1;
  }

  ngOnInit() {
    $(document).ready(() => {
      //TODO 임시로...
      $.getScript("../../assets/resources/js/common2.js")
        .done(function (script, textStatus) {
        })
        .fail(function (jqxhr, settings, exception) {
        });
    });
    $("[id^='layerpop']").modal("hide");

    if (this.orgsEntities != undefined) {
      this.showIndexArray = [];
      let showArry: Array<string> = [];

      $.each(this.orgsEntities, function (key, dataobj) {
        if ($("#detailBtn_close_" + dataobj.org.metadata.guid).css('display') == 'block') {
          showArry.push(dataobj.org.metadata.guid);
        }
      });
      this.showIndexArray = showArry;
    }
    if(this.showIndexArray.length > 0) {
      $(".wrap > [id^='layerpop']").remove();
    }

    this.getOrgFlag();
    this.getDomains();
    this.getQuotaDefinitions();
    this.getOrgList();

    //this.getInviteOrg();
  }

  getOrgFlag(){
    this.orgMainService.getOrgFlag().subscribe(data => {
      if(data.RESULT){
        this.sltflag = true;
      } else {
        this.sltflag = false;
      }
    });
  }


  getDomains() {
    this.orgMainService.getDomains().subscribe(data => {
      this.domainsEntities = data.resources;
    });
  }

  getQuotaDefinitions() {
    this.orgMainService.getQuotaDefinitions().subscribe(data => {
      this.quotaDefinitionsEntities = data.resources;
    });
  }

  getOrgList() {
    this.common.isLoading = true;
    this.orgMainService.getInviteOrg().subscribe(data => {
      this.inviteOrgList = data.result;
    });
    this.orgMainService.getOrgList(1).subscribe(data => {
      this.orgsEntities = data.result;
      if(this.orgsEntities.length < 10){
        this.sltplus = false;
      } else {
        this.sltplus = true;
      }
      if (this.orgsEntities) {
        this.sltEntity = this.orgsEntities[0];
      }

      if(this.sltPage >= 2) {
        for(let i = 2; i <= this.sltPage ; i++){
          this.addOrgList(i,'init');
        }
      } else {
        setTimeout(() => this.buttonEvent(), 100);
      }

      if(this.sltPage ===1){
        this.common.isLoading = false;
      }
    });
  }

  detailClick(orgGuid, orgName, type, index) {
    if (type == "view") {
      if($("#orgList_"+orgGuid).next().length == 0) {
        this.common.isLoading = true;
        this.orgMainService.getOrgDetail(orgGuid).subscribe(data => {
          $("#detailBtn_" + type + "_" + orgGuid).parents($(".organization_wrap")).toggleClass("on");
          this.orgsDetailEntities = data.result;

          const componentFactory = this.componentFactoryResolver.resolveComponentFactory(OrgTempComponent);
          const componentRef = componentFactory.create(this.injector);
          (<OrgTempComponent>componentRef.instance).orgsDetailEntities = this.orgsDetailEntities;
          (<OrgTempComponent>componentRef.instance).sltEntity = this.orgsDetailEntities;
          (<OrgTempComponent>componentRef.instance).orgsDetailGuid = orgGuid;
          (<OrgTempComponent>componentRef.instance).sltOrgGuid = orgGuid;
          (<OrgTempComponent>componentRef.instance).orgsDetailName = orgName;
          (<OrgTempComponent>componentRef.instance).orgsDetailIndex = index;
          (<OrgTempComponent>componentRef.instance).domainsEntities = this.domainsEntities;
          (<OrgTempComponent>componentRef.instance).inviteOrgList = this.inviteOrgList;
          (<OrgTempComponent>componentRef.instance).quotaDefinitionsEntities = this.quotaDefinitionsEntities;
          (<OrgTempComponent>componentRef.instance).sltOrgRename = this.sltOrgRename;

          this.appRef.attachView(componentRef.hostView);

          const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

          for(var i=0; i<domElem.childNodes.length; i++) {
            if(i == 0) {
              $("#orgList_"+orgGuid).parent().append(domElem.childNodes[i]);
            } else {
              $(".wrap").append(domElem.childNodes[i]);
            }
          }
          // $("#orgList_"+orgGuid).parent().append(domElem.firstChild);

          this.common.isLoading = false;

          $("#detailBtn_view_" + orgGuid).hide();
          $("#detailBtn_close_" + orgGuid).show();
        });
      } else {
        $("#detailBtn_" + type + "_" + orgGuid).parents($(".organization_wrap")).toggleClass("on");
        $("#detailBtn_view_" + orgGuid).hide();
        $("#detailBtn_close_" + orgGuid).show();
      }
    } else {
      $("#detailBtn_" + type + "_" + orgGuid).parents($(".organization_wrap")).toggleClass("on");
      $("#detailBtn_close_" + orgGuid).hide();
      $("#detailBtn_view_" + orgGuid).show();
    }
  }

  buttonEvent() {
    //TODO 추후 변경??
    $("th .fa-edit,.table_edit .fa-edit").on("click", function () {
      $("body > div").addClass('account_modify');
      $(this).toggleClass("on");
      $(this).parents("tr").next("tr").toggleClass("on");
      $(this).parents("tr").addClass("off");
    });

    $(".btns_sw").on("click", function () {
      $(this).parents("tr").prev("tr").removeClass("off");
      $(this).parents("tr").prev("tr").find("i").toggleClass("on");
      $(this).parents("tr").toggleClass("on");
    });

    for (var i = 0; $("[id^='domain_'] tbody").length > i; i++) {
      $("[id^='domain_']:eq(" + i + ") caption span").text($("[id^='domain_']:eq(" + i + ") tbody tr").length);
    }

    $(".organization_wrap").on("mouseenter", function () {
      $(this).find(".organization_dot").addClass('on');
    });

    $(".organization_wrap").on("mouseleave", function () {
      $(this).find(".organization_dot").removeClass('on');
      $(this).find(".organization_dot").children("ul").removeClass("on");
    });

    $(".organization_dot").on("click", function () {
      $(this).children("ul").toggleClass("on");

      $(this).children("ul").children("li").eq(0).on("click", function () {
        var ttt = $(this).find("div.organization_btn")
        $(this).parents(".pull-right").siblings(ttt).toggleClass("on");
      });
    });

    $(".yess2,.nos2").on("click", function () {
      $(this).closest("div.organization_btn").removeClass("on");
    });

    if (this.showIndexArray != undefined) {
      for (var i = 0; i < this.showIndexArray.length; i++) {
        var orgName = $("#orgList_"+this.showIndexArray[i]+" .tit").text();
        var index = $("[id^='orgList_']").index($("#orgList_"+this.showIndexArray[i]));

        this.detailClick(this.showIndexArray[i], orgName, "view", index);
      }
    }
  }

  replaceInvalidateString($event) {
    //const regFirstExpPattern = /^[\{\}\[\]\/?,;:|\)*~`!^+<>\#\-_@$%&\\\=\(\'\"]+/g;
    const regExpPattern = /[\{\}\[\]\/?,;:|\)*~`!^+<>\#$%&\\\=\(\'\"]/g;

    let typingStr = $event.target.value.replace(regExpPattern, '').substring(0, 64);

    $event.target.value = typingStr;
  }

  showPopModifyOrgNameClick(orgGuid: string) {
    this.sltOrgGuid = orgGuid;
    this.sltOrgRename = $("#modifyOrgName_" + this.sltOrgGuid).val();
    $("#layerpop_org_rename").modal("show");
    setTimeout(() => {$("#createSpaceName").focus()}, 250);
  }

  renameOrg() {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    let params = {
      guid: this.sltOrgGuid,
      newOrgName: this.sltOrgRename
    };

    this.orgMainService.renameOrg(params).subscribe(data => {
      if (data.result) {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.orgRenameSuccess, true);

        this.ngOnInit();
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.orgRenameFail + "<br><br>" + data.msg.description, false);
      }
    });
  }

  showPopDeleteOrgClick(orgGuid: string, orgName: string) {
    this.sltOrgGuid = orgGuid;
    this.sltOrgDelname = orgName;
    $("#layerpop_org_delete").modal("show");

  }

  deleteOrg() {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;
    this.orgMainService.deleteOrg(this.sltOrgGuid, true).subscribe(data => {
      if (data.result) {
        this.common.alertMessage(this.translateEntities.alertLayer.orgDeleteSuccess, true);
        setTimeout(()=>this.ngOnInit(), 3500);
        $("#detailBtn_close" + "_" + this.sltOrgGuid).parents($(".organization_wrap")).toggleClass("on");
        $("#detailBtn_close_" + this.sltOrgGuid).hide();
        $("#detailBtn_view_" + this.sltOrgGuid).show();
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.orgDeleteFail + "<br><br>" + data.msg.description, false);
      }
    });
  }

  goOrgCreate() {
    this.router.navigate(['orgproduce']);
  }

  addOrgList(_page : number, type : string){
    let page;
    if(type === 'click'){
      this.common.isLoading = true;
      this.sltPage++;
      page = this.sltPage;
    }else if(type === 'init'){
      page = _page;
    }
    this.orgMainService.getOrgList(page).subscribe(data => {
        if(data.result.length < 10){
          this.sltplus = false;
        } else {
          this.sltplus = true;
        }
      data.result.forEach(resource => {
        this.orgsEntities.push(resource);
      });
      setTimeout(() => this.buttonEvent(), 100);
      if(type ==='click'){
        this.common.isLoading = false;
      }else if(type ==='init' && _page === this.sltPage){
        this.common.isLoading = false;
      }
    }, error => {
      this.sltPage--;
      if(type ==='click'){
        this.common.isLoading = false;
      }
    });
  }

}
