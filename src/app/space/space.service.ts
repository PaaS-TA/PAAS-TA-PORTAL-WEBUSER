import {CommonService} from '../common/common.service';
import {Space} from '../model/space';
import { SpaceURLConstant } from './space.constant';
import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {OrgURLConstant} from "../org/common/org.constant";
import {Subscription} from "rxjs/Subscription";

@Injectable()
export class SpaceService {
  constructor(private common: CommonService, private logger: NGXLogger) {}

  private getToken() {
    return this.common.getToken();
  }

  public getOrgSpaceList(orgId: String, func?: Function): Array<Space> {
    const spaces: Array<Space> = [];
    const url: string = OrgURLConstant.URLOrgSpaceInformationHead + orgId + OrgURLConstant.URLOrgSpaceInformationTail;
    const observable = this.common.doGet(url, this.getToken());
    observable.subscribe(data => {
      if (data.hasOwnProperty('spaceList')) {
        const spaceList = data['spaceList'];
        if (spaceList.hasOwnProperty('resources')) {
          (spaceList['resources'] as Array<Object>).forEach(spaceData => {
            const index =
              spaces.push(new Space(spaceData['metadata'], spaceData['entity'], orgId)) - 1;
            this.logger.trace('Org.spaces(', index, ') :', spaces[index]);
          });
        }
        this.logger.debug('Org(', orgId, ').SpaceList :', spaces);
      }
      if (func !== null && func !== undefined)
        func();
    });

    return spaces;
  }

  /**
   * Create space (Post)
   * @param {String} orgId
   * @param {String} wantedName
   */
  public createSpace(spaces: Array<Space>, orgId: String, wantedName: String) {
    const url: string = SpaceURLConstant.URLSpaceCreatePrefix;
    const requestBody = {
      orgGuid: orgId,  // organization's guid
      spaceName: wantedName,  // wanted new space's name
    };

    this.common.isLoading = true;
    const observable = this.common.doPost(url, requestBody, this.getToken());
    observable.subscribe( data => {
      if (data.hasOwnProperty('metadata') && data['metadata'].hasOwnProperty('guid')
        && data.hasOwnProperty('entity') && data['entity'].hasOwnProperty('name')) {
        let space: Space = new Space(data['metadata'], data['entity'], orgId);
        spaces.push(space);
        this.common.isLoading = false;
      }
    });
  }

  /**
   * Rename space (Put)
   * @param {Space} space
   * @param {String} wantedNewName
   */
  public renameSpace(space: Space, wantedNewName: String) {
    const url: string = SpaceURLConstant.URLSpaceRenamePrefix;
    const requestBody = {
      guid: space.guid,
      newSpaceName: wantedNewName
    };

    this.common.isLoading = true;
    const observable = this.common.doPut(url, requestBody, this.getToken());
    observable.subscribe(data => {
      if (data.hasOwnProperty('metadata') && data['metadata'].hasOwnProperty('guid')
        && data.hasOwnProperty('entity') && data['entity'].hasOwnProperty('name')) {
        const guid = data['metadata']['guid'];
        const name = data['entity']['name'];
        if (guid === space.guid) {
          space.name = name;
        } else {
          this.logger.error("Request GUID and response GUID don't match!");
          this.logger.error("Request GUID : ", space.guid);
          this.logger.error("Response GUID : ", guid);
        }
        this.common.isLoading = false;
      }
    });
  }

  /**
   * Delete space (Delete)
   * @param {Space} space
   * @param {boolean} isRecursive
   */
  public deleteSpace(spaces: Array<Space>, space: Space, isRecursive: boolean) {
    const url: string = SpaceURLConstant.URLSpaceDeletePrefix;
    const requestParam = {  // Delete Method cannot bind body (RFC7231#Section-4.3.5)
      guid: space.guid,
      recursive: isRecursive,
    };

    this.common.isLoading = true;
    const observable = this.common.doDelete(url, requestParam, this.getToken());
    observable.subscribe(data => {
      if (data.hasOwnProperty('entity') && data['entity']['error'] === null) {
        const index = spaces.findIndex(s => s.guid === requestParam.guid );
        if (index !== -1) {
          //this.setSpaces(this.spaces.filter(space => space !== this.selectSpace));
          spaces.splice(index, 1);
        } else {
          this.logger.error("Cannot find to delete space in Space list...", space.name);
        }
      } else {
        this.logger.error('Error : ', data);
      }
      this.common.isLoading = false;
    })
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
