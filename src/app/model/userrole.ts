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
  private _guid;

  constructor(_guid: string, _data?) {
    this.setGuid(_guid);
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

  get guid() {
    return this._guid;
  }

  private setGuid(extGuid) {
    if (extGuid === null || extGuid === undefined) {
      this._guid = '(dummy-org-id)';
    } else {
      this._guid = extGuid;
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

  get orgId() {
    return this.guid;
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
  index: number;

  static empty() {
    return new SpaceUserRole(null);
  }

  get spaceId() {
    return this.guid;
  }

  get isSpaceManager() {
    return this.roles.filter(role => { return role === 'SpaceManager'} ).length == 1;
  }

  get isSpaceDeveloper() {
    return this.roles.filter(role => { return role === 'SpaceDeveloper'} ).length == 1;
  }

  get isSpaceAuditor() {
    return this.roles.filter(role => { return role === 'SpaceAuditor'} ).length == 1;
  }
}
