import {Injectable} from "@angular/core";
import {CommonService} from "../common/common.service";
import {NGXLogger} from "ngx-logger";
import {Domain} from "../model/domain";


declare var require: any;
let appConfig = require('assets/resources/env/config.json');

@Injectable()
export class DomainService {

  apiversion = appConfig['apiversion'];

  constructor(private common: CommonService, private logger: NGXLogger) { }

  private getToken() {
    return this.common.getToken();
  }

  private get URLDomainRequest(): string {
    return '/portalapi/' + this.apiversion + ' /domains';
  }

  public getDomainList(orgId: string, scope = "all", func?: Function) {
    const filterDomains: Array<Domain> = new Array<Domain>();
    const url = this.URLDomainRequest + '/' + scope;

    // GET
    const observable = this.common.doGet(url, this.getToken());
    observable.subscribe(data => {
      if (data.hasOwnProperty('resources')) {
        (data['resources'] as Array<Object>).forEach(domainData => {
          const domain = new Domain(domainData['metadata'], domainData['entity']);

          // filter domain using organization guid
          let index = null;
          if (domain.shared)
            index = filterDomains.push(domain) - 1;
          else if (domain.owningOrganizationId === orgId)
            index = filterDomains.push(domain) - 1;

          if (null !== index)
            this.logger.trace('Domain(', index, ') :', filterDomains[index]);
        });
      }
      this.logger.debug('DomainList :', filterDomains);
      if (func !== null && func !== undefined)
        func();
    });

    return filterDomains;
  }

  public getDomainListAndAfterAction(orgId: string, scope = "all", func?: Function) {
    const domains = this.getDomainList(orgId, scope);
  }

  public addDomain(orgIdParam: String, domainNameParam: String, func?: Function): void {
    const url = this.URLDomainRequest;
    const body = {orgId: orgIdParam, domainName: domainNameParam};

    // POST
    const observable = this.common.doPost(url, body, this.getToken());
    observable.subscribe(data => {
      this.logger.debug('Result of adding domain (' + domainNameParam + ') :', data);
      if (func != null)
        func();
    })
  }

  public deleteDomain(domains: Array<Domain>, domain: Domain) {
    if (!domain.shared) {
      const url = this.URLDomainRequest;
      const params = {
        orgId: domain.owningOrganizationId,
        domainName: domain.name
      };

      // DELETE
      this.common.isLoading = true;
      const observable = this.common.doDelete(url, params, this.getToken());
      observable.subscribe(data => {
        const index = domains.findIndex(d => d.guid === domain.guid);
        if (index !== -1) {
          domains.splice(index, 1);
          this.logger.debug('Result of deleting domain (' + domain.name + ') :', data);
        } else {
          this.logger.error('Cannot find to delete domain in domain list...', domain.name);
        }
        this.common.isLoading = false;
      });
    }
  }
}
