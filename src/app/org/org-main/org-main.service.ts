import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import {CommonService} from '../../common/common.service';

declare var require: any;
let appConfig = require('assets/resources/env/config.json');

@Injectable()
export class OrgMainService {
  apiversion = appConfig['apiversion'];

  constructor(private commonService: CommonService) { }

  getOrgList(page : number) {
    return this.commonService.doGet('/portalapi/' + this.apiversion + '/orgList/'+page, this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  getOrgDetail(guid : String) {
    return this.commonService.doGet('/portalapi/' + this.apiversion + '/orgDetail/'+guid, this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  getOrgFlag(){
    return this.commonService.doGet('/portalapi/' + this.apiversion + '/user_org_creation/orgflag', this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  getDomains() {
    return this.commonService.doGet('/portalapi/' + this.apiversion + '/domains/all', this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  getQuotaDefinitions() {
    return this.commonService.doGet('/portalapi/' + this.apiversion + '/orgs/quota-definitions', this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  getInviteOrg(){
    return this.commonService.doGet('/commonapi/v2/invitations/userInfo/'+this.commonService.getUserid(), this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  getAllUser(){
    return this.commonService.doGet('/commonapi/v2/users', this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  createSpace(params: any) {
    return this.commonService.doPost('/portalapi/' + this.apiversion + '/spaces', params, this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  getSpace(params: string){
    return this.commonService.doGet('/portalapi/' + this.apiversion + '/orgs/' + params + "/spaces",  this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  renameSpace(params: any) {
    return this.commonService.doPut('/portalapi/' + this.apiversion + '/spaces', params, this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  deleteSpace(guid: string, recursive: boolean) {
    return this.commonService.doDelete('/portalapi/' + this.apiversion + '/spaces/'+guid+'?recursive='+recursive, '', this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  addDmaoin(params: any) {
    return this.commonService.doPost('/portalapi/' + this.apiversion + '/domains', params, this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  deleteDmaoin(guid: string, domainName: string) {
    return this.commonService.doDelete('/portalapi/' + this.apiversion + '/domains/'+guid+'?domainName='+domainName, '', this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }
  delMemberCancel(guid : string, userId : string){
    return this.commonService.doDelete('/portalapi/' + this.apiversion + '/orgs/'+guid+'/member?userId='+userId, '', this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  changeQuota(orgGuid: string, params: any) {
    return this.commonService.doPut('/portalapi/' + this.apiversion + '/orgs/'+orgGuid+'/quota', params, this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  renameOrg(params: any) {
    return this.commonService.doPut('/portalapi/' + this.apiversion + '/orgs', params, this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  deleteOrg(guid: string, recursive: boolean) {
    return this.commonService.doDelete('/portalapi/' + this.apiversion + '/orgs/'+guid+'?recursive='+recursive, '', this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  changeOrgUserRole(orgGuid: string, params: any) {
  return this.commonService.doPut('/portalapi/' + this.apiversion + '/orgs/'+orgGuid+'/user-roles', params, this.commonService.getToken()).map((res: any) => {
    return res;
  });
  }

  delOrgUserRole(orgGuid: string, params: any) {
    return this.commonService.doDelete('/portalapi/' + this.apiversion + '/orgs/'+orgGuid+'/user-roles', params, this.commonService.getToken()).map((res: any) => {
      return res;
    })
  }

  userInviteEmailSend(params: any) {
    return this.commonService.doPost('/commonapi/v3/email/inviteOrg', params, "").map((res: any) => {
      return res;
    });
  }

  // userInviteEmailSendMulti(url, authorization, params: any) {
  //   return this.commonService.doPostMulti(url+'/commonapi/v2/email/inviteOrg', authorization, params, '').map((res: any) => {
  //     return res;
  //   });
  // }

  delInviteCancle(orgGuid: string, userId: string) {
    return this.commonService.doDelete('/commonapi/v2/orgs/'+orgGuid+'/invite?userId='+ userId,'', this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  getUserSpaceRoles(spaceid : string){
    return this.commonService.doGet('/portalapi/' + this.apiversion + '/spaces/'+spaceid+'/user-roles', this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  updateUserSpaceRole(spaceid : string, params : any) {
    return this.commonService.doPut('/portalapi/' + this.apiversion + '/spaces/' + spaceid + '/user-roles', params, this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }
  userInviteAccept(params: any) {
    return this.commonService.doPut('/portalapi/' + this.apiversion + '/orgs/user-roles', params, '').map((res: any) => {
      return res;
    });
  }

  userInviteAcceptMulti(url, authorization, params: any) {
    return this.commonService.doPutMulti(url+'/portalapi/' + this.apiversion + '/orgs/user-roles',authorization, params, '').map((res: any) => {
      return res;
    });
  }

  userInviteAcceptSend(url, authorization, params: any){
    return this.commonService.doPutMail(url+'/portalapi/' + this.apiversion + '/orgs/user-roles',authorization, params,'').map((res: any) => {
      return res;
    });
  }


}
