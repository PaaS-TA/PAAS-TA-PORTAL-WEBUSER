import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommonService} from '../common/common.service';
import {NGXLogger} from 'ngx-logger';
import 'rxjs/add/operator/map';
import {Jsonp} from '@angular/http';
import {forEach} from '@angular/router/src/utils/collection';
import {getToken} from 'codelyzer/angular/styles/cssLexer';


export class Orgs {
  constructor(nextUrl: string,
              previousUrl: string,
              resources: {
                entity: OrgEntity,
                metadata: OrgMetadata
              }) {
  };
}

export class OrgEntity {
  constructor(public applicationEventsUrl: string,
              public auditorsUrl: string,
              public billingEnabled: boolean,
              public billingManagersUrl: string,
              public defaultIsolationSegmentId: string,
              public domainsUrl: string,
              public isolationSegmentUrl: string,
              public managersUrl: string,
              public name: string,
              public privateDomainsUrl: string,
              public quotaDefinitionId: string,
              public quotaDefinitionUrl: string,
              public spaceQuotaDefinitionsUrl: string,
              public spacesUrl: string,
              public status: string,
              public usersUrl: string) {
  }
}

export class OrgMetadata {
  constructor(createdAt: string,
              id: string,
              updatedAt: string,
              url: string) {
  }
}

@Injectable()
export class DashboardService {

  constructor(private commonService: CommonService, private http: HttpClient, private log: NGXLogger, private jsonp: Jsonp) {
  }

  headers: HttpHeaders;


  OrgEntities() {
    return this.commonService.doGET('/portalapi/v2/orgs', this.commonService.getToken()).map((res: Response) => {
      let resources = res['resources'];
      return resources.map(value => {
        return value.entity;
      });
    }).do(console.log);
  }

  observation() {

    this.headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Basic YWRtaW46b3BlbnBhYXN0YQ==')
      .set('X-Broker-Api-Version', '2.4')
      .set('X-Requested-With', 'XMLHttpRequest').set('cf-Authorization', this.commonService.getToken());


    return this.commonService.doGET('/portalapi/v2/orgs', this.commonService.getToken()).map((res: Response) => {
    }).do(console.log);
  }


  getSpace() {
    return this.commonService.doGET('/portalapi/v2/orgs', this.commonService.getToken()).map((res: Response) => {
    });
  }


}

