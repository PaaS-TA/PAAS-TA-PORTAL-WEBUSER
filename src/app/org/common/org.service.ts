import {CommonService} from '../../common/common.service';
import {OrgURLConstant} from './org.constant';
import {Organization} from '../../model/organization';
import {OrgQuota} from '../../model/org-quota';
import {Space} from '../../model/space';
import {Injectable, Input} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {OrgUserRoleService} from "./org-userrole.service";


@Injectable()
export class OrgService {
  private orgsAdminURL = '/portalapi/v2/orgs-admin';
  constructor(private common: CommonService, private orgUserRoleService: OrgUserRoleService, private logger: NGXLogger) {}

  private getToken() {
    //return this.common.getToken();
    return this.common.getRefreshToken();
  }

  public getOrgListAdminOnly(): Array<Organization> {
    const orgs: Array<Organization> = new Array<Organization>();
    const url = OrgURLConstant.URLOrgListAdminOnly;

    const observable = this.common.doGet(url, this.getToken());
    observable.subscribe(data => {
      if (data.hasOwnProperty('resources')) {
        (data['resources'] as Array<Object>).forEach(orgData => {
          const index =
            orgs.push(new Organization(orgData['metadata'], orgData['entity'])) - 1;
          this.logger.trace('Org(', index, ') :', orgs[index]);
        });
      }
      this.logger.debug('OrgList :', orgs);
    });

    return orgs;
  }

  public getOrgListAsPromise(): Promise<Array<Organization>> {
    const logger: NGXLogger = this.logger;
    const orgs: Array<Organization> = [];
    const url: string = OrgURLConstant.URLOrgListUsingToken + '';
    const processFunc = function(data) {
      if (data.hasOwnProperty('resources')) {
        (data['resources'] as Array<Object>).forEach(orgData => {
          const index =
            orgs.push(new Organization(orgData['metadata'], orgData['entity'])) - 1;
          logger.trace('Org(', index, ') :', orgs[index]);
        });
      } else {
        orgs.push(undefined);
      }
      logger.debug('OrgList :', orgs);
    }

    // for-each spaces and quota
    return (async() => {
      const data = await this.common.doGet(url, this.getToken()).toPromise();
      processFunc(data);
      return orgs;
    })();
  }

  public getOrgList(): Array<Organization> {
    const logger: NGXLogger = this.logger;
    let result: Array<Organization> = [];
    this.getOrgListAsPromise().then(res => {
      res.forEach(value => result.push(value));
    }).catch(res => {
      logger.error("Fail to get organization list. ", res);
      result.push(undefined);
    });

    return result;
  }

  public getOrgListAdminOnlySample(): Array<Organization> {
    const data = this.getSampleOrgList();
    const orgs: Array<Organization> = [];
    const resources: Array<Object> = data.resources;
    this.logger.trace('orgs\' length is', resources.length);

    resources.forEach(orgData => {
      const index = orgs.push(new Organization(orgData['metadata'], orgData['entity'])) - 1;
      this.logger.trace(orgs[index]);
    });

    return orgs;
  }

  public renameOrg(org: Organization, wantedNewName: String) {
    const url = OrgURLConstant.URLOrgRequestBase;
    const body = {
      guid: org.guid,
      newOrgName: wantedNewName
    }

    const observable = this.common.doPut(url, body, this.getToken()).subscribe(data => {
        // org.setName(data['entity']['name']);
        const changedName = data['entity']['name'];
        if (changedName === wantedNewName) {
          org.name = changedName;
        }
        console.log(data);
      });
  }

  public deleteOrg(org: Organization) {
    const url = OrgURLConstant.URLOrgRequestBase;
    const params = {
      guid: org.guid,
      recursive: true
    };

    const observable = this.common.doDelete(url, params, this.getToken());
    observable.subscribe(data => {
        this.logger.debug('Delete organization :', org.name, ' (' + org.guid + ')');
    });
  }

  public cancelOrg(orgId: string, userId: string) {
    if (orgId === null && orgId === undefined) { return; }
    if (userId === null && userId === undefined) { return; }

    this.logger.debug('call cancel org :', orgId, ' / ', userId);
    // redirect cancel org to OrgUserRoleService.cancelOrgMemberUsingOrgIdAndUserId
    return (async() =>{
      let data = await this.orgUserRoleService.cancelOrgMemberByGuid(orgId, userId);
      this.logger.debug('Cancel member(' + userId + ') of org(' + orgId + ').');
      return data;
    })();
  }

  private getSampleOrgList() {
    return {
      'description': 'This is CF organization sample files, PORTAL-API:2222, /v2/orgs (using admin token)',
      'next_url': null,
      'prev_url': null,
      'resources': [
        {
          'entity': {
            'app_events_url': '/v2/organizations/b0ebe421-27bf-4886-ac1a-0e03fed39f99/app_events',
            'auditors_url': '/v2/organizations/b0ebe421-27bf-4886-ac1a-0e03fed39f99/auditors',
            'billing_enabled': false,
            'billing_managers_url': '/v2/organizations/b0ebe421-27bf-4886-ac1a-0e03fed39f99/billing_managers',
            'default_isolation_segment_guid': null,
            'domains_url': '/v2/organizations/b0ebe421-27bf-4886-ac1a-0e03fed39f99/domains',
            'isolation_segment_url': null,
            'managers_url': '/v2/organizations/b0ebe421-27bf-4886-ac1a-0e03fed39f99/managers',
            'name': 'hgcho-org',
            'private_domains_url': '/v2/organizations/b0ebe421-27bf-4886-ac1a-0e03fed39f99/private_domains',
            'quota_definition_guid': '6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'quota_definition_url': '/v2/quota_definitions/6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'space_quota_definitions_url': '/v2/organizations/b0ebe421-27bf-4886-ac1a-0e03fed39f99/space_quota_definitions',
            'spaces_url': '/v2/organizations/b0ebe421-27bf-4886-ac1a-0e03fed39f99/spaces',
            'status': 'active',
            'users_url': '/v2/organizations/b0ebe421-27bf-4886-ac1a-0e03fed39f99/users'
          },
          'metadata': {
            'created_at': '2018-04-16T07:47:34Z',
            'guid': 'b0ebe421-27bf-4886-ac1a-0e03fed39f99',
            'updated_at': '2018-04-16T07:47:34Z',
            'url': '/v2/organizations/b0ebe421-27bf-4886-ac1a-0e03fed39f99'
          }
        }
      ],
      'total_pages': 1,
      'total_results': 1
    };
  }
}
