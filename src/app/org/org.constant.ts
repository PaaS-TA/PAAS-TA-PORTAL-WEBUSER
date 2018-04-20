/**
 * Module file for Org.
 */
export enum OrgURLConstant {
  // URLs
  URLOrgListUsingToken = '/portalapi/v2/orgs',
  URLOrgListAdminOnly = '/portalapi/v2/orgs-admin',
}

export enum OrgMappingKeyConstant {
  // metadata
  Metadata = 'metadata',
  // in metadata
  Id = 'id',
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt',
  Url = 'url',

  // entity
  Entity = 'entity',
  // in entity
  ApplicationEventsUrl = 'applicationEventsUrl',
  AuditorsUrl = 'auditorsUrl',
  BillingEnabled = 'billingEnabled',
  BillingManagersUrl = 'billingManagersUrl',
  DefaultIsolationSegmentId = 'defaultIsolationSegmentId',
  DomainsUrl = 'domainsUrl',
  IsolationSegmentUrl = 'isolationSegmentUrl',
  ManagersUrl = 'managersUrl',
  Name = 'name',
  PrivateDomainsUrl = 'privateDomainsUrl',
  QuotaDefinitionId = 'quotaDefinitionId',
  QuotaDefinitionUrl = 'quotaDefinitionUrl',
  SpaceQuotaDefinitionsUrl = 'spaceQuotaDefinitionsUrl',
  SpacesUrl = 'spacesUrl',
  Status = 'status',
  UsersUrl = 'usersUrl',
}