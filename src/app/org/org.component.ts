import {Component, OnInit, DoCheck, AfterViewChecked, AfterContentChecked} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {NGXLogger} from 'ngx-logger';
import {CommonService} from '../common/common.service';
import {OrgService} from './org.service';
import {Organization} from '../model/organization';
import {OrgInnerComponent} from './org-inner/org-inner.component';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-org',
  templateUrl: './org.component.html',
  styleUrls: ['./org.component.css'],
})
export class OrgComponent implements OnInit, DoCheck, AfterContentChecked, AfterViewChecked {
  orgs: Array<Organization>;

  //currentOrg: Organization = null;
  private currentOrgIndex: number;

  private doAttachEvent: Boolean = false;
  private elapsedAttachTime: Number;
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

  public test(logger = this.logger) {
    logger.info('super test');
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
    const scriptURL = '../../assets/resources/js/common2.js';
    const selfCom = this;
    const logger = this.logger;

    if (this.doAttachEvent === false && this.orgs.length > 0) {
      // TODO : control directly using Angular, instead of common2.js and jQuery
      // ex) [AS-IS] $('.organization_sw').on('click', function() { ...... })  --->  [TO-BE] Angular
      const startTime = Date.now();

      $.ajaxSetup({async: false});
      $.getScript(scriptURL)
        .done(function(script, textStatus) {
          selfCom.doAttachEvent = true;
          selfCom.elapsedAttachTime = (Date.now() - startTime);
          logger.debug('Success to attach common2.js...', textStatus, ' / elapsed time :', this.elapsedAttachTime);
        }).fail(function(jqxhr, settings, exception) {
          logger.error(exception);
          selfCom.elapsedAttachTime = (Date.now() - startTime);
          logger.error(
            'It doesn\'t attach detail event :', this.doAttachEvent, ' / elapsed time :', this.elapsedAttachTime);
        });

      if (this.doAttachEvent === true) {
        logger.debug('It attaches detail event : ' + this.doAttachEvent);
      }
      $.ajaxSetup({async: true});  // rollback
    }
  }

  selectOrg(org: Organization, logger = this.logger) {
    this.currentOrgIndex = this.orgs.indexOf(org);
    this.orgs[this.currentOrgIndex].indexOfOrgs = this.currentOrgIndex;
    logger.debug('orgs[' + this.currentOrgIndex + '] : ' + this.orgs[this.currentOrgIndex]);
  }

  get currentOrg() {
    return this.orgs[this.currentOrgIndex];
  }
}
