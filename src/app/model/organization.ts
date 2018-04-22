import {OrgMappingKeyConstant, OrgSpaceMappingKeyConstant, OrgQuotaMappingKeyConstant} from '../org/org.constant';

export class Organization {
  private orgSpace = null;
  private orgQuota = null;

  constructor(private orgData?: Object) {
    // initialize dummy data when constructor parameter is null or undefined.
    if (orgData === null) {
      orgData = {
        metadata: {
          created_at: '(created_at_dummy)',
          id: '(id_dummy)',
          updated_at: '(updatedAt_dummy)',
          url: '/v2/organizations/(id_dummy)'
        },
        entity: {
          application_events_url: '(applicationEvent_url_dummy)',
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
        }
      };
    }
  }

  private getEntity(): Object {
    return this.orgData[OrgMappingKeyConstant.Entity];
  }

  private getMetadata(): Object {
    return this.orgData[OrgMappingKeyConstant.Metadata];
  }

  // in metadata
  getId(): string {
    if (this.getMetadata().hasOwnProperty(OrgMappingKeyConstant.Id)) {
      return this.getMetadata()[OrgMappingKeyConstant.Id];
    } else if (this.getMetadata().hasOwnProperty(OrgMappingKeyConstant.Guid)) {
      return this.getMetadata()[OrgMappingKeyConstant.Guid];
    }
  }

  getCreatedAt(): string {
    return this.getMetadata()[OrgMappingKeyConstant.CreatedAt];
  }

  getUpdatedAt(): string {
    return this.getMetadata()[OrgMappingKeyConstant.UpdatedAt];
  }

  getURL(): string {
    return this.getMetadata()[OrgMappingKeyConstant.Url];
  }

  // in entity
  getApplicationEventsUrl(): string {
    return this.getEntity()[OrgMappingKeyConstant.ApplicationEventsUrl];
  }

  getAuditorsUrl(): string {
    return this.getEntity()[OrgMappingKeyConstant.AuditorsUrl];
  }

  getBillingEnabled(): string {
    return this.getEntity()[OrgMappingKeyConstant.BillingEnabled];
  }

  getBillingManagersUrl(): string {
    return this.getEntity()[OrgMappingKeyConstant.BillingManagersUrl];
  }

  getDefaultIsolationSegmentId(): string {
    return this.getEntity()[OrgMappingKeyConstant.DefaultIsolationSegmentId];
  }

  getDomainsUrl(): string {
    return this.getEntity()[OrgMappingKeyConstant.DomainsUrl];
  }

  getIsolationSegmentUrl(): string {
    return this.getEntity()[OrgMappingKeyConstant.IsolationSegmentUrl];
  }

  getManagersUrl(): string {
    return this.getEntity()[OrgMappingKeyConstant.ManagersUrl];
  }

  getName(): string {
    return this.getEntity()[OrgMappingKeyConstant.Name];
  }

  getPrivateDomainsUrl(): string {
    return this.getEntity()[OrgMappingKeyConstant.PrivateDomainsUrl];
  }

  getQuotaDefinitionId(): string {
    return this.getEntity()[OrgMappingKeyConstant.QuotaDefinitionId];
  }

  getQuotaDefinitionUrl(): string {
    return this.getEntity()[OrgMappingKeyConstant.QuotaDefinitionUrl];
  }

  getSpaceQuotaDefinitionsUrl(): string {
    return this.getEntity()[OrgMappingKeyConstant.SpaceQuotaDefinitionsUrl];
  }

  getSpacesUrl(): string {
    return this.getEntity()[OrgMappingKeyConstant.SpacesUrl];
  }

  getStatus(): string {
    return this.getEntity()[OrgMappingKeyConstant.Status];
  }

  getUsersUrl(): string {
    return this.getEntity()[OrgMappingKeyConstant.UsersUrl];
  }
}

export class OrgSpace {
  constructor(private orgSpaceData: Object) {
    if (orgSpaceData === null) {
      orgSpaceData = {
        'metadata': {
          'created_at': '(dummy)',
          'id': '(dummy)',
          'updated_at': '(dummy)',
          'url': '(dummy)',
        },
        'entity': {
          'allow_ssh': true,
          'application_events_url': '(dummy)',
          'applications_url': '(dummy)',
          'auditors_url': '(dummy)',
          'developers_url': '(dummy)',
          'domains_url': '(dummy)',
          'events_url': '(dummy)',
          'isolation_segment_id': null,
          'isolation_segment_url': null,
          'managers_url': '(dummy)',
          'name': 'dummy-name',
          'organization_id': '(dummy)',
          'organization_url': '(dummy)',
          'routes_url': '(dummy)',
          'security_groups_url': '(dummy)',
          'service_instances_url': '(dummy)',
          'space_quota_definition_id': null,
          'space_quota_definition_url': null,
          'staging_security_groups_url': '(dummy)',
        }
      };
    }
  }

  private getEntity(): Object {
    return this.orgSpaceData[OrgSpaceMappingKeyConstant.Entity];
  }

  private getMetadata(): Object {
    return this.orgSpaceData[OrgSpaceMappingKeyConstant.Metadata];
  }

  private getAllowSsh(): Object {
    return this.getEntity()[OrgSpaceMappingKeyConstant.AllowSsh];
  }

  private getApplicationEventsUrl(): Object {
    return this.getEntity()[OrgSpaceMappingKeyConstant.ApplicationEventsUrl];
  }

  private getApplicationsUrl(): Object {
    return this.getEntity()[OrgSpaceMappingKeyConstant.ApplicationsUrl];
  }

  private getAuditorsUrl(): Object {
    return this.getEntity()[OrgSpaceMappingKeyConstant.AuditorsUrl];
  }

  private getDevelopersUrl(): Object {
    return this.getEntity()[OrgSpaceMappingKeyConstant.DevelopersUrl];
  }

  private getDomainsUrl(): Object {
    return this.getEntity()[OrgSpaceMappingKeyConstant.DomainsUrl];
  }

  private getEventsUrl(): Object {
    return this.getEntity()[OrgSpaceMappingKeyConstant.EventsUrl];
  }

  private getIsolationSegmentId(): Object {
    return this.getEntity()[OrgSpaceMappingKeyConstant.IsolationSegmentId];
  }

  private getIsolationSegmentUrl(): Object {
    return this.getEntity()[OrgSpaceMappingKeyConstant.IsolationSegmentUrl];
  }

  private getManagersUrl(): Object {
    return this.getEntity()[OrgSpaceMappingKeyConstant.ManagersUrl];
  }

  private getName(): Object {
    return this.getEntity()[OrgSpaceMappingKeyConstant.Name];
  }

  private getOrganizationId(): Object {
    return this.getEntity()[OrgSpaceMappingKeyConstant.OrganizationId];
  }

  private getOrganizationUrl(): Object {
    return this.getEntity()[OrgSpaceMappingKeyConstant.OrganizationUrl];
  }

  private getRoutesUrl(): Object {
    return this.getEntity()[OrgSpaceMappingKeyConstant.RoutesUrl];
  }

  private getSecurityGroupsUrl(): Object {
    return this.getEntity()[OrgSpaceMappingKeyConstant.SecurityGroupsUrl];
  }

  private getServiceInstancesUrl(): Object {
    return this.getEntity()[OrgSpaceMappingKeyConstant.ServiceInstancesUrl];
  }

  private getSpaceQuotaDefinitionId(): Object {
    return this.getEntity()[OrgSpaceMappingKeyConstant.SpaceQuotaDefinitionId];
  }

  private getSpaceQuotaDefinitionUrl(): Object {
    return this.getEntity()[OrgSpaceMappingKeyConstant.SpaceQuotaDefinitionUrl];
  }

  private getStagingSecurityGroupsUrl(): Object {
    return this.getEntity()[OrgSpaceMappingKeyConstant.StagingSecurityGroupsUrl];
  }

  private getCreatedAt(): Object {
    return this.getMetadata()[OrgSpaceMappingKeyConstant.CreatedAt];
  }

  private getId(): Object {
    if (this.getMetadata().hasOwnProperty(OrgSpaceMappingKeyConstant.Id)) {
      return this.getMetadata()[OrgSpaceMappingKeyConstant.Id];
    } else if (this.getMetadata().hasOwnProperty(OrgSpaceMappingKeyConstant.Guid)) {
      return this.getMetadata()[OrgSpaceMappingKeyConstant.Guid];
    }
  }

  private getUpdatedAt(): Object {
    return this.getMetadata()[OrgSpaceMappingKeyConstant.UpdatedAt];
  }

  private getUrl(): Object {
    return this.getMetadata()[OrgSpaceMappingKeyConstant.Url];
  }
}

export class OrgQuota {
  // TODO
  constructor(private orgQuotaData?: Object) {
    if (orgQuotaData === null) {
      orgQuotaData = {
        'entity': {
          'application_instance_limit': '(dummy)',
          'application_task_limit': '(dummy)',
          'instance_memory_limit': '(dummy)',
          'memory_limit': '(dummy)',
          'name': '(dummy)',
          'non_basic_services_allowed': true,
          'total_private_domains': '(dummy)',
          'total_reserved_route_ports': '(dummy)',
          'total_routes': '(dummy)',
          'total_service_keys': '(dummy)',
          'total_services': '(dummy)',
          'trial_database_allowed': false
        },
        'metadata': {
          'created_at': '(dummy)',
          'id': '(dummy)',
          'updated_at': '(dummy)',
          'url': '(dummy)'
        }
      };
    }
  }

  private getEntity() {
    return this.orgQuotaData[OrgQuotaMappingKeyConstant.Entity];
  }

  private getApplicationInstanceLimit() {
    if (this.getEntity().hasOwnProperty(OrgQuotaMappingKeyConstant.ApplicationInstanceLimit)) {
      return this.getEntity()[OrgQuotaMappingKeyConstant.ApplicationInstanceLimit];
    } else if (this.getEntity().hasOwnProperty(OrgQuotaMappingKeyConstant.ApplicationInstanceLimitShort)) {
      return this.getEntity()[OrgQuotaMappingKeyConstant.ApplicationInstanceLimitShort];
    }
  }

  private getApplicationTaskLimit() {
    if (this.getEntity().hasOwnProperty(OrgQuotaMappingKeyConstant.ApplicationTaskLimit)) {
      return this.getEntity()[OrgQuotaMappingKeyConstant.ApplicationTaskLimit];
    } else if (this.getEntity().hasOwnProperty(OrgQuotaMappingKeyConstant.ApplicationTaskLimitShort)) {
      return this.getEntity()[OrgQuotaMappingKeyConstant.ApplicationTaskLimitShort];
    }
  }

  private getInstanceMemoryLimit() {
    return this.getEntity()[OrgQuotaMappingKeyConstant.InstanceMemoryLimit];
  }

  private getMemoryLimit() {
    return this.getEntity()[OrgQuotaMappingKeyConstant.MemoryLimit];
  }

  private getName() {
    return this.getEntity()[OrgQuotaMappingKeyConstant.Name];
  }

  private getNonBasicServicesAllowed() {
    return this.getEntity()[OrgQuotaMappingKeyConstant.NonBasicServicesAllowed];
  }

  private getTotalPrivateDomains() {
    return this.getEntity()[OrgQuotaMappingKeyConstant.TotalPrivateDomains];
  }

  private getTotalReservedRoutePorts() {
    return this.getEntity()[OrgQuotaMappingKeyConstant.TotalReservedRoutePorts];
  }

  private getTotalRoutes() {
    return this.getEntity()[OrgQuotaMappingKeyConstant.TotalRoutes];
  }

  private getTotalServiceKeys() {
    return this.getEntity()[OrgQuotaMappingKeyConstant.TotalServiceKeys];
  }

  private getTotalServices() {
    return this.getEntity()[OrgQuotaMappingKeyConstant.TotalServices];
  }

  private getTrialDatabaseAllowed() {
    if (this.getEntity().hasOwnProperty(OrgQuotaMappingKeyConstant.TrialDatabaseAllowed)) {
      return this.getEntity()[OrgQuotaMappingKeyConstant.TrialDatabaseAllowed];
    } else if (this.getEntity().hasOwnProperty(OrgQuotaMappingKeyConstant.TrialDatabaseAllowedShort)) {
      return this.getEntity()[OrgQuotaMappingKeyConstant.TrialDatabaseAllowedShort];
    }
  }

  private getMetadata() {
    return this.orgQuotaData[OrgQuotaMappingKeyConstant.Metadata];
  }

  private getCreatedAt() {
    return this.getMetadata()[OrgQuotaMappingKeyConstant.CreatedAt];
  }

  private getId() {
    if (this.getMetadata().hasOwnProperty(OrgQuotaMappingKeyConstant.Id)) {
      return this.getMetadata()[OrgQuotaMappingKeyConstant.Id];
    } else if (this.getMetadata().hasOwnProperty(OrgQuotaMappingKeyConstant.Guid)) {
      return this.getMetadata()[OrgQuotaMappingKeyConstant.Guid];
    }
  }

  private getUpdatedAt() {
    return this.getMetadata()[OrgQuotaMappingKeyConstant.UpdatedAt];
  }

  private getUrl() {
    return this.getMetadata()[OrgQuotaMappingKeyConstant.Url];
  }
}
