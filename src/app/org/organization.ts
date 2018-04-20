import { OrgMappingKeyConstant } from './org.constant';

export class Organization {
  private orgSpaces = null;
  private orgQuotas = null;
  
  constructor(private orgData: Object) {
    // initialize dummy data when constructor parameter is null or undefined.
    orgData = {
      metadata: {
        createdAt: '(createdAtDummy)',
        id: '(idDummy)',
        updatedAt: '(updatedAtDummy)',
        url: '/v2/organizations/(idDummy)'
      },
      entity: {
        applicationEventsUrl: '(applicationEventUrlDummy)',
        auditorsUrl: '(auditorsUrlDummy)',
        billingEnabled: '(billingEnabledDummy)',
        billingManagersUrl: '(billingManagersUrlDummy)',
        defaultIsolationSegmentId: '(defaultIsolationSegmentIdDummy)',
        domainsUrl: '(domainsUrlDummy)',
        isolationSegmentUrl: '(isolationSegmentUrlDummy)',
        managersUrl: '(managersUrlDummy)',
        name: '(nameDummy)',
        privateDomainsUrl: '(privateDomainsUrlDummy)',
        quotaDefinitionId: '(quotaDefinitionIdDummy)',
        quotaDefinitionUrl: '(quotaDefinitionUrlDummy)',
        spaceQuotaDefinitionsUrl: '(spaceQuotaDefinitionsUrlDummy)',
        spacesUrl: '(spaceUrlDummy)',
        status: '(statusDummy)',
        usersUrl: '(usersUrlDummy)',
      }
    };
  }

  private getEntity(): Object {
    return this.orgData[OrgMappingKeyConstant.Entity];
  }

  private getMetadata(): Object {
    return this.orgData[OrgMappingKeyConstant.Metadata];
  }

  // in metadata
  getId(): string {
    return this.getMetadata()[OrgMappingKeyConstant.Id];
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

export class OrgSpaces /* included Space */ {
  // TODO
}

export class OrgQuotas /* included Quota */ {
  // TODO
}
