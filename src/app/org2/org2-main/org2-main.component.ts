import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Org2MainService } from './org2-main.service';
import { Observable } from 'rxjs/Observable';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { CommonService } from "../../common/common.service";

declare var $: any;

@Component({
  selector: 'app-org2-main',
  templateUrl: './org2-main.component.html',
  styleUrls: ['./org2-main.component.css']
})
export class Org2MainComponent implements OnInit {

  public domainsEntities: Observable<any[]>;
  public quotaDefinitionsEntities: Observable<any[]>;
  public orgsEntities: Observable<any[]>;

  public sltEntity : any;
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
  public sltOrgRole : string;
  public sltOrgRoleId : string;
  public sltDelete : boolean;
  public pppp : string;

  private showIndexArray: Array<string> = [];

  public translateEntities: any = [];

  constructor(private route: ActivatedRoute, private router: Router, private translate: TranslateService, private orgMainService: Org2MainService, private common: CommonService) {
    this.common.isLoading = false;

    this.translate.get('orgMain').subscribe((res: string) => {
      this.translateEntities = res;
    });

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateEntities = event.translations.orgMain;
    });
  }

  ngOnInit() {
    console.log("ngOnInit in~");
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
    $("[id^='layerpop']").modal("hide");

    if(this.orgsEntities != undefined) {
      this.showIndexArray = [];
      let showArry: Array<string> = [];

      $.each(this.orgsEntities, function (key, dataobj) {
        if($("#detailBtn_close_"+dataobj.org.metadata.guid).css('display') == 'block') {
          showArry.push(dataobj.org.metadata.guid);
        }
      });
      this.showIndexArray = showArry;
    }

    this.getDomains();
    this.getQuotaDefinitions();
    this.getOrgList();
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

    this.orgMainService.getOrgList().subscribe(data => {
      this.orgsEntities = data.result;

      setTimeout(() => this.buttonEvent(), 100);
      this.common.isLoading = false;

      // if(this.sltIndex != undefined) {
      //   $(".btns6.colors4.organization_sw:eq("+this.sltIndex+")").trigger("click");
      // }
    });
  }

  detailClick(orgGuid, type) {
      var wrap_line = $(".organization_wrap");
      $("#detailBtn_"+type+"_"+orgGuid).parents(wrap_line).toggleClass("on");
      var updown = $("#detailBtn_"+type+"_"+orgGuid).children("i").attr('class');
      if( updown == 'fas fa-chevron-down' ){
        $("#detailBtn_view_"+orgGuid).hide();
        $("#detailBtn_close_"+orgGuid).show();
      } else {
        $("#detailBtn_close_"+orgGuid).hide();
        $("#detailBtn_view_"+orgGuid).show();
      }
  }

  buttonEvent() {
    // $(".organization_sw").on("click" , function(){
    //   var wrap_line = $(".organization_wrap");
    //   $(this).parents(wrap_line).toggleClass("on");
    //   var updown = $(this).children("i").attr('class');
    //   if( updown == 'fas fa-chevron-down' ){
    //     $(this).toggleClass("colors5");//.children("i").removeClass("fa-chevron-down").addClass("fa-chevron-up");
    //     console.log("=1=");
    //     console.log(this.translateEntities);
    //     $(this).html("<i class='fas fa-chevron-up'></i> "+this.translateEntities.closeDetail+"");
    //   } else {
    //     $(this).toggleClass("colors5");//.children("i").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    //     $(this).html("<i class='fas fa-chevron-down'></i> "+this.translateEntities.viewDetail+"");
    //   }
    // });

    //TODO 추후 변경??
    $("th .fa-edit,.table_edit .fa-edit").on("click" , function(){
      $("body > div").addClass('account_modify');
      $(this).toggleClass("on");
      $(this).parents("tr").next("tr").toggleClass("on");
      $(this).parents("tr").addClass("off");
    });

    $(".btns_sw").on("click" , function(){
      $(this).parents("tr").prev("tr").removeClass("off");
      $(this).parents("tr").prev("tr").find("i").toggleClass("on");
      $(this).parents("tr").toggleClass("on");
    });

    for(var i=0; $("[id^='domain_'] tbody").length > i; i++) {
      $("[id^='domain_']:eq("+i+") caption span").text($("[id^='domain_']:eq("+i+") tbody tr").length);
    }

    $(".organization_wrap").on("mouseenter" , function(){
      $(this).find(".organization_dot").addClass('on');
    });

    $(".organization_wrap").on("mouseleave" , function(){
      $(this).find(".organization_dot").removeClass('on');
      $(this).find(".organization_dot").children("ul").removeClass("on");
    });

    $(".organization_dot").on("click" , function(){
      $(this).children("ul").toggleClass("on");

      $(this).children("ul").children("li").eq(0).on("click" , function(){
        var ttt = $(this).find("div.organization_btn")
        $(this).parents(".pull-right").siblings(ttt).toggleClass("on");
      });
    });

    $(".yess2,.nos2").on("click" , function(){
      $(this).closest("div.organization_btn").removeClass("on");
    });

    if(this.showIndexArray != undefined) {
      for(var i = 0; i < this.showIndexArray.length; i++) {
        var wrap_line = $(".organization_wrap");
        $("#detailBtn_view_"+this.showIndexArray[i]).parents(wrap_line).toggleClass("on");
        $("#detailBtn_view_"+this.showIndexArray[i]).hide();
        $("#detailBtn_close_"+this.showIndexArray[i]).show();
      }
    }
  }

  instanceMemoryLimit(instance_memory_limit) {
    if (instance_memory_limit === -1)
      return '무제한';
    else
      return instance_memory_limit;
  }

  priceKorean(name): String {
    if (name.search('paid') >= 0) {
      return '유료';
    } else if (name.search('free') >= 0) {
      return '무료';
    } else {
      return '무료';
    }
  }

  applicationInstanceLimit(app_instance_limit) {
    if (app_instance_limit === -1)
      return '무제한';
    else
      return app_instance_limit;
  }

  replaceInvalidateString($event) {
    const regFirstExpPattern = /^[\{\}\[\]\/?,;:|\)*~`!^+<>\#\-_@$%&\\\=\(\'\"]+/g;
    const regExpPattern = /[\{\}\[\]\/?,;:|\)*~`!^+<>\#@$%&\\\=\(\'\"]/g;
    const regExpBlankPattern = /[\s]/g;
    const regKoreanPattern = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;

    let typingStr = $event.target.value.replace(regFirstExpPattern, '')
      .replace(regExpPattern, '').replace(regExpBlankPattern, '')
      .replace(regKoreanPattern, '').substring(0, 64);

    $event.target.value = typingStr;
  }

  showPopModifyOrgNameClick(orgGuid: string) {
    this.sltOrgGuid = orgGuid;
    this.sltOrgRename = $("#modifyOrgName_"+this.sltOrgGuid).val();
    $("#layerpop_org_rename").modal("show");
  }

  renameOrg() {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    let params = {
      guid: this.sltOrgGuid,
      newOrgName: this.sltOrgRename
    };

    this.orgMainService.renameOrg(params).subscribe(data => {
      if(data.result) {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.orgRenameSuccess, true);

        this.ngOnInit();
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.orgRenameFail+"<br><br>"+data.msg.description, false);
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
      if(data.result) {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.orgDeleteSuccess, true);

        this.ngOnInit();
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.orgDeleteFail+"<br><br>"+data.msg.description, false);
      }
    });
  }

  showPopSpaceCreateClick(sltOrgGuid: string) {
    this.sltOrgGuid = sltOrgGuid;
    $("#layerpop_space_create").modal("show");
  }

  createSpace() {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    let params = {
      orgGuid: this.sltOrgGuid,
      spaceName: $("#createSpaceName").val()
    };

    this.orgMainService.createSpace(params).subscribe(data => {
      $("#createSpaceName").val("");

      if(data.result) {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.createSpaceSuccess, true);

        this.ngOnInit();
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.createSpaceFail+"<br><br>"+data.msg.description, false);
      }
    });
  }

  showPopModifySpaceNameClick(spaceGuid: string) {
    this.sltSpaceGuid = spaceGuid;
    this.sltSpaceRename = $("#modifySpaceName_"+this.sltSpaceGuid).val();
    $("#layerpop_space_rename").modal("show");
  }

  renameSpace() {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    let params = {
      guid: this.sltSpaceGuid,
      newSpaceName: this.sltSpaceRename
    };

    this.orgMainService.renameSpace(params).subscribe(data => {
      if(data.result) {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.renameSpaceSuccess, true);

        this.ngOnInit();
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.renameSpaceFail+"<br><br>"+data.msg.description, false);
      }
    });
  }

  showPopDeleteSpaceClick(spaceGuid: string, spaceName: string) {
    this.sltSpaceGuid = spaceGuid;
    this.sltSpaceDelname = spaceName;
    $("#layerpop_space_delete").modal("show");
  }

  deleteSpace() {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    this.orgMainService.deleteSpace(this.sltSpaceGuid, true).subscribe(data => {
      if(data.result) {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.deleteSpaceSuccess, true);

        this.ngOnInit();
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.deleteSpaceFail+"<br><br>"+data.msg.description, false);
      }
    });
  }

  showPopAddDomainClick(orgGuid: string) {
    this.sltOrgGuid = orgGuid;
    $("#layerpop_domain_add").modal("show");
  }

  addDmaoin() {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    let params = {
      orgId: this.sltOrgGuid,
      domainName: $("#addDmaoinName").val()
    };

    this.orgMainService.addDmaoin(params).subscribe(data => {
      $("#addDmaoinName").val("");

      if(data.result) {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.addDomainSuccess, true);

        this.ngOnInit();
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.addDomainFail+"<br><br>"+data.msg.description, false);
      }
    });
  }

  showPopDelDomainClick(orgGuid: string, domainName: string) {
    this.sltOrgGuid = orgGuid;
    this.sltDomainName = domainName;
    $("#layerpop_domain_delete").modal("show");
  }

  deleteDmaoin() {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    this.orgMainService.deleteDmaoin(this.sltOrgGuid, this.sltDomainName).subscribe(data => {
      if(data.result) {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.deleteDomainSuccess, true);

        this.ngOnInit();
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.deleteDomainFail+"<br><br>"+data.msg.description, false);
      }
    });
  }

  showPopChangeQuotaClick(orgGuid: string, sltQuotaGuid: string, quotaGuid: string, sltIndex: number) {
    this.sltIndex = sltIndex;
    if(sltQuotaGuid == quotaGuid){
      return false;
    }

    this.sltOrgGuid = orgGuid;
    this.sltQuotaGuid = quotaGuid;
    $("#layerpop_quota_change").modal("show");
  }

  changeQuota() {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    let params = {
      quotaGuid: this.sltQuotaGuid
    };

    this.orgMainService.changeQuota(this.sltOrgGuid, params).subscribe(data => {
      if(data.result) {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.changeQuotaSuccess, true);

        this.ngOnInit();
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.changeQuotaFail+"<br><br>"+data.msg.description, false);
      }
    });
  }

  changeQuotaCancel() {
    $("[id^='layerpop']").modal("hide");
    // $("[name='quota_radio_"+this.sltIndex+"']").parent().parent().filter('.cur').children().eq(0).find('input').trigger("click");
    $("[name='quota_radio_"+this.sltIndex+"'][data-default='true']").trigger("click");
  }

  goOrgCreate(){
    this.router.navigate(['orgproduce']);
  }

  showMemberSetOrgRole(user, role, org, orgrole, value){
    this.sltDelete = $("#"+value+"").is(":checked");
    if(!this.authorityCheck(role)){
      this.common.alertMessage(this.translateEntities.alertLayer.orgRoleError,false);
        $("#"+value+"").prop("checked", !this.sltDelete);
      return;
    }
    this.sltOrgRoleId = value;
    this.sltUserGuid = user.user_id;
    this.sltMemberName = user.user_email;
    this.sltOrgGuid = org;
    this.sltOrgRole=orgrole;
    console.log(this.sltOrgRole);
    console.log(this.SltOrgRoleName);
    $("#layerpop_org_set_role").modal("show");
  }

  memberSetOrgRole(){
    let body ={
      userId : this.sltUserGuid,
      role : this.sltOrgRole
    }
    this.common.isLoading=true;
    if(this.sltDelete){
      this.orgMainService.changeOrgUserRole(this.sltOrgGuid,body).subscribe(data => {
        this.common.alertMessage(this.translateEntities.alertLayer.orgRoleChangeSuccess, true);

        this.ngOnInit();
      },error=>{
        this.common.alertMessage(this.translateEntities.alertLayer.orgRoleChangeFail, false);
        this.cancelMemberSetOrgRole();
        this.common.isLoading=false;
      },()=>{
        this.common.isLoading=false;
      });
    }else{
      this.orgMainService.delOrgUserRole(this.sltOrgGuid,body).subscribe(data => {
        this.common.alertMessage(this.translateEntities.alertLayer.orgRoleChangeSuccess, true);

        this.ngOnInit();
      },error=>{
        this.common.alertMessage(this.translateEntities.alertLayer.orgRoleChangeFail, false);
        this.cancelMemberSetOrgRole();
        this.common.isLoading=false;
      },()=>{
        this.common.isLoading=false;
      });
    }
  }

  cancelMemberSetOrgRole(){
    $("#"+this.sltOrgRoleId+"").prop("checked", !this.sltDelete);
  }


  showMemberCancel(user, role, org){
    if(!this.authorityCheck(role)){
      this.common.alertMessage(this.translateEntities.alertLayer.orgRoleError,false);
      return;
    }
    this.sltUserGuid = user.user_id;
    this.sltMemberName = user.user_email;
    this.sltOrgGuid = org;
    $("#layerpop_member_cancel").modal("show");

  }

  memberCancel(){
    this.common.isLoading = true;
    this.orgMainService.delMemberCancel(this.sltOrgGuid,this.sltUserGuid).subscribe(data => {
      this.common.alertMessage(this.translateEntities.alertLayer.memberCancelSuccess, true);
      this.getOrgList();
    },error => {
      this.common.alertMessage(this.translateEntities.alertLayer.memberCancelFail, true);
    },()=>{
      this.common.isLoading = false;
    });
  }

  get SltOrgRoleName() : string{
    switch(this.sltOrgRole){
      case 'OrgManager' : return ''+this.translateEntities.orgAdmin+'';
      case 'BillingManager' : return ''+this.translateEntities.orgBillingManager+'';
      case 'OrgAuditor' : return ''+this.translateEntities.orgObserver+'';
    }
  }

  allCheck(){
    $(".checkAll2").prop('checked', false);
    $(".checkAll").change(function() {
      $(".checkSel").prop('checked', $(this).prop("checked"));
    });
    $(".checkSel").change(function() {
      var allcount = $(".checkSel").length;
      var ckcount = $(".checkSel:checked").length;
      $(".checkAll").prop('checked', false);
      if (allcount == ckcount) {
        $(".checkAll").prop('checked', true);
      };
    });
    $(".checkAll2").change(function() {
      $(".checkSel2").prop('checked', $(this).prop("checked"));
    });
    $(".checkSel2").change(function() {
      var allcount = $(".checkSel2").length;
      var ckcount = $(".checkSel2:checked").length;
      $(".checkAll2").prop('checked', false);
      if (allcount == ckcount) {
        $(".checkAll2").prop('checked', true);
      };
    });
  }

  showUserInvite(value){
    this.sltEntity = value;
    console.log(this.sltEntity);
    $("[id='userEmail']").val('');
  $("#layerpop4").modal("show");
    setTimeout(() => this.allCheck(), 500);
  }

  userInvite(){
    this.common.isLoading = true;

    var inviteObj = {};
    var inviteObjOrg = [];
    var inviteObjSpace = [];
    var orgObj = {};
    var spaceObj = {};

    orgObj = {
      "om" : $("[id^='modal1']").is(":checked"),
      "bm" : $("[id^='modal2']").is(":checked"),
      "oa" : $("[id^='modal3']").is(":checked")
    };
    inviteObjOrg.push(orgObj);
    inviteObj["org"] = inviteObjOrg;
    console.log(inviteObj);
    for(var i = 0; i < this.sltEntity.space.resources.length; i++ ) {
      var spaceGuid = this.sltEntity.space.resources[i].metadata.guid;
      var spaceRoleObj = {};
      var roleObjSpace = [];

      spaceRoleObj = {
        "sm" : $("[id^='modal4_']").eq(i).is(":checked"),
        "sd" : $("[id^='modal5_']").eq(i).is(":checked"),
        "sa" : $("[id^='modal6_']").eq(i).is(":checked")
      };
      roleObjSpace.push(spaceRoleObj);
      spaceObj[spaceGuid] = roleObjSpace;
    }
    inviteObjSpace.push(spaceObj);
    inviteObj["space"] = inviteObjSpace;

    let params = {
      orgName: this.sltEntity.org.entity.name,
      orgId: this.sltEntity.org.metadata.guid,
      refreshToken: this.common.getRefreshToken(),
      userEmail: $("[id='userEmail']").val(),
      userRole: JSON.stringify(inviteObj)
    };
    this.orgMainService.userInviteEmailSend(params).subscribe(data => {
      if(data) {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.sendEmailSuccess, true);
      }
    }, error => {
      this.common.alertMessage(this.translateEntities.alertLayer.sendEmailFail+"<br><br>"+error, false);
    });
  }



  //OrgManager 체크
  authorityCheck(role) : boolean {
    return role.some(myrole => {
      if(myrole.user_email === this.common.getUserid()){
        return myrole.roles.some(value => {if(value === 'OrgManager'){ return true; } });
      }});
  }

}
