import {CommonService} from '../../common/common.service';
import {OrgURLConstant} from './org.constant';
import {Organization} from '../../model/organization';
import {OrgQuota} from '../../model/org-quota';
import {Space} from '../../model/space';
import {Injectable, Input} from '@angular/core';
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
    const url = OrgURLConstant.URLOrgListAdminOnly;

    const observable = this.common.doGET(url, this.getToken());
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

  public getOrgList(): Array<Organization> {
    const orgs: Array<Organization> = [];
    const url: string = OrgURLConstant.URLOrgListUsingToken + '';
    const observable = this.common.doGET(url, this.getToken());
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

    // for-each spaces and quota

    return orgs;
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

  public renameOrg(org: Organization, wantedRename: String) {
    const url = OrgURLConstant.URLOrgRequestBase;
    const observable = this.common.doPut(url + org.guid,
      wantedRename, this.getToken()).subscribe(data => {
        // org.setName(data['entity']['name']);
        const changedName = data['entity']['name'];
        if (changedName === wantedRename) {
          org.name = changedName;
        }
        console.log(data);
      });
  }

  public deleteOrg(org: Organization) {
    const url = OrgURLConstant.URLOrgRequestBase;
    this.common.doDelete(url + org.guid,
      org.name, this.getToken()).subscribe(data => {
        console.log(data);
      });
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
