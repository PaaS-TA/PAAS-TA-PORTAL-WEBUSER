import {OrgQuota} from './org-quota';
import {Space} from './space';

export class App {
  /*
  // DATA MODEL IS...

   "apps": [
   {
   "detected_buildpack": null,
   "detected_buildpack_guid": null,
   "enable_ssh": true,
   "guid": "74a53476-62e5-4dca-b21a-584e686e56ca",
   "package_state": "PENDING",
   "package_updated_at": null,
   "ports": null,
   "routes": [
   {
   "domain": {
   "guid": "b2d56523-2258-450d-898b-7f7691c6f104",
   "name": "115.68.46.187.xip.io",
   "owning_organization_guid": null,
   "router_group_guid": null,
   "router_group_type": null
   },
   "host": "sdfg",
   "guid": "0cf33247-6ded-4672-8caa-51bb1aef1e81",
   "path": "",
   "port": null
   }
   ],
   "running_instances": 0,
   "service_count": 0,
   "service_names": [],
   "urls": [
   "sdfg.115.68.46.187.xip.io"
   ],
   "version": "815159e1-40c5-4b9a-9194-383afabc0bc1",
   "buildpack": "java_buildpack",
   "command": null,
   "console": false,
   "debug": null,
   "detected_start_command": "",
   "diego": true,
   "disk_quota": 1024,
   "docker_credentials": null,
   "docker_credentials_json": null,
   "docker_image": null,
   "environment_json": {},
   "health_check_http_endpoint": null,
   "health_check_timeout": null,
   "health_check_type": "port",
   "instances": 1,
   "memory": 512,
   "name": "sdfg",
   "production": false,
   "space_guid": "0aae1950-0fe0-406d-824b-70e9b1f19364",
   "stack_guid": "b0b4669e-260e-4684-9165-a825c3e327df",
   "staging_failed_description": null,
   "staging_failed_reason": null,
   "staging_task_id": null,
   "state": "STOPPED"
   }
   }
  */

  private _metadata;
  private _entity;
  private _orgIndex: number = -1;
  private _orgSpaces: Array<Space>;
  private _orgQuota: OrgQuota;

  constructor(metadataParam, entityParam) {
    // initialize dummy data when constructor parameter is null or undefined.

    // initialize metadata as dummy
    this.metadata = metadataParam;

    // initialize entity as dummy
    this.entity = entityParam;
  }

  private get metadata() {
    return this._metadata;
  }

  // using constructor or refreshing
  private set metadata(extMetadata) {
    if (extMetadata === null || extMetadata === undefined) {
      this._metadata = {
        created_at: '(created_at_dummy)',
        guid: '(id_dummy)',
        updated_at: '(updatedAt_dummy)',
      };
    } else {
      this._metadata = extMetadata;
    }
  }

  private get entity() {
    return this._entity;
  }

  private set entity(extEntity) {
    if (extEntity === null || extEntity === undefined) {
      this._entity = {
        name: '(name_dummy)',
        instances: '(instances_dummy)',
        memory: '(memory_dummy)',
      };
    } else {
      this._entity = extEntity;
    }
  }

  get indexOfOrgs() {
    return this._orgIndex;
  }

  set indexOfOrgs(index: number) {
    this._orgIndex = index;
  }

  get spaces() {
    return this._orgSpaces;
  }

  set spaces(extSpaces: Array<Space>) {
    this._orgSpaces = extSpaces;
  }

  getSpace(index: number) {
    return this.spaces[index];
  }

  pushSpace(space: Space) {
    this.spaces.push(space);
  }

  get quota() {
    return this._orgQuota;
  }

  set quota(extQuota: OrgQuota) {
    this._orgQuota = extQuota;
  }

  get guid() {
    return this.metadata.guid;
  }

  get createdAt() {
    return this.metadata.created_at;
  }

  get updatedAt() {
    return this.metadata.updated_at;
  }

  // set org name (related renaming organization)
  set name(nameParam: String) {
    this.entity.name = nameParam;
  }

  get name() {
    return this.entity.name;
  }

  get instances() {
    return this.entity.instances;
  }

  get memory() {
    return this.entity.memory;
  }


}
