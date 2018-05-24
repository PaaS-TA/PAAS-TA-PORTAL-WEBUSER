import {Injectable} from "@angular/core";
import {CommonService} from "../../common/common.service";
import {NGXLogger} from "ngx-logger";
import {OrgUserRole} from "../../model/userrole";

@Injectable()
export class OrgUserRoleService {
  constructor(private common: CommonService, private logger: NGXLogger) { }

  private getToken() {
    return this.common.getToken();
  }

  private get URLOrgRequest() {
    return '/portalapi/v2/orgs';
  }

  private URLOrgUserRoles(orgId: string) {
    // GET, PUT, DELETE
    return this.URLOrgRequest + '/' + orgId + '/user-roles';
  }

  private URLOrgUserRoleByUsername(orgName: string, userName: string) {
    return this.URLOrgRequest + '/' + orgName + '/user-roles/' + userName;
  }

  private URLOrgUserIsManager(orgName: string, userName: string) {
    return this.URLOrgRequest + '/' + orgName + '/user-roles/' + userName + '/is-manager';
  }

  private URLOrgUserCanceling(orgId: string) {
    return this.URLOrgRequest + '/' + orgId + '/member';
  }

  public getUserRoles(orgId: string) {
    const userRoles: Array<OrgUserRole> = new Array<OrgUserRole>();
    const url = this.URLOrgUserRoles(orgId);

    const observable = this.common.doGet(url, this.getToken());
    observable.subscribe(data => {
      if (data.hasOwnProperty('user_roles')) {
        (data['user_roles'] as Array<Object>).forEach(roleData => {
          const index =
            userRoles.push(new OrgUserRole(orgId, roleData)) - 1;
          this.logger.trace('OrgUserRole(', index, ') :', userRoles[index]);
        });
      }
      this.logger.debug('OrgUserRole :', userRoles);
    });

    return userRoles;
  }

  public isManagerFromUserRoles(roles: Array<OrgUserRole>): boolean {
    return roles
      .filter((role) => { return role.userEmail === this.common.getUserEmail() })
      .length > 0;
  }

  public isManagerFromAPI(orgName: string) {
    const url = this.URLOrgUserIsManager(orgName, this.common.getUserEmail());
    const observable = this.common.doGet(url, this.getToken());

    return (async() => {
      this.logger.debug('is manager from API : before await');
      const data = await this.common.doGet(url, this.getToken()).toPromise();
      this.logger.debug('is manager from API : after await / response :', data);
      return data;
    })();
  }

  public associateOrgUserRole(user: OrgUserRole, associateRole: string) {
    const url = this.URLOrgUserRoles(user.orgId);
    const requestBody = {
      userId: user.userId,
      role: associateRole
    };

    return (async() => {
      this.logger.debug('associate org user role : before await');
      const data = await this.common.doPut(url, requestBody, this.getToken()).toPromise();
      this.logger.debug('associate org user role : after await / response :', data);
      return data;
    })();
  }

  public removeOrgUserRole(user: OrgUserRole, removeRole: string) {
    const url = this.URLOrgUserRoles(user.orgId);
    const params = {
      userId: user.userId,
      role: removeRole
    };

    return (async() => {
      this.logger.debug('remove org user role : before await');
      const data = await this.common.doDelete(url, params, this.getToken()).toPromise();
      this.logger.debug('remove org user role : after await / response :', data);
      return data;
    })();
  }

  public inviteUser() {
    // TODO
  }

  public cancelInvitionUser() {
    // TODO
  }

  public cancelOrgMemberUsingOrgIdAndUserId(orgId: string, userId: string) {
    const url = this.URLOrgUserCanceling(orgId);
    const params = {
      userId: userId
    };

    return (async() => {
      this.logger.debug('cancel org member : before await');
      const data = await this.common.doDelete(url, params, this.getToken()).toPromise();
      this.logger.debug('cancel org member : after await');
      return data;
    })();
  }

  public cancelOrgMember(userRoles: Array<OrgUserRole>, cancelingUser: OrgUserRole) {

  }
}
