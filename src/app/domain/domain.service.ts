import {Injectable} from "@angular/core";
import {CommonService} from "../common/common.service";
import {NGXLogger} from "ngx-logger";
import {Domain} from "../model/domain";

@Injectable()
export class DomainService {
  constructor(private common: CommonService, private logger: NGXLogger) { }

  private getToken() {
    return this.common.getToken();
  }

  private get URLDomainRequest(): string {
    return '/portalapi/v2/domains';
  }

  public getDomainList(orgId: string, scope = "all") {
    const domains: Array<Domain> = new Array<Domain>();
    const url = this.URLDomainRequest + '/' + scope;

    // GET
    const observable = this.common.doGet(url, this.getToken());
    observable.subscribe(data => {
      if (data.hasOwnProperty('resources')) {
        (data['resources'] as Array<Object>).forEach(domainData => {
          const index =
            domains.push(new Domain(domainData['metadata'], domainData['entity'])) - 1;
          this.logger.trace('Domain(', index, ') :', domains[index]);
        });
      }
      this.logger.debug('DomainList :', domains);
    });

    return domains;
  }

  public addDomain(orgIdParam: string, domainNameParam: string): void {
    const url = this.URLDomainRequest;
    const body = {orgId: orgIdParam, domainName: domainNameParam};

    // POST
    const observable = this.common.doPost(url, body, this.getToken());
    observable.subscribe(data => {
      this.logger.debug('Result of adding domain (' + domainNameParam + ') :', data);
    })
  }

  public deleteDomain(domainNameParam: string): void {
    const url = this.URLDomainRequest;
    const params = {domainName: domainNameParam};

    // DELETE
    const observable = this.common.doDelete(url, params, this.getToken());
    observable.subscribe(data => {
      this.logger.debug('Result of deleting domain (' + domainNameParam + ') :', data);
    })
  }
}
