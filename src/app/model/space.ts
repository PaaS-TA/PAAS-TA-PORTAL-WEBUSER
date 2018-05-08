export class Space {
  private _metadata;
  private _entity;
  private _orgGuid;

  private static emptyInstance: Space = null;

  constructor(metadataParam, entityParam, orgGuidParam) {
    // initialize dummy data when constructor parameter is null or undefined.

    // initialize metadata as dummy
    this.metadata = metadataParam;

    // initialize entity as dummy
    this.entity = entityParam;

    this.orgGuid = orgGuidParam;
  }

  static empty(): Space {
    if (this.emptyInstance === null)
      this.emptyInstance = new Space(null, null, null);

    return this.emptyInstance;
  }

  private get metadata() {
    return this._metadata;
  }

  private set metadata(extMetadata) {
    if (extMetadata === null || extMetadata === undefined) {
      this._metadata = {
        created_at: '(created_at_dummy)',
        guid: '(id_dummy)',
        updated_at: '(updatedAt_dummy)',
        url: '(space_url_dummy)',
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
        allow_ssh: true,
        application_events_url: '(dummy)',
        applications_url: '(dummy)',
        auditors_url: '(dummy)',
        developers_url: '(dummy)',
        domains_url: '(dummy)',
        events_url: '(dummy)',
        isolation_segment_id: '(dummy)',
        isolation_segment_url: '(dummy)',
        managers_url: '(dummy)',
        name: '(dummy-name)',
        organization_id: '(dummy)',
        organization_url: '(dummy)',
        routes_url: '(dummy)',
        security_groups_url: '(dummy)',
        service_instances_url: '(dummy)',
        space_quota_definition_id: '(dummy)',
        space_quota_definition_url: '(dummy)',
        staging_security_groups_url: '(dummy)',
      };
    } else {
      this._entity = extEntity;
    }
  }

  get orgGuid() {
    return this._orgGuid;
  }

  set orgGuid(extOrgGuid) {
    this._orgGuid = extOrgGuid;
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

  get allowSsh() {
    return this.entity.allow_ssh;
  }

  get applicationEventsUrl() {
    return this.entity.application_events_url;
  }

  get applicationsUrl() {
    return this.entity.applications_url;
  }

  get auditorsUrl() {
    return this.entity.auditors_url;
  }

  get developersUrl() {
    return this.entity.developers_url;
  }

  get domainsUrl() {
    return this.entity.domains_url;
  }

  get eventsUrl() {
    return this.entity.events_url;
  }

  get isolationSegmentId() {
    return this.entity.isolation_segment_id;
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

  set name(nameParam: String) {
    this.entity.name = nameParam;
  }

  get organizationId() {
    return this.entity.organization_id;
  }

  get organizationUrl() {
    return this.entity.organization_url;
  }

  get routesUrl() {
    return this.entity.routes_url;
  }

  get securityGroupsUrl() {
    return this.entity.security_groups_url;
  }

  get serviceInstancesUrl() {
    return this.entity.service_instances_url;
  }

  get spaceQuotaDefinitionId() {
    return this.entity.space_quota_definition_id;
  }

  get spaceQuotaDefinitionUrl() {
    return this.entity.space_quota_definition_url;
  }

  get stagingSecurityGroupsUrl() {
    return this.entity.staging_security_groups_url;
  }

  static compareTo(spaceAndy: Space, spaceBeak: Space): number {
    if (spaceAndy === null && spaceBeak === null)
      return 0;
    else if (spaceAndy === null)
      return -1;
    else if (spaceBeak === null)
      return 1;

    const createdAtAndy = spaceAndy.createdAt;
    const createdAtBeak = spaceBeak.createdAt;
    if (createdAtAndy === createdAtBeak)
      return 0;
    else if (createdAtAndy < createdAtBeak)
      return -1;
    else
      return 0;
  }
}
