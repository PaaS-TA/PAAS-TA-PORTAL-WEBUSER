/**
 * Quota that specialized for organization
 *
 * @author hgcho
 * @version 1.0
 * @since 2018.4.25
 */
export class OrgQuota {
  private _metadata;
  private _entity;

  private pricelessPolicy = 'free';
  private pricePolicy = 'paid';

  private static emptyInstance: OrgQuota = null;

  constructor(metadataParam?, entityParam?) {
    // initialize dummy data when constructor parameter is null or undefined.
    // initialize metadata as dummy
    this.metadata = metadataParam;

    // initialize entity as dummy
    this.entity = entityParam;
  }

  static empty() {
    return new OrgQuota(null, null);
  }

  get valid(): boolean {
    return this.metadata.guid !== '(id_dummy)' && this.entity.name !== '(dummy)';
  }

  fill(metadata, entity) {
    this.metadata = metadata;
    this.entity = entity;
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
        app_instance_limit: '(dummy)',
        app_task_limit: '(dummy)',
        instance_memory_limit: '(dummy)',
        memory_limit: '(dummy)',
        name: '(dummy)',
        non_basic_services_allowed: '(dummy)',
        total_private_domains: '(dummy)',
        total_reserved_route_ports: '(dummy)',
        total_routes: '(dummy)',
        total_service_keys: '(dummy)',
        total_services: '(dummy)',
        trial_database_allowed: '(dummy)'
      };
    } else {
      this._entity = extEntity;
    }
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

  get applicationInstanceLimit() {
    // TODO Globalization of returning value
    const value = this.entity.app_instance_limit;
    if (value === -1)
      return '무제한';
    else
      return value;
  }

  get applicationTaskLimit() {
    // TODO Globalization of returning value
    const value = this.entity.app_task_limit;
    if (value === -1)
      return '무제한';
    else
      return value;
  }

  get instanceMemoryLimit() {
    // TODO Globalization of returning value
    const value = this.entity.instance_memory_limit;
    if (value === -1)
      return '무제한';
    else
      return value;
  }

  get memoryLimit() {
    // TODO Globalization of returning value
    const value = this.entity.memory_limit;
    if (value === -1)
      return '무제한';
    else
      return value;
  }

  get name() {
    return this.entity.name;
  }

  set name(nameParam: String) {
    this.entity.name = nameParam;
  }

  get nonBasicServicesAllowed() {
    return this.entity.non_basic_services_allowed;
  }

  get totalPrivateDomains() {
    return this.entity.non_basic_services_allowed;
  }

  get totalReservedRoutePorts() {
    return this.entity.total_reserved_route_ports;
  }

  get totalRoutes() {
    return this.entity.total_routes;
  }

  get totalServiceKeys() {
    return this.entity.total_service_keys;
  }

  get totalServices() {
    return this.entity.total_services;
  }

  get trialDatabaseAllowed() {
    return this.entity.trial_database_allowed;
  }

  get price(): String {
    // TODO Globalization of returning value
    if (this.name.search(this.pricePolicy) >= 0) {
      return this.pricePolicy;
    } else if (this.name.search(this.pricelessPolicy) >= 0) {
      return this.pricelessPolicy;
    }

    /*
    if (this.name.search('default') >= 0) {
      return this.pricelessPolicy;
    }
    */
    return this.pricelessPolicy;
  }

  get priceKorean(): String {
    // TODO Globalization of returning value
    switch(this.price) {
      case this.pricePolicy:
        return '유료';
      case this.pricelessPolicy:
        return '무료';
      default:
        return '무료';
    }
  }

  isFree(): boolean {
    if (this.price === 'free') {
      return true;
    } else {
      return false;
    }
  }
}
