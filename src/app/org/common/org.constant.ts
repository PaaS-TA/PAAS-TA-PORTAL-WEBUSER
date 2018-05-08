/**
 * Module file for Org.
 */
export enum OrgURLConstant {
  // URLs
  URLOrgListUsingToken = '/portalapi/v2/orgs',
  URLOrgListAdminOnly = '/portalapi/v2/orgs-admin',

  // /portalapi/v2/orgs/{org-id}
  URLOrgFullyInformation = '/portalapi/v2/orgs',

  URLOrgRequestBase = '/portalapi/v2/orgs/',

  // /portalapi/v2/orgs/{org-id}/summary
  URLOrgSummaryInformationHead = URLOrgRequestBase,
  URLOrgSummaryInformationTail = '/summary',

  // /portalapi/v2/orgs/{org-id}/space
  URLOrgSpaceInformationHead = URLOrgRequestBase,
  URLOrgSpaceInformationTail = '/spaces',

  // /portalapi/v2/orgs/{org-id}/quota
  URLOrgQuotaInformationHead = URLOrgRequestBase,
  URLOrgQuotaInformationTail = '/quota',

  URLOrgAvailableQuotas = '/portalapi/v2/orgs/quota-definitions'
}

/*
export enum OrgMappingKeyConstant {
  // metadata
  Metadata = 'metadata',
  // in metadata
  Id = 'id',
  Guid = 'guid',
  CreatedAt = 'created_at',
  UpdatedAt = 'updated_at',
  Url = 'url',

  // entity
  Entity = 'entity',
  // in entity
  ApplicationEventsUrl = 'application_events_url',
  AuditorsUrl = 'auditors_url',
  BillingEnabled = 'billing_enabled',
  BillingManagersUrl = 'billing_managers_url',
  DefaultIsolationSegmentId = 'default_isolation_segment_id',
  DomainsUrl = 'domains_url',
  IsolationSegmentUrl = 'isolation_segment_url',
  ManagersUrl = 'managers_url',
  Name = 'name',
  PrivateDomainsUrl = 'private_domains_url',
  QuotaDefinitionId = 'quota_definition_id',
  QuotaDefinitionUrl = 'quota_definition_url',
  SpaceQuotaDefinitionsUrl = 'space_quota_definitions_url',
  SpacesUrl = 'spaces_url',
  Status = 'status',
  UsersUrl = 'users_url',
}

export enum OrgSpaceMappingKeyConstant {
  // Org Space
  // metadata
  Metadata = 'metadata',
  // in metadata
  CreatedAt = 'created_at',
  Id = 'id',
  Guid = 'guid',
  UpdatedAt = 'updated_at',
  Url = 'url',

  // entity
  Entity = 'entity',
  // in entity
  AllowSsh = 'allow_ssh',
  ApplicationEventsUrl = 'application_events_url',
  ApplicationsUrl = 'applications_url',
  AuditorsUrl = 'auditors_url',
  DevelopersUrl = 'developers_url',
  DomainsUrl = 'domains_url',
  EventsUrl = 'events_url',
  IsolationSegmentId = 'isolation_segment_id',
  IsolationSegmentUrl = 'isolation_segment_url',
  ManagersUrl = 'managers_url',
  Name = 'name',
  OrganizationId = 'organization_id',
  OrganizationUrl = 'organization_url',
  RoutesUrl = 'routes_url',
  SecurityGroupsUrl = 'security_groups_url',
  ServiceInstancesUrl = 'service_instances_url',
  SpaceQuotaDefinitionId = 'space_quota_definition_id',
  SpaceQuotaDefinitionUrl = 'space_quota_definition_url',
  StagingSecurityGroupsUrl = 'staging_security_groups_url',
}

export enum OrgQuotaMappingKeyConstant {
  // metadata
  Metadata = 'metadata',
  // in metadata
  CreatedAt = 'created_at',
  Id = 'id',
  Guid = 'guid',
  UpdatedAt = 'updated_at',
  Url = 'url',

  // entity
  Entity = 'entity',
  // in entity
  ApplicationInstanceLimit = 'application_instance_limit',
  ApplicationInstanceLimitShort = 'app_instance_limit',
  ApplicationTaskLimit = 'application_task_limit',
  ApplicationTaskLimitShort = 'app_task_limit',
  InstanceMemoryLimit = 'instance_memory_limit',
  MemoryLimit = 'memory_limit',
  Name = 'name',
  NonBasicServicesAllowed = 'non_basic_services_allowed',
  TotalPrivateDomains = 'total_private_domains',
  TotalReservedRoutePorts = 'total_reserved_route_ports',
  TotalRoutes = 'total_routes',
  TotalServiceKeys = 'total_service_keys',
  TotalServices = 'total_services',
  TrialDatabaseAllowed = 'trial_database_allowed',
  TrialDatabaseAllowedShort = 'trial_db_allowed',

}
*/
