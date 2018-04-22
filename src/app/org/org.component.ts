import {Component, OnInit, DoCheck, AfterViewChecked} from '@angular/core';
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
export class OrgComponent implements OnInit, DoCheck, AfterViewChecked {
  orgs: Array<Organization>;

  private boolAttachEvent: boolean = false;

  constructor(private common: CommonService,
    private orgService: OrgService,
    private logger: NGXLogger) {
    //constructor(private common: CommonService, private logger: NGXLogger) {
    /*
    const url = '/portalapi/v2/orgs-admin';
    this.common.doGET(url, this.common.getToken()).subscribe(data => {
      const resources = data['resources'] as Array<Object>;
      const length = resources.length;
      logger.trace('orgs\' length is', length);
      for (let i = 0; i < length; i++) {
        const org = new Organization(resources[i]);
        org.orgname = data['resources'][i]['entity']['name'];
        this.orgs[i] = org;
        logger.trace(org);
      }
    });
    
    logger.debug('OrgList :', this.orgs);
    */
    // test only
    //this.orgs = orgService.getOrgListAdminOnly();
    this.orgs = orgService.getOrgList();
    //this.orgInnerList.setOrgs(this.orgs);
  }

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    const logger = this.logger;
    this.attachDetailEvent();
    logger.trace('after view checked attach click event');
  }

  ngDoCheck(): void {
    const logger = this.logger;
    logger.trace('do check attach click event');
  }

  attachDetailEvent() {
    const logger = this.logger;
    const orgService = this.orgService;
    if (this.isAttachEvent() === false && this.orgs.length > 0) {
      // TODO : control directly using Angular, instead of common2.js and jQuery
      // ex) [AS-IS] $('.organization_sw').on('click', function() { ...... })  --->  [TO-BE] Angular
      /*
      $(document).ready(() => {
        //TODO 임시로...
        $.getScript('../../assets/resources/js/common2.js')
          .done(function(script, textStatus) {
            logger.debug(textStatus);
          })
          .fail(function(jqxhr, settings, exception) {
            logger.error(exception);
          });
      });
      */
      $.getScript('../../assets/resources/js/common2.js')
        .done(function(script, textStatus) {
          logger.trace(textStatus);
        })
        .fail(function(jqxhr, settings, exception) {
          logger.error(exception);
        }
        );
    }

    if (this.orgs.length > 0 && false === this.boolAttachEvent) {
      this.boolAttachEvent = true;
      logger.trace('It attaches detail event : ' + this.boolAttachEvent);

      if (this.orgs.length > 0) {
        const orgId = this.orgs[0].getId();
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
    } else {
      logger.trace('It doesn\'t attach detail event : ' + this.boolAttachEvent);
    }
  }

  isAttachEvent(): Boolean {return this.boolAttachEvent;}
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
