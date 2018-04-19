import {OrganizationConstant} from './organizationconstant';
export class Organization {
  orgname: string;
  orgid: string;
  orgspacename: string;
  orgdomain: string;

  constructor(private orgData: Object) {
    if (orgData == undefined) {
      throw new Error('organization data is undefined.');
    }
  }

  public compareTo(other: Organization) {
    // 1st condition : created at (time)
    // 2nd condition : name
    // 3rd condition : id

    let compareVal = this.internalCompareTo(other, 'getCreatedAt');
    if (compareVal == 0) {
      compareVal = this.internalCompareTo(other, 'getName');
      if (compareVal == 0) {
        return this.internalCompareTo(other, 'getId');
      } else {
        return compareVal * 2;
      }
    } else {
      return compareVal * 3;
    }
  }

  private internalCompareTo(other: Organization, func: string) {
    if ((this[func] as Function)() < (other[func] as Function)()) {
      return -1;
    } else if ((this[func] as Function)() == (other[func] as Function)()) {
      return 0;
    } else if ((this[func] as Function)() > (other[func] as Function)()) {
      return 1;
    }
  }

  private getEntity(): Object {
    return this.orgData[OrganizationConstant.Entity];
  }

  private getMetadata(): Object {
    return this.orgData[OrganizationConstant.Metadata];
  }

  // in metadata
  getId(): string {
    return this.getMetadata()[OrganizationConstant.Id];
  }

  getCreatedAt(): string {
    return this.getMetadata()[OrganizationConstant.CreatedAt];
  }

  getUpdatedAt(): string {
    return this.getMetadata()[OrganizationConstant.UpdatedAt];
  }

  getURL(): string {
    return this.getMetadata()[OrganizationConstant.Url];
  }

  // in entity
  getApplicationEventsUrl(): string {
    return this.getEntity()[OrganizationConstant.ApplicationEventsUrl];
  }

  getAuditorsUrl(): string {
    return this.getEntity()[OrganizationConstant.AuditorsUrl];
  }

  getBillingEnabled(): string {
    return this.getEntity()[OrganizationConstant.BillingEnabled];
  }

  getBillingManagersUrl(): string {
    return this.getEntity()[OrganizationConstant.BillingManagersUrl];
  }

  getDefaultIsolationSegmentId(): string {
    return this.getEntity()[OrganizationConstant.DefaultIsolationSegmentId];
  }

  getDomainsUrl(): string {
    return this.getEntity()[OrganizationConstant.DomainsUrl];
  }

  getIsolationSegmentUrl(): string {
    return this.getEntity()[OrganizationConstant.IsolationSegmentUrl];
  }

  getManagersUrl(): string {
    return this.getEntity()[OrganizationConstant.ManagersUrl];
  }

  getName(): string {
    return this.getEntity()[OrganizationConstant.Name];
  }

  getPrivateDomainsUrl(): string {
    return this.getEntity()[OrganizationConstant.PrivateDomainsUrl];
  }

  getQuotaDefinitionId(): string {
    return this.getEntity()[OrganizationConstant.QuotaDefinitionId];
  }

  getQuotaDefinitionUrl(): string {
    return this.getEntity()[OrganizationConstant.QuotaDefinitionUrl];
  }

  getSpaceQuotaDefinitionsUrl(): string {
    return this.getEntity()[OrganizationConstant.SpaceQuotaDefinitionsUrl];
  }

  getSpacesUrl(): string {
    return this.getEntity()[OrganizationConstant.SpacesUrl];
  }

  getStatus(): string {
    return this.getEntity()[OrganizationConstant.Status];
  }

  getUsersUrl(): string {
    return this.getEntity()[OrganizationConstant.UsersUrl];
  }
}