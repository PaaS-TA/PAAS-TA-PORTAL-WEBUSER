import {CommonService} from '../common/common.service';
import { OrgURLConstant } from './org.constant';
import {Organization} from './organization';
import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';

@Injectable()
export class OrgService {
  private orgsAdminURL = '/portalapi/v2/orgs-admin';

  constructor(private common: CommonService, private logger: NGXLogger) {}

  private getToken() {
    return this.common.getToken();
  }

  public getOrgListAdminOnly2(): Array<Organization> {
    const orgs: Array<Organization> = new Array<Organization>();
    const url = OrgURLConstant.URLOrgListAdminOnly;

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

  public getOrgListAdminOnly(): Array<Organization> {
    const data = {
      'description': 'This is CF organization sample files, PORTAL-API:2222, /v2/orgs (using admin token)',
      'nextUrl': null,
      'previousUrl': null,
      'resources': [
        {
          'entity': {
            'applicationEventsUrl': '/v2/organizations/3c3e06c9-f3f0-4e14-885f-912c11d3156b/app_events',
            'auditorsUrl': '/v2/organizations/3c3e06c9-f3f0-4e14-885f-912c11d3156b/auditors',
            'billingEnabled': false,
            'billingManagersUrl': '/v2/organizations/3c3e06c9-f3f0-4e14-885f-912c11d3156b/billing_managers',
            'defaultIsolationSegmentId': null,
            'domainsUrl': '/v2/organizations/3c3e06c9-f3f0-4e14-885f-912c11d3156b/domains',
            'isolationSegmentUrl': null,
            'managersUrl': '/v2/organizations/3c3e06c9-f3f0-4e14-885f-912c11d3156b/managers',
            'name': 'system',
            'privateDomainsUrl': '/v2/organizations/3c3e06c9-f3f0-4e14-885f-912c11d3156b/private_domains',
            'quotaDefinitionId': '31e846ad-8d8b-4d70-bd1a-5f7ae3aff3b1',
            'quotaDefinitionUrl': '/v2/quota_definitions/31e846ad-8d8b-4d70-bd1a-5f7ae3aff3b1',
            'spaceQuotaDefinitionsUrl': '/v2/organizations/3c3e06c9-f3f0-4e14-885f-912c11d3156b/space_quota_definitions',
            'spacesUrl': '/v2/organizations/3c3e06c9-f3f0-4e14-885f-912c11d3156b/spaces',
            'status': 'active',
            'usersUrl': '/v2/organizations/3c3e06c9-f3f0-4e14-885f-912c11d3156b/users'
          },
          'metadata': {
            'createdAt': '2017-11-24T06:01:32Z',
            'id': '3c3e06c9-f3f0-4e14-885f-912c11d3156b',
            'updatedAt': '2017-11-27T04:05:03Z',
            'url': '/v2/organizations/3c3e06c9-f3f0-4e14-885f-912c11d3156b'
          }
        },
        {
          'entity': {
            'applicationEventsUrl': '/v2/organizations/fceb01c0-ab42-4686-a7d9-4910abc3cdbc/app_events',
            'auditorsUrl': '/v2/organizations/fceb01c0-ab42-4686-a7d9-4910abc3cdbc/auditors',
            'billingEnabled': false,
            'billingManagersUrl': '/v2/organizations/fceb01c0-ab42-4686-a7d9-4910abc3cdbc/billing_managers',
            'defaultIsolationSegmentId': null,
            'domainsUrl': '/v2/organizations/fceb01c0-ab42-4686-a7d9-4910abc3cdbc/domains',
            'isolationSegmentUrl': null,
            'managersUrl': '/v2/organizations/fceb01c0-ab42-4686-a7d9-4910abc3cdbc/managers',
            'name': 'swmoon-org',
            'privateDomainsUrl': '/v2/organizations/fceb01c0-ab42-4686-a7d9-4910abc3cdbc/private_domains',
            'quotaDefinitionId': '6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'quotaDefinitionUrl': '/v2/quota_definitions/6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'spaceQuotaDefinitionsUrl': '/v2/organizations/fceb01c0-ab42-4686-a7d9-4910abc3cdbc/space_quota_definitions',
            'spacesUrl': '/v2/organizations/fceb01c0-ab42-4686-a7d9-4910abc3cdbc/spaces',
            'status': 'active',
            'usersUrl': '/v2/organizations/fceb01c0-ab42-4686-a7d9-4910abc3cdbc/users'
          },
          'metadata': {
            'createdAt': '2017-11-27T00:31:35Z',
            'id': 'fceb01c0-ab42-4686-a7d9-4910abc3cdbc',
            'updatedAt': '2017-11-27T00:31:35Z',
            'url': '/v2/organizations/fceb01c0-ab42-4686-a7d9-4910abc3cdbc'
          }
        },
        {
          'entity': {
            'applicationEventsUrl': '/v2/organizations/f90a8a62-eba7-4b69-b3bf-03a5c57d41f4/app_events',
            'auditorsUrl': '/v2/organizations/f90a8a62-eba7-4b69-b3bf-03a5c57d41f4/auditors',
            'billingEnabled': false,
            'billingManagersUrl': '/v2/organizations/f90a8a62-eba7-4b69-b3bf-03a5c57d41f4/billing_managers',
            'defaultIsolationSegmentId': null,
            'domainsUrl': '/v2/organizations/f90a8a62-eba7-4b69-b3bf-03a5c57d41f4/domains',
            'isolationSegmentUrl': null,
            'managersUrl': '/v2/organizations/f90a8a62-eba7-4b69-b3bf-03a5c57d41f4/managers',
            'name': 'hrjin-org',
            'privateDomainsUrl': '/v2/organizations/f90a8a62-eba7-4b69-b3bf-03a5c57d41f4/private_domains',
            'quotaDefinitionId': '6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'quotaDefinitionUrl': '/v2/quota_definitions/6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'spaceQuotaDefinitionsUrl': '/v2/organizations/f90a8a62-eba7-4b69-b3bf-03a5c57d41f4/space_quota_definitions',
            'spacesUrl': '/v2/organizations/f90a8a62-eba7-4b69-b3bf-03a5c57d41f4/spaces',
            'status': 'active',
            'usersUrl': '/v2/organizations/f90a8a62-eba7-4b69-b3bf-03a5c57d41f4/users'
          },
          'metadata': {
            'createdAt': '2017-11-27T01:10:24Z',
            'id': 'f90a8a62-eba7-4b69-b3bf-03a5c57d41f4',
            'updatedAt': '2017-11-27T01:10:24Z',
            'url': '/v2/organizations/f90a8a62-eba7-4b69-b3bf-03a5c57d41f4'
          }
        },
        {
          'entity': {
            'applicationEventsUrl': '/v2/organizations/91535f1d-338b-45bf-a2fc-cb28daef4a82/app_events',
            'auditorsUrl': '/v2/organizations/91535f1d-338b-45bf-a2fc-cb28daef4a82/auditors',
            'billingEnabled': false,
            'billingManagersUrl': '/v2/organizations/91535f1d-338b-45bf-a2fc-cb28daef4a82/billing_managers',
            'defaultIsolationSegmentId': null,
            'domainsUrl': '/v2/organizations/91535f1d-338b-45bf-a2fc-cb28daef4a82/domains',
            'isolationSegmentUrl': null,
            'managersUrl': '/v2/organizations/91535f1d-338b-45bf-a2fc-cb28daef4a82/managers',
            'name': 'lena',
            'privateDomainsUrl': '/v2/organizations/91535f1d-338b-45bf-a2fc-cb28daef4a82/private_domains',
            'quotaDefinitionId': '6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'quotaDefinitionUrl': '/v2/quota_definitions/6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'spaceQuotaDefinitionsUrl': '/v2/organizations/91535f1d-338b-45bf-a2fc-cb28daef4a82/space_quota_definitions',
            'spacesUrl': '/v2/organizations/91535f1d-338b-45bf-a2fc-cb28daef4a82/spaces',
            'status': 'active',
            'usersUrl': '/v2/organizations/91535f1d-338b-45bf-a2fc-cb28daef4a82/users'
          },
          'metadata': {
            'createdAt': '2017-11-27T01:57:32Z',
            'id': '91535f1d-338b-45bf-a2fc-cb28daef4a82',
            'updatedAt': '2017-11-27T01:57:32Z',
            'url': '/v2/organizations/91535f1d-338b-45bf-a2fc-cb28daef4a82'
          }
        },
        {
          'entity': {
            'applicationEventsUrl': '/v2/organizations/841beec4-5d89-4c03-9afb-aa8a5106da8b/app_events',
            'auditorsUrl': '/v2/organizations/841beec4-5d89-4c03-9afb-aa8a5106da8b/auditors',
            'billingEnabled': false,
            'billingManagersUrl': '/v2/organizations/841beec4-5d89-4c03-9afb-aa8a5106da8b/billing_managers',
            'defaultIsolationSegmentId': null,
            'domainsUrl': '/v2/organizations/841beec4-5d89-4c03-9afb-aa8a5106da8b/domains',
            'isolationSegmentUrl': null,
            'managersUrl': '/v2/organizations/841beec4-5d89-4c03-9afb-aa8a5106da8b/managers',
            'name': 'test1234.org',
            'privateDomainsUrl': '/v2/organizations/841beec4-5d89-4c03-9afb-aa8a5106da8b/private_domains',
            'quotaDefinitionId': '6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'quotaDefinitionUrl': '/v2/quota_definitions/6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'spaceQuotaDefinitionsUrl': '/v2/organizations/841beec4-5d89-4c03-9afb-aa8a5106da8b/space_quota_definitions',
            'spacesUrl': '/v2/organizations/841beec4-5d89-4c03-9afb-aa8a5106da8b/spaces',
            'status': 'active',
            'usersUrl': '/v2/organizations/841beec4-5d89-4c03-9afb-aa8a5106da8b/users'
          },
          'metadata': {
            'createdAt': '2017-11-27T02:23:06Z',
            'id': '841beec4-5d89-4c03-9afb-aa8a5106da8b',
            'updatedAt': '2017-11-27T02:23:06Z',
            'url': '/v2/organizations/841beec4-5d89-4c03-9afb-aa8a5106da8b'
          }
        },
        {
          'entity': {
            'applicationEventsUrl': '/v2/organizations/7d0f2004-98b3-4a36-876d-0b910157762a/app_events',
            'auditorsUrl': '/v2/organizations/7d0f2004-98b3-4a36-876d-0b910157762a/auditors',
            'billingEnabled': false,
            'billingManagersUrl': '/v2/organizations/7d0f2004-98b3-4a36-876d-0b910157762a/billing_managers',
            'defaultIsolationSegmentId': null,
            'domainsUrl': '/v2/organizations/7d0f2004-98b3-4a36-876d-0b910157762a/domains',
            'isolationSegmentUrl': null,
            'managersUrl': '/v2/organizations/7d0f2004-98b3-4a36-876d-0b910157762a/managers',
            'name': 'rex-org',
            'privateDomainsUrl': '/v2/organizations/7d0f2004-98b3-4a36-876d-0b910157762a/private_domains',
            'quotaDefinitionId': '6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'quotaDefinitionUrl': '/v2/quota_definitions/6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'spaceQuotaDefinitionsUrl': '/v2/organizations/7d0f2004-98b3-4a36-876d-0b910157762a/space_quota_definitions',
            'spacesUrl': '/v2/organizations/7d0f2004-98b3-4a36-876d-0b910157762a/spaces',
            'status': 'active',
            'usersUrl': '/v2/organizations/7d0f2004-98b3-4a36-876d-0b910157762a/users'
          },
          'metadata': {
            'createdAt': '2017-11-27T07:59:20Z',
            'id': '7d0f2004-98b3-4a36-876d-0b910157762a',
            'updatedAt': '2017-11-27T07:59:20Z',
            'url': '/v2/organizations/7d0f2004-98b3-4a36-876d-0b910157762a'
          }
        },
        {
          'entity': {
            'applicationEventsUrl': '/v2/organizations/2cbf444b-018c-4109-96cf-cd20f859458b/app_events',
            'auditorsUrl': '/v2/organizations/2cbf444b-018c-4109-96cf-cd20f859458b/auditors',
            'billingEnabled': false,
            'billingManagersUrl': '/v2/organizations/2cbf444b-018c-4109-96cf-cd20f859458b/billing_managers',
            'defaultIsolationSegmentId': null,
            'domainsUrl': '/v2/organizations/2cbf444b-018c-4109-96cf-cd20f859458b/domains',
            'isolationSegmentUrl': null,
            'managersUrl': '/v2/organizations/2cbf444b-018c-4109-96cf-cd20f859458b/managers',
            'name': 'demo.org',
            'privateDomainsUrl': '/v2/organizations/2cbf444b-018c-4109-96cf-cd20f859458b/private_domains',
            'quotaDefinitionId': '6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'quotaDefinitionUrl': '/v2/quota_definitions/6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'spaceQuotaDefinitionsUrl': '/v2/organizations/2cbf444b-018c-4109-96cf-cd20f859458b/space_quota_definitions',
            'spacesUrl': '/v2/organizations/2cbf444b-018c-4109-96cf-cd20f859458b/spaces',
            'status': 'active',
            'usersUrl': '/v2/organizations/2cbf444b-018c-4109-96cf-cd20f859458b/users'
          },
          'metadata': {
            'createdAt': '2017-12-01T08:52:03Z',
            'id': '2cbf444b-018c-4109-96cf-cd20f859458b',
            'updatedAt': '2017-12-01T08:52:03Z',
            'url': '/v2/organizations/2cbf444b-018c-4109-96cf-cd20f859458b'
          }
        },
        {
          'entity': {
            'applicationEventsUrl': '/v2/organizations/e23e5a83-4498-4545-82ce-ddb0ed2dd846/app_events',
            'auditorsUrl': '/v2/organizations/e23e5a83-4498-4545-82ce-ddb0ed2dd846/auditors',
            'billingEnabled': false,
            'billingManagersUrl': '/v2/organizations/e23e5a83-4498-4545-82ce-ddb0ed2dd846/billing_managers',
            'defaultIsolationSegmentId': null,
            'domainsUrl': '/v2/organizations/e23e5a83-4498-4545-82ce-ddb0ed2dd846/domains',
            'isolationSegmentUrl': null,
            'managersUrl': '/v2/organizations/e23e5a83-4498-4545-82ce-ddb0ed2dd846/managers',
            'name': 'gnc-org',
            'privateDomainsUrl': '/v2/organizations/e23e5a83-4498-4545-82ce-ddb0ed2dd846/private_domains',
            'quotaDefinitionId': '6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'quotaDefinitionUrl': '/v2/quota_definitions/6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'spaceQuotaDefinitionsUrl': '/v2/organizations/e23e5a83-4498-4545-82ce-ddb0ed2dd846/space_quota_definitions',
            'spacesUrl': '/v2/organizations/e23e5a83-4498-4545-82ce-ddb0ed2dd846/spaces',
            'status': 'active',
            'usersUrl': '/v2/organizations/e23e5a83-4498-4545-82ce-ddb0ed2dd846/users'
          },
          'metadata': {
            'createdAt': '2017-12-05T03:34:07Z',
            'id': 'e23e5a83-4498-4545-82ce-ddb0ed2dd846',
            'updatedAt': '2017-12-05T03:34:07Z',
            'url': '/v2/organizations/e23e5a83-4498-4545-82ce-ddb0ed2dd846'
          }
        },
        {
          'entity': {
            'applicationEventsUrl': '/v2/organizations/8202f78c-d796-46dd-8068-1b8246ee4751/app_events',
            'auditorsUrl': '/v2/organizations/8202f78c-d796-46dd-8068-1b8246ee4751/auditors',
            'billingEnabled': false,
            'billingManagersUrl': '/v2/organizations/8202f78c-d796-46dd-8068-1b8246ee4751/billing_managers',
            'defaultIsolationSegmentId': null,
            'domainsUrl': '/v2/organizations/8202f78c-d796-46dd-8068-1b8246ee4751/domains',
            'isolationSegmentUrl': null,
            'managersUrl': '/v2/organizations/8202f78c-d796-46dd-8068-1b8246ee4751/managers',
            'name': 'jenkins-test',
            'privateDomainsUrl': '/v2/organizations/8202f78c-d796-46dd-8068-1b8246ee4751/private_domains',
            'quotaDefinitionId': '6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'quotaDefinitionUrl': '/v2/quota_definitions/6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'spaceQuotaDefinitionsUrl': '/v2/organizations/8202f78c-d796-46dd-8068-1b8246ee4751/space_quota_definitions',
            'spacesUrl': '/v2/organizations/8202f78c-d796-46dd-8068-1b8246ee4751/spaces',
            'status': 'active',
            'usersUrl': '/v2/organizations/8202f78c-d796-46dd-8068-1b8246ee4751/users'
          },
          'metadata': {
            'createdAt': '2018-01-08T06:18:15Z',
            'id': '8202f78c-d796-46dd-8068-1b8246ee4751',
            'updatedAt': '2018-01-08T06:18:15Z',
            'url': '/v2/organizations/8202f78c-d796-46dd-8068-1b8246ee4751'
          }
        },
        {
          'entity': {
            'applicationEventsUrl': '/v2/organizations/b1e9abf4-fec8-43e3-a15b-79176698391c/app_events',
            'auditorsUrl': '/v2/organizations/b1e9abf4-fec8-43e3-a15b-79176698391c/auditors',
            'billingEnabled': false,
            'billingManagersUrl': '/v2/organizations/b1e9abf4-fec8-43e3-a15b-79176698391c/billing_managers',
            'defaultIsolationSegmentId': null,
            'domainsUrl': '/v2/organizations/b1e9abf4-fec8-43e3-a15b-79176698391c/domains',
            'isolationSegmentUrl': null,
            'managersUrl': '/v2/organizations/b1e9abf4-fec8-43e3-a15b-79176698391c/managers',
            'name': 'sjchoi-org',
            'privateDomainsUrl': '/v2/organizations/b1e9abf4-fec8-43e3-a15b-79176698391c/private_domains',
            'quotaDefinitionId': '6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'quotaDefinitionUrl': '/v2/quota_definitions/6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'spaceQuotaDefinitionsUrl': '/v2/organizations/b1e9abf4-fec8-43e3-a15b-79176698391c/space_quota_definitions',
            'spacesUrl': '/v2/organizations/b1e9abf4-fec8-43e3-a15b-79176698391c/spaces',
            'status': 'active',
            'usersUrl': '/v2/organizations/b1e9abf4-fec8-43e3-a15b-79176698391c/users'
          },
          'metadata': {
            'createdAt': '2018-01-17T01:57:41Z',
            'id': 'b1e9abf4-fec8-43e3-a15b-79176698391c',
            'updatedAt': '2018-01-17T01:57:41Z',
            'url': '/v2/organizations/b1e9abf4-fec8-43e3-a15b-79176698391c'
          }
        },
        {
          'entity': {
            'applicationEventsUrl': '/v2/organizations/425636ea-5d48-44cd-ac8b-6fae54a53cf2/app_events',
            'auditorsUrl': '/v2/organizations/425636ea-5d48-44cd-ac8b-6fae54a53cf2/auditors',
            'billingEnabled': false,
            'billingManagersUrl': '/v2/organizations/425636ea-5d48-44cd-ac8b-6fae54a53cf2/billing_managers',
            'defaultIsolationSegmentId': null,
            'domainsUrl': '/v2/organizations/425636ea-5d48-44cd-ac8b-6fae54a53cf2/domains',
            'isolationSegmentUrl': null,
            'managersUrl': '/v2/organizations/425636ea-5d48-44cd-ac8b-6fae54a53cf2/managers',
            'name': '파스타',
            'privateDomainsUrl': '/v2/organizations/425636ea-5d48-44cd-ac8b-6fae54a53cf2/private_domains',
            'quotaDefinitionId': '6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'quotaDefinitionUrl': '/v2/quota_definitions/6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'spaceQuotaDefinitionsUrl': '/v2/organizations/425636ea-5d48-44cd-ac8b-6fae54a53cf2/space_quota_definitions',
            'spacesUrl': '/v2/organizations/425636ea-5d48-44cd-ac8b-6fae54a53cf2/spaces',
            'status': 'active',
            'usersUrl': '/v2/organizations/425636ea-5d48-44cd-ac8b-6fae54a53cf2/users'
          },
          'metadata': {
            'createdAt': '2018-01-24T01:39:36Z',
            'id': '425636ea-5d48-44cd-ac8b-6fae54a53cf2',
            'updatedAt': '2018-01-31T00:37:23Z',
            'url': '/v2/organizations/425636ea-5d48-44cd-ac8b-6fae54a53cf2'
          }
        },
        {
          'entity': {
            'applicationEventsUrl': '/v2/organizations/98703c79-e802-49d7-a62f-ac0e474c1935/app_events',
            'auditorsUrl': '/v2/organizations/98703c79-e802-49d7-a62f-ac0e474c1935/auditors',
            'billingEnabled': false,
            'billingManagersUrl': '/v2/organizations/98703c79-e802-49d7-a62f-ac0e474c1935/billing_managers',
            'defaultIsolationSegmentId': null,
            'domainsUrl': '/v2/organizations/98703c79-e802-49d7-a62f-ac0e474c1935/domains',
            'isolationSegmentUrl': null,
            'managersUrl': '/v2/organizations/98703c79-e802-49d7-a62f-ac0e474c1935/managers',
            'name': 'pch',
            'privateDomainsUrl': '/v2/organizations/98703c79-e802-49d7-a62f-ac0e474c1935/private_domains',
            'quotaDefinitionId': '6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'quotaDefinitionUrl': '/v2/quota_definitions/6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'spaceQuotaDefinitionsUrl': '/v2/organizations/98703c79-e802-49d7-a62f-ac0e474c1935/space_quota_definitions',
            'spacesUrl': '/v2/organizations/98703c79-e802-49d7-a62f-ac0e474c1935/spaces',
            'status': 'active',
            'usersUrl': '/v2/organizations/98703c79-e802-49d7-a62f-ac0e474c1935/users'
          },
          'metadata': {
            'createdAt': '2018-01-30T02:20:40Z',
            'id': '98703c79-e802-49d7-a62f-ac0e474c1935',
            'updatedAt': '2018-01-30T02:20:40Z',
            'url': '/v2/organizations/98703c79-e802-49d7-a62f-ac0e474c1935'
          }
        },
        {
          'entity': {
            'applicationEventsUrl': '/v2/organizations/e8d2a53f-e5b1-4513-b2cb-ab81aab2ecbe/app_events',
            'auditorsUrl': '/v2/organizations/e8d2a53f-e5b1-4513-b2cb-ab81aab2ecbe/auditors',
            'billingEnabled': false,
            'billingManagersUrl': '/v2/organizations/e8d2a53f-e5b1-4513-b2cb-ab81aab2ecbe/billing_managers',
            'defaultIsolationSegmentId': null,
            'domainsUrl': '/v2/organizations/e8d2a53f-e5b1-4513-b2cb-ab81aab2ecbe/domains',
            'isolationSegmentUrl': null,
            'managersUrl': '/v2/organizations/e8d2a53f-e5b1-4513-b2cb-ab81aab2ecbe/managers',
            'name': 'yschoi-org',
            'privateDomainsUrl': '/v2/organizations/e8d2a53f-e5b1-4513-b2cb-ab81aab2ecbe/private_domains',
            'quotaDefinitionId': 'c106416e-10d8-44c3-8b67-e6339f73cf51',
            'quotaDefinitionUrl': '/v2/quota_definitions/c106416e-10d8-44c3-8b67-e6339f73cf51',
            'spaceQuotaDefinitionsUrl': '/v2/organizations/e8d2a53f-e5b1-4513-b2cb-ab81aab2ecbe/space_quota_definitions',
            'spacesUrl': '/v2/organizations/e8d2a53f-e5b1-4513-b2cb-ab81aab2ecbe/spaces',
            'status': 'active',
            'usersUrl': '/v2/organizations/e8d2a53f-e5b1-4513-b2cb-ab81aab2ecbe/users'
          },
          'metadata': {
            'createdAt': '2018-02-02T08:28:09Z',
            'id': 'e8d2a53f-e5b1-4513-b2cb-ab81aab2ecbe',
            'updatedAt': '2018-04-11T08:52:22Z',
            'url': '/v2/organizations/e8d2a53f-e5b1-4513-b2cb-ab81aab2ecbe'
          }
        },
        {
          'entity': {
            'applicationEventsUrl': '/v2/organizations/acb02c66-e17f-43bf-97c0-fbd8aa725f3c/app_events',
            'auditorsUrl': '/v2/organizations/acb02c66-e17f-43bf-97c0-fbd8aa725f3c/auditors',
            'billingEnabled': false,
            'billingManagersUrl': '/v2/organizations/acb02c66-e17f-43bf-97c0-fbd8aa725f3c/billing_managers',
            'defaultIsolationSegmentId': null,
            'domainsUrl': '/v2/organizations/acb02c66-e17f-43bf-97c0-fbd8aa725f3c/domains',
            'isolationSegmentUrl': null,
            'managersUrl': '/v2/organizations/acb02c66-e17f-43bf-97c0-fbd8aa725f3c/managers',
            'name': 'wyhil',
            'privateDomainsUrl': '/v2/organizations/acb02c66-e17f-43bf-97c0-fbd8aa725f3c/private_domains',
            'quotaDefinitionId': '6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'quotaDefinitionUrl': '/v2/quota_definitions/6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'spaceQuotaDefinitionsUrl': '/v2/organizations/acb02c66-e17f-43bf-97c0-fbd8aa725f3c/space_quota_definitions',
            'spacesUrl': '/v2/organizations/acb02c66-e17f-43bf-97c0-fbd8aa725f3c/spaces',
            'status': 'active',
            'usersUrl': '/v2/organizations/acb02c66-e17f-43bf-97c0-fbd8aa725f3c/users'
          },
          'metadata': {
            'createdAt': '2018-03-05T07:42:16Z',
            'id': 'acb02c66-e17f-43bf-97c0-fbd8aa725f3c',
            'updatedAt': '2018-03-05T07:42:16Z',
            'url': '/v2/organizations/acb02c66-e17f-43bf-97c0-fbd8aa725f3c'
          }
        },
        {
          'entity': {
            'applicationEventsUrl': '/v2/organizations/51c9be27-b59b-410f-8dae-361dde868fb5/app_events',
            'auditorsUrl': '/v2/organizations/51c9be27-b59b-410f-8dae-361dde868fb5/auditors',
            'billingEnabled': false,
            'billingManagersUrl': '/v2/organizations/51c9be27-b59b-410f-8dae-361dde868fb5/billing_managers',
            'defaultIsolationSegmentId': null,
            'domainsUrl': '/v2/organizations/51c9be27-b59b-410f-8dae-361dde868fb5/domains',
            'isolationSegmentUrl': null,
            'managersUrl': '/v2/organizations/51c9be27-b59b-410f-8dae-361dde868fb5/managers',
            'name': 'hyerin-org',
            'privateDomainsUrl': '/v2/organizations/51c9be27-b59b-410f-8dae-361dde868fb5/private_domains',
            'quotaDefinitionId': '6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'quotaDefinitionUrl': '/v2/quota_definitions/6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'spaceQuotaDefinitionsUrl': '/v2/organizations/51c9be27-b59b-410f-8dae-361dde868fb5/space_quota_definitions',
            'spacesUrl': '/v2/organizations/51c9be27-b59b-410f-8dae-361dde868fb5/spaces',
            'status': 'active',
            'usersUrl': '/v2/organizations/51c9be27-b59b-410f-8dae-361dde868fb5/users'
          },
          'metadata': {
            'createdAt': '2018-03-09T07:53:09Z',
            'id': '51c9be27-b59b-410f-8dae-361dde868fb5',
            'updatedAt': '2018-03-09T07:53:09Z',
            'url': '/v2/organizations/51c9be27-b59b-410f-8dae-361dde868fb5'
          }
        },
        {
          'entity': {
            'applicationEventsUrl': '/v2/organizations/f1ca687e-8c5a-49c9-9d0b-3583e77960c0/app_events',
            'auditorsUrl': '/v2/organizations/f1ca687e-8c5a-49c9-9d0b-3583e77960c0/auditors',
            'billingEnabled': false,
            'billingManagersUrl': '/v2/organizations/f1ca687e-8c5a-49c9-9d0b-3583e77960c0/billing_managers',
            'defaultIsolationSegmentId': null,
            'domainsUrl': '/v2/organizations/f1ca687e-8c5a-49c9-9d0b-3583e77960c0/domains',
            'isolationSegmentUrl': null,
            'managersUrl': '/v2/organizations/f1ca687e-8c5a-49c9-9d0b-3583e77960c0/managers',
            'name': 'zjtpdj123-org',
            'privateDomainsUrl': '/v2/organizations/f1ca687e-8c5a-49c9-9d0b-3583e77960c0/private_domains',
            'quotaDefinitionId': '6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'quotaDefinitionUrl': '/v2/quota_definitions/6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'spaceQuotaDefinitionsUrl': '/v2/organizations/f1ca687e-8c5a-49c9-9d0b-3583e77960c0/space_quota_definitions',
            'spacesUrl': '/v2/organizations/f1ca687e-8c5a-49c9-9d0b-3583e77960c0/spaces',
            'status': 'active',
            'usersUrl': '/v2/organizations/f1ca687e-8c5a-49c9-9d0b-3583e77960c0/users'
          },
          'metadata': {
            'createdAt': '2018-03-28T09:11:44Z',
            'id': 'f1ca687e-8c5a-49c9-9d0b-3583e77960c0',
            'updatedAt': '2018-03-28T09:11:44Z',
            'url': '/v2/organizations/f1ca687e-8c5a-49c9-9d0b-3583e77960c0'
          }
        },
        {
          'entity': {
            'applicationEventsUrl': '/v2/organizations/b0ebe421-27bf-4886-ac1a-0e03fed39f99/app_events',
            'auditorsUrl': '/v2/organizations/b0ebe421-27bf-4886-ac1a-0e03fed39f99/auditors',
            'billingEnabled': false,
            'billingManagersUrl': '/v2/organizations/b0ebe421-27bf-4886-ac1a-0e03fed39f99/billing_managers',
            'defaultIsolationSegmentId': null,
            'domainsUrl': '/v2/organizations/b0ebe421-27bf-4886-ac1a-0e03fed39f99/domains',
            'isolationSegmentUrl': null,
            'managersUrl': '/v2/organizations/b0ebe421-27bf-4886-ac1a-0e03fed39f99/managers',
            'name': 'hgcho-org',
            'privateDomainsUrl': '/v2/organizations/b0ebe421-27bf-4886-ac1a-0e03fed39f99/private_domains',
            'quotaDefinitionId': '6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'quotaDefinitionUrl': '/v2/quota_definitions/6487308b-210c-45ac-be6c-fa13dd0e5cff',
            'spaceQuotaDefinitionsUrl': '/v2/organizations/b0ebe421-27bf-4886-ac1a-0e03fed39f99/space_quota_definitions',
            'spacesUrl': '/v2/organizations/b0ebe421-27bf-4886-ac1a-0e03fed39f99/spaces',
            'status': 'active',
            'usersUrl': '/v2/organizations/b0ebe421-27bf-4886-ac1a-0e03fed39f99/users'
          },
          'metadata': {
            'createdAt': '2018-04-16T07:47:34Z',
            'id': 'b0ebe421-27bf-4886-ac1a-0e03fed39f99',
            'updatedAt': '2018-04-16T07:47:34Z',
            'url': '/v2/organizations/b0ebe421-27bf-4886-ac1a-0e03fed39f99'
          }
        }
      ],
      'totalPages': 1,
      'totalResults': 17
    };

    const orgs: Array<Organization> = [];
    const resources = data['resources'] as Array<Object>;
    const length = resources.length;
    this.logger.trace('orgs\' length is', length);
    for (let i = 0; i < length; i++) {
      orgs[i] = new Organization(resources[i]);
      this.logger.trace(orgs[i]);
    }

    return orgs;
  }
}
