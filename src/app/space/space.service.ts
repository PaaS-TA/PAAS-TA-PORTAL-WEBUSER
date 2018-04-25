import {CommonService} from '../common/common.service';
import {Space} from '../model/space';
import { SpaceURLConstant } from './space.constant';
import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';

@Injectable()
export class SpaceService {
  constructor(private common: CommonService, private logger: NGXLogger) {}

  private getToken() {
    return this.common.getToken();
  }

  public getOrgSpaceList(orgId: string): Array<Space> {
    const spaces: Array<Space> = [];
    const url: string = SpaceURLConstant.URLSpaceInformationPrefix + orgId + SpaceURLConstant.URLSpaceInformationPostfix;
    const observable = this.common.doGET(url, this.getToken());
    observable.subscribe(data => {
      if (data.hasOwnProperty('spaceList')) {
        const spaceList = data['spaceList'];
        if (spaceList.hasOwnProperty('resources')) {
          (spaceList['resources'] as Array<Object>).forEach(spaceData => {
            const index =
              spaces.push(new Space(spaceData['metadata'], spaceData['entity'], orgId)) - 1;
            this.logger.trace('Org(', index, ') :', spaces[index]);
          });
        }
        this.logger.debug('OrgList :', spaces);
      }
    });

    return spaces;
  }

  public getOrgSpaceListSample(): Array<Space> {
    const data = this.getSampleOrgSpaceList();
    const spaces: Array<Space> = [];
    data.spaceList.resources.forEach(spaceData => {
      const index = spaces.push(new Space(spaceData['metadata'], spaceData['entity'], null)) - 1;
      this.logger.trace(spaces[index]);
    });

    return spaces;
  }

  // sample
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
}
