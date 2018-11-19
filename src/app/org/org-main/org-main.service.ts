import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import {CommonService} from '../../common/common.service';

@Injectable()
export class OrgMainService {

  constructor(private commonService: CommonService) { }

  getOrgList(page : number) {
    return this.commonService.doGet('/portalapi/v2/orgList/'+page, this.commonService.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getOrgDetail(guid : String) {
    return this.commonService.doGet('/portalapi/v2/orgDetail/'+guid, this.commonService.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getOrgFlag(){
    return this.commonService.doGet('/portalapi/v2/user_org_creation/orgflag', this.commonService.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getDomains() {
    return this.commonService.doGet('/portalapi/v2/domains/all', this.commonService.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getQuotaDefinitions() {
    return this.commonService.doGet('/portalapi/v2/orgs/quota-definitions', this.commonService.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getInviteOrg(){
    return this.commonService.doGet('/commonapi/v2/invitations/userInfo/'+this.commonService.getUserid(), this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  createSpace(params: any) {
    return this.commonService.doPost('/portalapi/v2/spaces', params, this.commonService.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  renameSpace(params: any) {
    return this.commonService.doPut('/portalapi/v2/spaces', params, this.commonService.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  deleteSpace(guid: string, recursive: boolean) {
    return this.commonService.doDelete('/portalapi/v2/spaces/'+guid+'?recursive='+recursive, '', this.commonService.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  addDmaoin(params: any) {
    return this.commonService.doPost('/portalapi/v2/domains', params, this.commonService.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  deleteDmaoin(guid: string, domainName: string) {
    return this.commonService.doDelete('/portalapi/v2/domains/'+guid+'?domainName='+domainName, '', this.commonService.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }
  delMemberCancel(guid : string, userId : string){
    return this.commonService.doDelete('/portalapi/v2/orgs/'+guid+'/member?userId='+userId, '', this.commonService.getToken()).map((res: Response) => {
      return res;
    });
  }

  changeQuota(orgGuid: string, params: any) {
    return this.commonService.doPut('/portalapi/v2/orgs/'+orgGuid+'/quota', params, this.commonService.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  renameOrg(params: any) {
    return this.commonService.doPut('/portalapi/v2/orgs', params, this.commonService.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  deleteOrg(guid: string, recursive: boolean) {
    return this.commonService.doDelete('/portalapi/v2/orgs/'+guid+'?recursive='+recursive, '', this.commonService.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  changeOrgUserRole(orgGuid: string, params: any) {
  return this.commonService.doPut('/portalapi/v2/orgs/'+orgGuid+'/user-roles', params, this.commonService.getToken()).map((res: Response) => {
    return res;
  });
  }

  delOrgUserRole(orgGuid: string, params: any) {
    return this.commonService.doDelete('/portalapi/v2/orgs/'+orgGuid+'/user-roles', params, this.commonService.getToken()).map((res: Response) => {
      return res;
    })
  }

  userInviteEmailSend(params: any) {
    return this.commonService.doPost('/commonapi/v2/email/inviteOrg', params, this.commonService.getToken()).map((res: Response) => {
      return res;
    });
  }

  delInviteCancle(orgGuid: string, userId: string) {
    return this.commonService.doDelete('/commonapi/v2/orgs/'+orgGuid+'/invite?userId='+ userId,'', this.commonService.getToken()).map((res: Response) => {
      return res;
    });
  }

  getUserSpaceRoles(spaceid : string){
    return this.commonService.doGet('/portalapi/v2/spaces/'+spaceid+'/user-roles', this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }

  updateUserSpaceRole(spaceid : string, params : any) {
    return this.commonService.doPut('/portalapi/v2/spaces/' + spaceid + '/user-roles', params, this.commonService.getToken()).map((res: any) => {
      return res;
    });
  }
  userInviteAccept(params: any) {
    return this.commonService.doPut('/portalapi/v2/orgs/user-roles', params, '').map((res: Response) => {
      return res;
    }).do(console.log);
  }
}
