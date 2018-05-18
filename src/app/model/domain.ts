export class Domain {
  /*
  // DATA MODEL IS...
  private metadata = {
    created_at: null,
    guid: null,
    updated_at: null,
    url: null
  };

  private entity = {
    name: null,
    owning_organization_guid: null,
    router_group_guid: null,
    router_group_type: null,
    shared_organizations: null
  }
  */

  private _metadata;
  private _entity;

  constructor(metadata?, entity?) {
    this.metadata = metadata;
    this.entity = entity;
  }

  static empty() {
    return new Domain(null, null);
  }

  private get metadata(){
    return this._metadata;
  }

  private set metadata(extMetadata) {
    if (extMetadata === null || extMetadata === undefined) {
      this._metadata = {
        created_at: '(created_at_dummy)',
        guid: '(id_dummy)',
        updated_at: '(updatedAt_dummy)',
        url: '(quota_url_dummy)'
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
        owning_organization_guid: '(org_guid_dummy)',
        router_group_guid: null,
        router_group_type: null,
        shared_organizations: null
      };
    } else {
      this._entity = extEntity;
    }
  }

  //////    in metadata    //////
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

  //////    in entity    //////
  get name() {
    return this.entity.name;
  }

  get owningOrganizationId() {
    return this.entity.owning_organization_guid;
  }

  get routerGroupGuid() {
    return this.entity.router_group_guid;
  }

  get routerGroupType() {
    return this.entity.router_group_type;
  }

  get sharedOrganizations(): Array<String> {
    return this.entity.shared_organizations.split(',').map((v) => {
      return v.trim();
    });
  }

  get shared(): boolean {
    return (this.owningOrganizationId === null || this.owningOrganizationId === undefined);
  }
}
