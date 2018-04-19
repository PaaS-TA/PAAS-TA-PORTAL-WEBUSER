import {CommonService} from '../common/common.service';
import {Organization} from './organization';
import {OrganizationConstant} from './organizationconstant';
import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';

@Injectable()
export class OrgService {
  private orgsAdminURL = '/portalapi/v2/orgs-admin';

  constructor(private common: CommonService, private logger: NGXLogger) {}

  private getToken() {
    return this.common.getToken();
  }

  public getOrgListAdminOnly(): Array<Organization> {
    const orgs: Array<Organization> = new Array<Organization>();
    const url = OrganizationConstant.URLOrgListAdminOnly;

    this.common.doGET(url, this.getToken()).subscribe(data => {
      const resources = data['resources'] as Array<Object>;
      const length = resources.length;
      this.logger.trace('orgs\' length is', length);
      for (let i = 0; i < length; i++) {
        orgs[i] = new Organization(resources[i]);
        this.logger.trace(orgs[i]);
      }
    });
    this.logger.debug('OrgList :', orgs);

    return orgs;
  }
}