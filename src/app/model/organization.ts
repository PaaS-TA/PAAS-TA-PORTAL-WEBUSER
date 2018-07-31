import {OrgQuota} from './org-quota';
import {Space} from './space';

export class Organization {
  /*
  // DATA MODEL IS...
  private metadata = {
    created_at: null,
    guid: null,
    updated_at: null,
    url: null,
  };

  private entity = {
    application_events_url: null,
    auditors_url: null,
    billing_enabled: null,
    billing_managers_url: null,
    default_isolation_segment_id: null,
    domains_url: null,
    isolation_segment_url: null,
    managers_url: null,
    name: null,
    private_domains_url: null,
    quota_definition_id: null,
    quota_definition_url: null,
    space_quota_definitions_url: null,
    spaces_url: null,
    status: null,
    users_url: null,
  };
  */

  private _metadata;
  private _entity;
  private _orgSpaces: Array<Space> = [];
  private _orgQuota: OrgQuota;
  private orgIndex: number;

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
        url: '(org_url_dummy)'
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
        application_events_url: '(application_event_url_dummy)',
        auditors_url: '(auditors_url_dummy)',
        billing_enabled: '(billing_enabled_dummy)',
        billing_managers_url: '(billing_managers_url_dummy)',
        default_isolation_segment_id: '(default_isolation_segment_id_dummy)',
        domains_url: '(domains_url_dummy)',
        isolation_segment_url: '(isolation_segment_url_dummy)',
        managers_url: '(managers_url_dummy)',
        name: '(name_dummy)',
        private_domains_url: '(private_domains_url_dummy)',
        quota_definition_id: '(quota_definition_id_dummy)',
        quota_definition_url: '(quota_definition_url_dummy)',
        space_quota_definitions_url: '(space_quota_definitions_url_dummy)',
        spaces_url: '(space_url_dummy)',
        status: '(status_dummy)',
        users_url: '(users_url_dummy)',
      };
    } else {
      this._entity = extEntity;
    }
  }

  get indexOfOrgs() {
    return this.orgIndex;
  }

  set indexOfOrgs(index: number) {
    this.orgIndex = index;
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

  get url() {
    return this.metadata.url;
  }

  get applicationEventsUrl() {
    return this.entity.application_events_url;
  }

  get auditorsUrl() {
    return this.entity.auditors_url;
  }


  get billingEnabled() {
    return this.entity.billing_enabled;
  }


  get billingManagersUrl() {
    return this.entity.billing_managers_url;
  }


  get defaultIsolationSegmentId() {
    return this.entity.default_isolation_segment_id;
  }


  get domainsUrl() {
    return this.entity.domains_url;
  }


  get isolationSegmentUrl() {
    return this.entity.isolation_segment_url;
  }


  get managersUrl() {
    return this.entity.managers_url;
  }


  get name() {
    return this.entity.name;
  }

  // set org name (related renaming organization)
  set name(nameParam: String) {
    this.entity.name = nameParam;
  }


  get privateDomainsUrl() {
    return this.entity.private_domains_url;
  }


  get quotaDefinitionId() {
    return this.entity.quota_definition_id;
  }


  get quotaDefinitionUrl() {
    return this.entity.quota_definition_url;
  }


  get spaceQuotaDefinitionsUrl() {
    return this.entity.space_quota_definitions_url;
  }


  get spacesUrl() {
    return this.entity.spaces_url;
  }


  get status() {
    return this.entity.status;
  }

  get usersUrl() {
    return this.entity.users_url;
  }

  public OrgName() : string{
    return this.entity.name;
  }

  /**
   * Comparable.compareTo method implementation for Organization
   * @param {Organization} objA
   * @param {Organization} objB
   * @returns {number}
   */
  static compareTo(objA: Organization, objB: Organization): number {
    if (objA === null && objB === null)
      return 0;
    else if (objA === null)
      return -1;
    else if (objB === null)
      return 1;

    const nameA = objA.name;
    const nameB = objB.name;
    if (nameA === nameB)
      return 0;
    else if (nameA < nameB)
      return -1;
    else
      return 1;
  }
}
