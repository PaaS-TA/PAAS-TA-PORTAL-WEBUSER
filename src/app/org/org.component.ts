import {Component, OnInit, DoCheck, AfterViewChecked, AfterContentChecked} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {NGXLogger} from 'ngx-logger';
import {CommonService} from '../common/common.service';
import {OrgService} from './org.service';
import {Organization} from '../model/organization';
import {OrgInnerComponent} from './org-inner/org-inner.component';
declare var $: any; declare var jQuery: any;

@Component({
  selector: 'app-org',
  templateUrl: './org.component.html',
  styleUrls: ['./org.component.css'],
})
export class OrgComponent implements OnInit, DoCheck, AfterContentChecked, AfterViewChecked {
  orgs: Array<Organization>;

  private doAttachEvent: Boolean = false;
  private doSortOrgs: Boolean = false;

  constructor(private common: CommonService,
    private orgService: OrgService,
    private logger: NGXLogger) {

    // Real work
    this.orgs = orgService.getOrgList();

    // Real work (admin)
    // this.orgs = orgService.getOrgListAdminOnly();

    // Test sample (admin)
    // this.orgs = orgService.getOrgListAdminOnlySample();
  }

  ngOnInit(): void {}

  ngAfterContentChecked(): void {
    const orgService = this.orgService;

    if (this.doSortOrgs === false && this.orgs.length > 0) {
      this.doSortOrgs = true;

      this.orgs = this.orgs.sort((orgA, orgB) => this.sortCompareTo<Organization>(orgA, orgB));

      const orgId = this.orgs[0].guid;
      const orgSpaces = orgService.getOrgSpaceList(orgId);
      const orgQuota = orgService.getOrgQuota(orgId);
      const orgAvailableQuota = orgService.getOrgAvailableQuota();

      /*
      this.logger.debug('orgs[0] :', this.orgs[0]);
      this.logger.debug('Org id of orgs[0] :', orgId);
      this.logger.debug('- org spaces :', orgSpaces);
      this.logger.debug('- org quota :', orgQuota);
      this.logger.debug('- org available quota :', orgAvailableQuota);
      */
    }
  }

  ngAfterViewChecked(): void {
    const logger = this.logger;
    this.attachDetailEvent();
    logger.trace('after view checked attach click event');
  }

  ngDoCheck(): void {
    const logger = this.logger;
    logger.trace('do check attach click event');
  }


  private sortCompareTo<T>(objA: T, objB: T): number {
    const nameA = objA['name'];
    const nameB = objB['name'];
    if (nameA === nameB) {
      return 0;
    } else if (nameA < nameB) {
      return -1;
    } else {
      return 1;
    }
  }

  attachDetailEvent() {
    const logger = this.logger;
    const orgService = this.orgService;
    if (this.doAttachEvent === false && this.orgs.length > 0) {
      // TODO : control directly using Angular, instead of common2.js and jQuery
      // ex) [AS-IS] $('.organization_sw').on('click', function() { ...... })  --->  [TO-BE] Angular

      $.getScript('../../assets/resources/js/common2.js')
        .done(function(script, textStatus) {
          logger.trace(textStatus);
        })
        .fail(function(jqxhr, settings, exception) {
          logger.error(exception);
        }
        );
    }

    if (this.doAttachEvent === true) {

      logger.trace('It attaches detail event : ' + this.doAttachEvent);
    } else {
      logger.trace('It doesn\'t attach detail event : ' + this.doAttachEvent);
    }
  }
}
