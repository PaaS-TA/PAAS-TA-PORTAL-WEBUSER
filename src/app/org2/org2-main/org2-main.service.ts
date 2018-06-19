import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import {CommonService} from '../../common/common.service';

@Injectable()
export class Org2MainService {

  constructor(private commonService: CommonService) { }

  private getToken() {
    //return this.common.getToken();
    return this.commonService.getRefreshToken();

  }

  getOrgList() {
    return this.commonService.doGet('/portalapi/v2/orgList', this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getDomains() {
    return this.commonService.doGet('/portalapi/v2/domains/all', this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  getQuotaDefinitions() {
    return this.commonService.doGet('/portalapi/v2/orgs/quota-definitions', this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  createSpace(params: any) {
    return this.commonService.doPost('/portalapi/v2/spaces', params, this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  renameSpace(params: any) {
    return this.commonService.doPut('/portalapi/v2/spaces', params, this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  deleteSpace(guid: string, recursive: boolean) {
    return this.commonService.doDelete('/portalapi/v2/spaces/'+guid+'?recursive='+recursive, '', this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  addDmaoin(params: any) {
    return this.commonService.doPost('/portalapi/v2/domains', params, this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  delDmaoin(guid: string, domainName: string) {
    return this.commonService.doDelete('/portalapi/v2/domains/'+guid+'?domainName='+domainName, '', this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  changeQuota(orgGuid: string, params: any) {
    return this.commonService.doPut('/portalapi/v2/orgs/'+orgGuid+'/quota', params, this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  renameOrg(params: any) {
    return this.commonService.doPut('/portalapi/v2/orgs', params, this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }

  deleteOrg(guid: string, recursive: boolean) {
    return this.commonService.doDelete('/portalapi/v2/orgs/'+guid+'?recursive='+recursive, '', this.getToken()).map((res: Response) => {
      return res;
    }).do(console.log);
  }
}
