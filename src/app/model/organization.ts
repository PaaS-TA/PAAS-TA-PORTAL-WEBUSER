import {OrgMappingKeyConstant, OrgSpaceMappingKeyConstant, OrgQuotaMappingKeyConstant} from '../org/org.constant';
import {Input} from '@angular/core';

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
}

export class OrgSpace {
  private _metadata;
  private _entity;

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

  private set metadata(extMetadata) {
    if (extMetadata === null || extMetadata === undefined) {
      this._metadata = {
        created_at: '(created_at_dummy)',
        guid: '(id_dummy)',
        updated_at: '(updatedAt_dummy)',
        url: '(space_url_dummy)'
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
}

export class OrgQuota {
  private _metadata;
  private _entity;

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
        application_instance_limit: '(dummy)',
        application_task_limit: '(dummy)',
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
    return this.entity.application_instance_limit;
  }

  get applicationTaskLimit() {
    return this.entity.application_task_limit;
  }

  get instanceMemoryLimit() {
    return this.entity.instance_memory_limit;
  }

  get memoryLimit() {
    return this.entity.memory_limit;
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
}
