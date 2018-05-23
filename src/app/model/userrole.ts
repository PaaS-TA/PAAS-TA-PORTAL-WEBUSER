export class UserRole {
  /*
  // DATA MODEL IS...
  private _data = {
    user_id: '(dummy_guid)',
    user_email: '(dummy_email)',
    roles: []
  }
   */
  private _data;
  private _orgId;

  constructor(_orgId: string, _data?) {
    this.setOrgId(_orgId);
    this.data = _data;
  }

  static empty() {
    return new UserRole(null);
  }

  private get data() {
    return this._data;
  }

  private set data(extData) {
    if (extData === null || extData === undefined) {
      this._data = {
        user_id: '(dummy_guid)',
        user_email: '(dummy_email)',
        roles: []
      };
    } else {
      this._data = extData;
    }
  }

  get orgId() {
    return this._orgId;
  }

  private setOrgId(extOrgId) {
    if (extOrgId === null || extOrgId === undefined) {
      this._orgId = '(dummy-org-id)';
    } else {
      this._orgId = extOrgId;
    }
  }

  get userId() {
    return this.data.user_id;
  }

  get userEmail() {
    return this.data.user_email;
  }

  get roles(): Array<String> {
    return (this.data.roles as Array<String>);
  }
}

export class OrgUserRole extends UserRole {
  static empty() {
    return new OrgUserRole(null);
  }

  get isOrgManager() {
    return this.roles.filter( role => {return role === 'OrgManager'} ).length == 1;
  }

  get isBillingManager() {
    return this.roles.filter( role => {return role === 'BillingManager'} ).length == 1;
  }

  get isOrgAuditor() {
    return this.roles.filter( role => {return role === 'OrgAuditor'} ).length == 1;
  }
}

export class SpaceUserRole extends UserRole {
  static empty() {
    return new SpaceUserRole(null);
  }
}
