import {CommonService} from '../common/common.service';
import {OrgURLConstant} from './org.constant';
import {Organization, OrgSpace, OrgQuota} from '../model/organization';
import {Injectable, Input} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import { Observable, Subscription } from 'rxjs';
import {Observer} from "rxjs/Observer";


@Injectable()
export class OrgService {
  private orgsAdminURL = '/portalapi/v2/orgs-admin';
  constructor(private common: CommonService, private logger: NGXLogger) {}

  private getToken() {
    return this.common.getToken();
  }

  public getOrgListAdminOnly(): Array<Organization> {
    let isLoading: Boolean = true;
    const orgs: Array<Organization> = new Array<Organization>();
    const url = OrgURLConstant.URLOrgListAdminOnly;

    const observable = this.common.doGET(url, this.getToken()).subscribe(data => {
      const resources = data['resources'] as Array<Object>;
      const length = resources.length;
      this.logger.trace('orgs\' length is', length);
      for (let i = 0; i < length; i++) {
        orgs[i] = new Organization(resources[i]);
        this.logger.trace(orgs[i]);
      }
      isLoading = false;
      this.logger.debug('OrgList :', orgs);
    });

    if (!isLoading) {
      observable.unsubscribe();
    }
    return orgs;
  }

  public getOrgList(): Array<Organization> {
    let isLoading: Boolean = true;
    const orgs: Array<Organization> = [];
    const url: string = OrgURLConstant.URLOrgListUsingToken+'';
    const observable = this.common.doGET(url, this.getToken()).subscribe(data => {
      if (data.hasOwnProperty('resources')) {
        (data['resources'] as Array<Object>).forEach(orgData => {
          const index = orgs.push(new Organization(orgData)) - 1;
          this.logger.trace('Org(', index, ') :', orgs[index]);
        });
        isLoading = false;
        this.logger.debug('OrgList :', orgs);
      }
    });

    if (!isLoading) {
      console.log("로딩안함");
      observable.unsubscribe();
    }

    return orgs;
  }

  public getOrgSpaceList(orgId: string): Array<OrgSpace> {
    let isLoading: Boolean = true;
    const spaces: Array<OrgSpace> = [];
    const url: string = OrgURLConstant.URLOrgSpaceInformationHead + orgId + OrgURLConstant.URLOrgSpaceInformationTail;
    const observable = this.common.doGET(url, this.getToken()).subscribe(data => {
      if (data.hasOwnProperty('spaceList')) {
        const spaceList = data['spaceList'];
        if (spaceList.hasOwnProperty('resources')) {
          (spaceList['resources'] as Array<Object>).forEach(spaceData => {
            const index = spaces.push(new OrgSpace(spaceData)) - 1;
            this.logger.trace('Org(', index, ') :', spaces[index]);
          });
        }
        isLoading = false;
        this.logger.debug('OrgList :', spaces);
      }
    });

    if (!isLoading) {
      observable.unsubscribe();
    }
    return spaces;
  }

  public getOrgQuota(orgId: string): OrgQuota {
    let isLoading: Boolean = true;
    let quota: OrgQuota;
    const url: string = OrgURLConstant.URLOrgQuotaInformationHead + orgId + OrgURLConstant.URLOrgQuotaInformationTail;
    const observable = this.common.doGET(url, this.getToken()).subscribe(quotaData => {
      quota = new OrgQuota(quotaData);
      isLoading = false;
      this.logger.debug('OrgList :', quota);
    });

    if (!isLoading) {
      observable.unsubscribe();
    }
    return quota;
  }

  public getOrgAvailableQuota(): Array<OrgQuota> {
    let isLoading: Boolean = true;
    const quotas: Array<OrgQuota> = [];
    const url: string = OrgURLConstant.URLOrgAvailableQuotas+'';
    const observable = this.common.doGET(url, this.getToken()).subscribe(data => {
      if (data.hasOwnProperty('resources')) {
        (data['resources'] as Array<Object>).forEach(quotaData => {
          const index = quotas.push(new OrgQuota(quotaData)) - 1;
          this.logger.trace('Org available quota(', index, ') :', quotas[index]);
        });
        isLoading = false;
        this.logger.debug('OrgAvailableQuotas :', quotas);
      }
    });

    if (!isLoading) {
      observable.unsubscribe();
    }
    return quotas;
  }

  public getOrgListAdminOnlySample(): Array<Organization> {
    const data = this.getSampleOrgList();
    const orgs: Array<Organization> = [];
    const resources: Array<Object> = data.resources;
    this.logger.trace('orgs\' length is', resources.length);
    resources.forEach(orgData => {
      const index = orgs.push(new Organization(orgData)) - 1;
      this.logger.trace(orgs[index]);
    });

    return orgs;
  }

  public getOrgSpaceListSample(): Array<OrgSpace> {
    const data = this.getSampleOrgSpaceList();
    const spaces: Array<OrgSpace> = [];
    data.spaceList.resources.forEach(spaceData => {
      const index = spaces.push(new OrgSpace(spaceData)) - 1;
      this.logger.trace(spaces[index]);
    });

    return spaces;
  }

  public getOrgQuotaSample(): OrgQuota {
    const data = this.getOrgQuotaSample();
    const quota: OrgQuota = new OrgQuota(data);

    return quota;
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

  private getSampleOrgSpaceList() {
    return {
      'spaceList': {
        'next_url': null,
        'prev_url': null,
        'resources': [
          {
            'entity': {
              'allow_ssh': true,
              'app_events_url': '/v2/spaces/bdde0650-7973-4179-9933-d59dba08aad8/app_events',
              'apps_url': '/v2/spaces/bdde0650-7973-4179-9933-d59dba08aad8/apps',
              'auditors_url': '/v2/spaces/bdde0650-7973-4179-9933-d59dba08aad8/auditors',
              'developers_url': '/v2/spaces/bdde0650-7973-4179-9933-d59dba08aad8/developers',
              'domains_url': '/v2/spaces/bdde0650-7973-4179-9933-d59dba08aad8/domains',
              'events_url': '/v2/spaces/bdde0650-7973-4179-9933-d59dba08aad8/events',
              'isolation_segment_guid': null,
              'isolation_segment_url': null,
              'managers_url': '/v2/spaces/bdde0650-7973-4179-9933-d59dba08aad8/managers',
              'name': 'dev',
              'organization_guid': '3c3e06c9-f3f0-4e14-885f-912c11d3156b',
              'organization_url': '/v2/organizations/3c3e06c9-f3f0-4e14-885f-912c11d3156b',
              'routes_url': '/v2/spaces/bdde0650-7973-4179-9933-d59dba08aad8/routes',
              'security_groups_url': '/v2/spaces/bdde0650-7973-4179-9933-d59dba08aad8/security_groups',
              'service_instances_url': '/v2/spaces/bdde0650-7973-4179-9933-d59dba08aad8/service_instances',
              'space_quota_definition_guid': null,
              'space_quota_definition_url': null,
              'staging_security_groups_url': '/v2/spaces/bdde0650-7973-4179-9933-d59dba08aad8/staging_security_groups'
            },
            'metadata': {
              'created_at': '2017-11-24T06:16:27Z',
              'guid': 'bdde0650-7973-4179-9933-d59dba08aad8',
              'updated_at': '2017-11-24T06:16:27Z',
              'url': '/v2/spaces/bdde0650-7973-4179-9933-d59dba08aad8'
            }
          },
          {
            'entity': {
              'allow_ssh': true,
              'app_events_url': '/v2/spaces/9fb95d51-4694-46f9-a934-f0325a06f0c3/app_events',
              'apps_url': '/v2/spaces/9fb95d51-4694-46f9-a934-f0325a06f0c3/apps',
              'auditors_url': '/v2/spaces/9fb95d51-4694-46f9-a934-f0325a06f0c3/auditors',
              'developers_url': '/v2/spaces/9fb95d51-4694-46f9-a934-f0325a06f0c3/developers',
              'domains_url': '/v2/spaces/9fb95d51-4694-46f9-a934-f0325a06f0c3/domains',
              'events_url': '/v2/spaces/9fb95d51-4694-46f9-a934-f0325a06f0c3/events',
              'isolation_segment_guid': null,
              'isolation_segment_url': null,
              'managers_url': '/v2/spaces/9fb95d51-4694-46f9-a934-f0325a06f0c3/managers',
              'name': 'stg',
              'organization_guid': '3c3e06c9-f3f0-4e14-885f-912c11d3156b',
              'organization_url': '/v2/organizations/3c3e06c9-f3f0-4e14-885f-912c11d3156b',
              'routes_url': '/v2/spaces/9fb95d51-4694-46f9-a934-f0325a06f0c3/routes',
              'security_groups_url': '/v2/spaces/9fb95d51-4694-46f9-a934-f0325a06f0c3/security_groups',
              'service_instances_url': '/v2/spaces/9fb95d51-4694-46f9-a934-f0325a06f0c3/service_instances',
              'space_quota_definition_guid': null,
              'space_quota_definition_url': null,
              'staging_security_groups_url': '/v2/spaces/9fb95d51-4694-46f9-a934-f0325a06f0c3/staging_security_groups'
            },
            'metadata': {
              'created_at': '2017-11-24T06:16:35Z',
              'guid': '9fb95d51-4694-46f9-a934-f0325a06f0c3',
              'updated_at': '2017-11-24T06:16:35Z',
              'url': '/v2/spaces/9fb95d51-4694-46f9-a934-f0325a06f0c3'
            }
          },
          {
            'entity': {
              'allow_ssh': true,
              'app_events_url': '/v2/spaces/c0a75762-c00f-424c-bd0d-fff0e5cc72c9/app_events',
              'apps_url': '/v2/spaces/c0a75762-c00f-424c-bd0d-fff0e5cc72c9/apps',
              'auditors_url': '/v2/spaces/c0a75762-c00f-424c-bd0d-fff0e5cc72c9/auditors',
              'developers_url': '/v2/spaces/c0a75762-c00f-424c-bd0d-fff0e5cc72c9/developers',
              'domains_url': '/v2/spaces/c0a75762-c00f-424c-bd0d-fff0e5cc72c9/domains',
              'events_url': '/v2/spaces/c0a75762-c00f-424c-bd0d-fff0e5cc72c9/events',
              'isolation_segment_guid': null,
              'isolation_segment_url': null,
              'managers_url': '/v2/spaces/c0a75762-c00f-424c-bd0d-fff0e5cc72c9/managers',
              'name': 'prd',
              'organization_guid': '3c3e06c9-f3f0-4e14-885f-912c11d3156b',
              'organization_url': '/v2/organizations/3c3e06c9-f3f0-4e14-885f-912c11d3156b',
              'routes_url': '/v2/spaces/c0a75762-c00f-424c-bd0d-fff0e5cc72c9/routes',
              'security_groups_url': '/v2/spaces/c0a75762-c00f-424c-bd0d-fff0e5cc72c9/security_groups',
              'service_instances_url': '/v2/spaces/c0a75762-c00f-424c-bd0d-fff0e5cc72c9/service_instances',
              'space_quota_definition_guid': null,
              'space_quota_definition_url': null,
              'staging_security_groups_url': '/v2/spaces/c0a75762-c00f-424c-bd0d-fff0e5cc72c9/staging_security_groups'
            },
            'metadata': {
              'created_at': '2017-11-24T06:16:40Z',
              'guid': 'c0a75762-c00f-424c-bd0d-fff0e5cc72c9',
              'updated_at': '2017-11-24T06:16:40Z',
              'url': '/v2/spaces/c0a75762-c00f-424c-bd0d-fff0e5cc72c9'
            }
          },
          {
            'entity': {
              'allow_ssh': true,
              'app_events_url': '/v2/spaces/41dde329-4a61-4c4b-adc4-dff8185cae02/app_events',
              'apps_url': '/v2/spaces/41dde329-4a61-4c4b-adc4-dff8185cae02/apps',
              'auditors_url': '/v2/spaces/41dde329-4a61-4c4b-adc4-dff8185cae02/auditors',
              'developers_url': '/v2/spaces/41dde329-4a61-4c4b-adc4-dff8185cae02/developers',
              'domains_url': '/v2/spaces/41dde329-4a61-4c4b-adc4-dff8185cae02/domains',
              'events_url': '/v2/spaces/41dde329-4a61-4c4b-adc4-dff8185cae02/events',
              'isolation_segment_guid': null,
              'isolation_segment_url': null,
              'managers_url': '/v2/spaces/41dde329-4a61-4c4b-adc4-dff8185cae02/managers',
              'name': 'gcp',
              'organization_guid': '3c3e06c9-f3f0-4e14-885f-912c11d3156b',
              'organization_url': '/v2/organizations/3c3e06c9-f3f0-4e14-885f-912c11d3156b',
              'routes_url': '/v2/spaces/41dde329-4a61-4c4b-adc4-dff8185cae02/routes',
              'security_groups_url': '/v2/spaces/41dde329-4a61-4c4b-adc4-dff8185cae02/security_groups',
              'service_instances_url': '/v2/spaces/41dde329-4a61-4c4b-adc4-dff8185cae02/service_instances',
              'space_quota_definition_guid': null,
              'space_quota_definition_url': null,
              'staging_security_groups_url': '/v2/spaces/41dde329-4a61-4c4b-adc4-dff8185cae02/staging_security_groups'
            },
            'metadata': {
              'created_at': '2017-12-05T05:29:04Z',
              'guid': '41dde329-4a61-4c4b-adc4-dff8185cae02',
              'updated_at': '2017-12-05T05:29:04Z',
              'url': '/v2/spaces/41dde329-4a61-4c4b-adc4-dff8185cae02'
            }
          }
        ],
        'total_pages': 1,
        'total_results': 4
      }
    };
  }

  private getSampleOrgQuota() {
    return {
      'entity': {
        'app_instance_limit': -1,
        'app_task_limit': -1,
        'instance_memory_limit': -1,
        'memory_limit': 20480,
        'name': '20G_quota',
        'non_basic_services_allowed': true,
        'total_private_domains': -1,
        'total_reserved_route_ports': 0,
        'total_routes': 2000,
        'total_service_keys': -1,
        'total_services': 100,
        'trial_db_allowed': false
      },
      'metadata': {
        'created_at': '2017-11-27T04:04:43Z',
        'guid': '31e846ad-8d8b-4d70-bd1a-5f7ae3aff3b1',
        'updated_at': '2017-11-27T04:04:43Z',
        'url': '/v2/quota_definitions/31e846ad-8d8b-4d70-bd1a-5f7ae3aff3b1'
      }
    };
  }

  public orgReName(org: Organization)
  {
    const url = OrgURLConstant.URLOrgSummaryInformationHead;
    let isLoading: Boolean = true;
    const observable = this.common.doPut(url+org.getId(),org.orgRename ,this.getToken()).subscribe(data => {
      org.setName(data['entity']['name']);
      console.log(data);
      org.orgRename = '';
    });
  }

  public orgDelete(org : Organization)
  {
     const url = OrgURLConstant.URLOrgSummaryInformationHead;
     this.common.doDelete(url+org.getId(), org.getName() ,this.getToken()).subscribe(data => {
     console.log(data);
     });
  }
}
