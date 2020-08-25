import {Component, OnInit, Input, Output, EventEmitter, AfterViewChecked} from '@angular/core';
import {CommonService} from "../../common/common.service";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {OrgMainService} from "../org-main/org-main.service";
import {Observable} from "../../../../node_modules/rxjs/Observable";
import {OrgMainComponent} from '../org-main/org-main.component';
import {NGXLogger} from "ngx-logger";

declare var $: any;

@Component({
  selector: 'app-org-temp',
  templateUrl: './org-temp.component.html',
  styleUrls: ['./org-temp.component.css']
})
export class OrgTempComponent implements OnInit, AfterViewChecked {

  @Input() orgsDetailEntities: any;
  @Input() domainsEntities: any;
  @Input() orgsDetailGuid: string;
  @Input() sltOrgGuid: string;
  @Input() orgsDetailName: string;
  @Input() orgsDetailIndex: number;
  @Input() inviteOrgList: Observable<any[]>;
  @Input() quotaDefinitionsEntities: Observable<any[]>;


  private emailCheck = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
  public sltEntity: any;
  public sltIndex: number;
  // public sltOrgGuid: string;
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
  public userName : Array<string> = [];
  public translateEntities: any = [];
  public invite_name : string = '';
  constructor(private translate: TranslateService, private orgMainService: OrgMainService, private common: CommonService, private log: NGXLogger) {
    this.common.isLoading = false;
    this.portalGetAllUserName();

    this.translate.get('orgMain').subscribe((res: string) => {
      this.translateEntities = res;
    });

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateEntities = event.translations.orgMain;
    });
    this.sltPage = 1;
  }

  ngOnInit() {
  }

  ngOnInit2() {
    $("#init").trigger("click");
  }

  ngAfterViewChecked() {
    for (var i = 0; $("[id^='domain_'] tbody").length > i; i++) {
      $("[id^='domain_']:eq(" + i + ") caption span").text($("[id^='domain_']:eq(" + i + ") tbody tr").length);
    }

    $("th .fa-edit,.table_edit .fa-edit").on("click", function () {
      $("body > div").addClass('account_modify');
      $(this).toggleClass("on");
      $(this).parents("tr").next("tr").toggleClass("on");
      $(this).parents("tr").addClass("off");
    });
  }

  getUserSpaceRoles(item: any, spaceid: string, spacename : string) {
    this.common.isLoading=true;
    this.sltEntity = item;
    this.sltSpaceName = spacename;
    this.sltSpaceGuid = spaceid;
    this.orgMainService.getUserSpaceRoles(this.sltSpaceGuid).subscribe(data => {
      this.sltSpaceRole = data.resources;
      let spaceRole = data.resources;
      $(".checkSel5").prop('checked', false);
      this.sltEntity.userRoles.user_roles.forEach(function (role, index) {
        let username = role.user_email;
        spaceRole.some(model => {
          if(model.entity.username===username){
            model.entity.space_roles.filter(space_role => {
              switch (space_role){
                case 'space_manager' : $("#modal10_" + index).prop('checked', true); break;
                case 'space_developer' : $("#modal11_" + index).prop('checked', true); break;
                case 'space_auditor' : $("#modal12_" + index).prop('checked', true); break;
              }});
            return true;
          }});});
      setTimeout(() => this.allCheck3(), 500);
      $("#layerpop_SpaceRole_"+this.orgsDetailGuid).modal("show");
    },error=>{
    },() => {
      this.common.isLoading=false;
    });
  }

  allCheck3() {
    $(".checkAll5").change(function () {
      $(".checkSel5").prop('checked', $(this).prop("checked"));
    });

    $(".checkSel5").change(function () {
      var allcount = $(".checkSel5").length;
      var ckcount = $(".checkSel5:checked").length;
      $(".checkAll5").prop('checked', false);
      if (allcount == ckcount) {
        $(".checkAll5").prop('checked', true);
      }});
  }

  showPopDeleteSpaceClick(orgGuid: string, spaceGuid: string, spaceName: string) {
    this.sltSpaceGuid = spaceGuid;
    this.sltSpaceDelname = spaceName;
    $("#layerpop_space_delete_"+orgGuid).modal("show");
  }

  replaceInvalidateString($event) {
    //const regFirstExpPattern = /^[\{\}\[\]\/?,;:|\)*~`!^+<>\#\-_@$%&\\\=\(\'\"]+/g;
    const regExpPattern = /[\{\}\[\]\/?,;:|\)*~`!^+<>\#$%&\\\=\(\'\"]/g;

    let typingStr = $event.target.value.replace(regExpPattern, '').substring(0, 64);

    $event.target.value = typingStr;
  }

  showMemberSetOrgRole(user, role, org, orgrole, value) {
    this.sltDelete = $("#" + value + "").is(":checked");
    if (!this.managerCheck(role)) {
      this.common.alertMessage(this.translateEntities.alertLayer.orgRoleError, false);
      $("#" + value + "").prop("checked", !this.sltDelete);
      return;
    }
    this.sltOrgRoleId = value;
    this.sltUserGuid = user.user_id;
    this.sltMemberName = user.user_email;
    this.sltOrgGuid = org;
    this.sltOrgRole = orgrole;
    $("#layerpop_org_set_role_"+this.orgsDetailGuid).modal("show");
  }

  //OrgManager 체크
  managerCheck(role): boolean {
    return role.some(myrole => {
      if (myrole.user_email === this.common.getUserid()) {
        return myrole.roles.some(value => {
          if (value === 'OrgManager') {
            return true;
          }});}
    });
  }

  getinviteOrgRole(value: any) {
    return JSON.parse(value).org[0];
  }

  instanceMemoryLimit(instance_memory_limit) {
    if (instance_memory_limit === -1)
      return '무제한';
    else {
      if (instance_memory_limit >= 1024) {
        return  Math.round(instance_memory_limit/1024) + 'G';
      }
  else
    {
      return instance_memory_limit + 'M';
    }
  }
  }

  priceKorean(price : boolean): String {
    if(price){
      return '무료';
    } else {
      return '유료';
    }
  }

  applicationInstanceLimit(app_instance_limit) {
    if (app_instance_limit === -1)
      return '무제한';
    else
      return app_instance_limit;
  }

  showUserInvite() {
    if (!this.managerCheck(this.sltEntity.userRoles.user_roles)) {
      this.common.alertMessage(this.translateEntities.alertLayer.orgRoleError, false);
      return;
    }
    this.invite_name = '';
    $("#layerpop4_"+this.orgsDetailGuid).modal("show");
    setTimeout(() => {
      this.allCheck();
      $("#userEmail").trigger('focus');
    },500);
  }

  allCheck() {
    $(".checkAll2").prop('checked', false);
    $(".checkAll").change(function () {
      $(".checkSel").prop('checked', $(this).prop("checked"));
    });
    $(".checkSel").change(function () {
      var allcount = $(".checkSel").length;
      var ckcount = $(".checkSel:checked").length;
      $(".checkAll").prop('checked', false);
      if (allcount == ckcount) {
        $(".checkAll").prop('checked', true);
      }
      ;
    });
    $(".checkAll2").change(function () {
      $(".checkSel2").prop('checked', $(this).prop("checked"));
    });
    $(".checkSel2").change(function () {
      var allcount = $(".checkSel2").length;
      var ckcount = $(".checkSel2:checked").length;
      $(".checkAll2").prop('checked', false);
      if (allcount == ckcount) {
        $(".checkAll2").prop('checked', true);
      }
      ;
    });
  }

  createSpace() {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    let params = {
      userId: this.common.getUserGuid(),
      orgGuid: this.sltOrgGuid,
      spaceName: $("#createSpaceName").val()
    };

    this.orgMainService.createSpace(params).subscribe(data => {
      $("#createSpaceName").val("");

      if (data.result) {
        this.common.alertMessage(this.translateEntities.alertLayer.createSpaceSuccess, true);
        this.ngOnInit2();
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.createSpaceFail + "<br><br>" + data.msg.description, false);
      }
    }, error1 => {},() => {
      this.common.isLoading = false;
    });
  }

  getSpace(guid : string){
    this.orgMainService.getSpace(guid).subscribe(data => {
      this.orgsDetailEntities.space = data.spaceList;
    });
  }

  renameSpace() {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    let params = {
      guid: this.sltSpaceGuid,
      newSpaceName: this.sltSpaceRename
    };

    this.orgMainService.renameSpace(params).subscribe(data => {
      if (data.result) {
        this.common.alertMessage(this.translateEntities.alertLayer.renameSpaceSuccess, true);
        setTimeout(() => this.ngOnInit2(), 3000);
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.renameSpaceFail + "<br><br>" + data.msg.description, false);
      }
    }, error1 => {},() => {
      this.common.isLoading = false;
    });
  }

  deleteSpace() {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    this.orgMainService.deleteSpace(this.sltSpaceGuid, true).subscribe(data => {
      if (data.result) {
        this.common.alertMessage(this.translateEntities.alertLayer.deleteSpaceSuccess, true);
        setTimeout(() => this.ngOnInit2(), 3000);
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.deleteSpaceFail + "<br><br>" + data.msg.description, false);
      }
    } ,error1 => {},() => {
      this.common.isLoading = false;
    });
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

      if (data.result) {
        this.common.alertMessage(this.translateEntities.alertLayer.addDomainSuccess, true);

        this.ngOnInit2();
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.addDomainFail + "<br><br>" + data.msg.description, false);
      }
    },error1 => {},() => {
      this.common.isLoading = false;
    });
  }

  deleteDmaoin() {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    this.orgMainService.deleteDmaoin(this.sltOrgGuid, this.sltDomainName).subscribe(data => {
      if (data.result) {
        this.common.alertMessage(this.translateEntities.alertLayer.deleteDomainSuccess, true);
        setTimeout(() => this.ngOnInit2(), 3000);
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.deleteDomainFail + "<br><br>" + data.msg.description, false);
      }
    },error1 => {},() => {
      this.common.isLoading = false;
    });
  }

  changeQuotaCancel() {
    $("[id^='layerpop']").modal("hide");
    // $("[name='quota_radio_"+this.sltIndex+"']").parent().parent().filter('.cur').children().eq(0).find('input').trigger("click");
    $("[name='quota_radio_" + this.sltIndex + "'][data-default='true']").trigger("click");
  }

  changeQuota() {
    $("[id^='layerpop']").modal("hide");
    this.common.isLoading = true;

    let params = {
      quotaGuid: this.sltQuotaGuid
    };

    this.orgMainService.changeQuota(this.sltOrgGuid, params).subscribe(data => {
      if (data.result) {
        this.common.alertMessage(this.translateEntities.alertLayer.changeQuotaSuccess, true);
        this.ngOnInit2();
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.changeQuotaFail + "<br><br>" + data.msg.description, false);
      }
    });
  }

  memberCancel() {
    let users =  this.orgsDetailEntities.userRoles.user_roles;
    if(users.length > 1){
      this.common.isLoading = true;
      this.orgMainService.delMemberCancel(this.sltOrgGuid, this.sltUserGuid).subscribe(data => {
        this.common.alertMessage(this.translateEntities.alertLayer.memberCancelSuccess, true);
        this.ngOnInit2();
      }, error => {
        this.common.alertMessage(this.translateEntities.alertLayer.memberCancelFail, false);
      }, () => {
        this.common.isLoading = false;
      });
    }else{
      this.common.alertMessage(this.translateEntities.alertLayer.memberCancelFail2, false);
    }

  }

  cancelMemberSetOrgRole() {
    $("#" + this.sltOrgRoleId + "").prop("checked", !this.sltDelete);
  }

  userInvite() {
    if(!this.usercheck()){
      this.common.alertMessage(this.translateEntities.alertLayer.checkEmail, false);
      return;
    }
    var inviteObj = {};
    var inviteObjOrg = [];
    var inviteObjSpace = [];
    var orgObj = {};
    var spaceObj = {};

    orgObj = {
      "om": $("#modal1").is(":checked"),
      "bm": $("#modal2").is(":checked"),
      "oa": $("#modal3").is(":checked")
    };
    inviteObjOrg.push(orgObj);
    inviteObj["org"] = inviteObjOrg;
    this.sltEntity.space.resources.forEach(function (data, index) {
      var spaceGuid = data.metadata.guid;
      var spaceRoleObj = {};
      var roleObjSpace = [];

      spaceRoleObj = {
        "sm": $("[id^='modal4_']").eq(index).is(":checked"),
        "sd": $("[id^='modal5_']").eq(index).is(":checked"),
        "sa": $("[id^='modal6_']").eq(index).is(":checked")
      };
      roleObjSpace.push(spaceRoleObj);
      spaceObj[spaceGuid] = roleObjSpace;
    });
    inviteObjSpace.push(spaceObj);
    inviteObj["space"] = inviteObjSpace;
    this.common.isLoading = true;

    let params = {
      orgName: this.orgsDetailName,
      orgId: this.orgsDetailGuid,
      refreshToken: this.common.getRefreshToken(),
      userEmail: this.invite_name,
      userRole: JSON.stringify(inviteObj),
      invitename: this.common.getUserid(),
      seq : this.common.getSeq()
    };

    /*userInviteEmailSend*/
    this.common.getInfra(this.common.getSeq()).subscribe(infra => {
      this.common.doPostMulti(infra['apiUri']+'/commonapi/v3/email/inviteOrg', infra['authorization'], params, '').subscribe(data => {
        if (data) {
          this.common.alertMessage(this.translateEntities.alertLayer.sendEmailSuccess, true);
        }
      }, error => {
        this.common.alertMessage(this.translateEntities.alertLayer.sendEmailFail + "<br><br>" + error, false);
      }, () => {
        $("#layerpop4_"+this.orgsDetailGuid).modal("hide");
        this.getInviteOrg();
      });
    });

  }


  memberSetOrgRole() {
    let body = {
      userId: this.sltUserGuid,
      role: this.sltOrgRole
    }
    this.common.isLoading = true;
    if (this.sltDelete) {
      this.orgMainService.changeOrgUserRole(this.sltOrgGuid, body).subscribe(data => {
        this.common.alertMessage(this.translateEntities.alertLayer.orgRoleChangeSuccess, true);

        this.ngOnInit2();
      }, error => {
        this.common.alertMessage(this.translateEntities.alertLayer.orgRoleChangeFail, false);
        this.cancelMemberSetOrgRole();
        this.common.isLoading = false;
      }, () => {

      });
    } else {
      this.orgMainService.delOrgUserRole(this.sltOrgGuid, body).subscribe(data => {
        this.common.alertMessage(this.translateEntities.alertLayer.orgRoleChangeSuccess, true);

        this.ngOnInit2();
      }, error => {
        this.common.alertMessage(this.translateEntities.alertLayer.orgRoleChangeFail, false);
        this.cancelMemberSetOrgRole();
        this.common.isLoading = false;
      }, () => {

      });
    }
  }

  inviteCancel() {
    this.common.isLoading = true;
    this.orgMainService.delInviteCancle(this.sltOrgGuid, this.sltInvite.userId).subscribe(data => {
      if (data) {
        this.common.alertMessage("초대 취소 성공", true);
      }
      else {
        this.common.alertMessage("초대 취소 실패", false);
      }
    }, error => {
      this.common.alertMessage("서버 오류", false);
    }, () => {
      this.getInviteOrg();
    });
  }

  getInviteOrg() {
    this.common.isLoading = true;
    this.orgMainService.getInviteOrg().subscribe(data => {
      this.inviteOrgList = data.result;
    },error => {

    }, () => {
      this.common.isLoading = false;
    });
  }

  userReInvite() {
    this.common.isLoading = true;

    var inviteObj = {};
    var inviteObjOrg = [];
    var inviteObjSpace = [];
    var orgObj = {};
    var spaceObj = {};

    orgObj = {
      "om": $("#modal4").is(":checked"),
      "bm": $("#modal5").is(":checked"),
      "oa": $("#modal6").is(":checked")
    };

    inviteObjOrg.push(orgObj);
    inviteObj["org"] = inviteObjOrg;
    this.sltEntity.space.resources.forEach(function (data, index) {
      var spaceGuid = data.metadata.guid;
      var spaceRoleObj = {};
      var roleObjSpace = [];

      spaceRoleObj = {
        "sm": $("[id^='modal7_']").eq(index).is(":checked"),
        "sd": $("[id^='modal8_']").eq(index).is(":checked"),
        "sa": $("[id^='modal9_']").eq(index).is(":checked")
      };
      roleObjSpace.push(spaceRoleObj);
      spaceObj[spaceGuid] = roleObjSpace;
    });
    inviteObjSpace.push(spaceObj);
    inviteObj["space"] = inviteObjSpace;

    let params = {
      orgName: this.orgsDetailName,
      orgId: this.orgsDetailGuid,
      refreshToken: this.common.getRefreshToken(),
      userEmail: $("[id='invitename']").val(),
      userRole: JSON.stringify(inviteObj),
      invitename: this.common.getUserid(),
      seq : this.common.getSeq()
    };
    this.orgMainService.userInviteEmailSend(params).subscribe(data => {
      if (data) {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.sendEmailSuccess, true);
      }
    }, error => {
      this.common.alertMessage(this.translateEntities.alertLayer.sendEmailFail + "<br><br>" + error, false);
    }, () => {
      this.getInviteOrg();
    });
  }

  get SltOrgRoleName(): string {
    switch (this.sltOrgRole) {
      case 'OrgManager' :
        return '' + this.translateEntities.orgAdmin + '';
      case 'BillingManager' :
        return '' + this.translateEntities.orgBillingManager + '';
      case 'OrgAuditor' :
        return '' + this.translateEntities.orgObserver + '';
    }
  }

  updateUserSpaceRole(){
    let params = new Array<any>();
    this.sltEntity.userRoles.user_roles.forEach(function (role, index) {
      let arrayrole = new Array<string>();
      $("[id^='modal10_']").eq(index).is(":checked") ? arrayrole.push('space_manager') : '';
      $("[id^='modal11_']").eq(index).is(":checked") ? arrayrole.push('space_developer') : '';
      $("[id^='modal12_']").eq(index).is(":checked") ? arrayrole.push('space_auditor') : '';
      let param = {
        user_email : role.user_email,
        user_id : role.user_id,
        roles : arrayrole
      }
      params.push(param);
    });
    this.common.isLoading = true;
    this.orgMainService.updateUserSpaceRole(this.sltSpaceGuid, params).subscribe(data => {
      if(data){
        this.common.alertMessage("변경 성공", true);
      }}, error => {
      this.common.alertMessage("변경 실패", false);
    },() => {
      this.common.isLoading = false;
    });
  }

  showInviteCancel(value: any) {
    this.sltInvite = value;
    $("#layerpop_org_invite_cancle_"+this.orgsDetailGuid).modal("show");
  }

  showUserReInvite(invite) {
    this.sltInvite = invite;
    let org = JSON.parse(this.sltInvite.role).org[0];
    let space = JSON.parse(this.sltInvite.role).space[0];
    $("#invitename").val(this.sltInvite.userId);
    $("#modal4").prop('checked', org.om);
    $("#modal5").prop('checked', org.bm);
    $("#modal6").prop('checked', org.oa);
    this.sltEntity.space.resources.forEach(function (data, index) {
      if (space[data.metadata.guid]) {
        $("#modal7_" + index).prop('checked', space[data.metadata.guid][0].sm);
        $("#modal8_" + index).prop('checked', space[data.metadata.guid][0].sd);
        $("#modal9_" + index).prop('checked', space[data.metadata.guid][0].sa);
      }
      else {
        $("#modal7_" + index).prop('checked', false);
        $("#modal8_" + index).prop('checked', false);
        $("#modal9_" + index).prop('checked', false);
      }
    });
    $("#layerpop_ReInvite_"+this.orgsDetailGuid).modal("show");
    setTimeout(() => this.allCheck2(), 500);
  }

  allCheck2() {
    $(".checkAll3").change(function () {
      $(".checkSel3").prop('checked', $(this).prop("checked"));
    });

    $(".checkSel3").change(function () {
      var allcount = $(".checkSel3").length;
      var ckcount = $(".checkSel3:checked").length;
      $(".checkAll3").prop('checked', false);
      if (allcount == ckcount) {
        $(".checkAll3").prop('checked', true);
      }
      ;
    });

    $(".checkAll4").change(function () {
      $(".checkSel4").prop('checked', $(this).prop("checked"));
    });

    $(".checkSel4").change(function () {
      var allcount = $(".checkSel4").length;
      var ckcount = $(".checkSel4:checked").length;
      $(".checkAll4").prop('checked', false);
      if (allcount == ckcount) {
        $(".checkAll4").prop('checked', true);
      }
      ;
    });
  }

  showPopSpaceCreateClick(sltOrgGuid: string) {
    this.sltOrgGuid = sltOrgGuid;
    $("#layerpop_space_create_"+this.orgsDetailGuid).modal("show");
    setTimeout(() => {$("#createSpaceName").focus()}, 250);
  }

  showPopAddDomainClick(orgGuid: string) {
    this.sltOrgGuid = orgGuid;
    $("#layerpop_domain_add_"+this.orgsDetailGuid).modal("show");
    setTimeout(() => {
      $("#addDmaoinName").focus();
    }, 250);
  }

  showMemberCancel(user, role, org) {
    if (!this.managerCheck(role)) {
      this.common.alertMessage(this.translateEntities.alertLayer.orgRoleError, false);
      return;
    }
    this.sltUserGuid = user.user_id;
    this.sltMemberName = user.user_email;
    this.sltOrgGuid = org;
    $("#layerpop_member_cancel_"+this.orgsDetailGuid).modal("show");
  }

  showPopModifySpaceNameClick(spaceGuid: string) {
    this.sltSpaceGuid = spaceGuid;
    this.sltSpaceRename = $("#modifySpaceName_" + this.sltSpaceGuid).val();
    $("#layerpop_space_rename_"+this.orgsDetailGuid).modal("show");
  }

  showPopDelDomainClick(orgGuid: string, domainName: string) {
    this.sltOrgGuid = orgGuid;
    this.sltDomainName = domainName;
    $("#layerpop_domain_delete_"+this.orgsDetailGuid).modal("show");
  }

  showPopChangeQuotaClick(orgGuid: string, sltQuotaGuid: string, quotaGuid: string, sltIndex: number) {
    this.sltIndex = sltIndex;
    if (sltQuotaGuid == quotaGuid) {
      return false;
    }

    this.sltOrgGuid = orgGuid;
    this.sltQuotaGuid = quotaGuid;
    $("#layerpop_quota_change_"+this.orgsDetailGuid).modal("show");
  }

  portalGetAllUserName(){
    this.orgMainService.getAllUser().subscribe(data => {
      data.userInfo.forEach(info => {
        this.userName.push(info.userName);
      });
    });
  }

  usercheck(){
    let user = this.invite_name.split(" ").join("");
    let users = user.split(',');
    let namech = true;
    users.forEach(user => {
      if(namech && !this.userName.some(name => {
        if(name === user){
          if(this.emailCheck.test(user)){
            return true}}})){
        namech = false;};
    });
    return namech;
  }

}
