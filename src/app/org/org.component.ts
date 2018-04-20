import {Component, OnInit, DoCheck, AfterViewChecked} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {NGXLogger} from 'ngx-logger';
import {CommonService} from '../common/common.service';
import { OrgService } from './org.service';
import { Organization } from './organization';
declare var $: any; declare var jQuery: any;

@Component({
  selector: 'app-org',
  templateUrl: './org.component.html',
  styleUrls: ['./org.component.css']
})

export class OrgComponent implements OnInit, DoCheck, AfterViewChecked {
  orgs: Array<Organization>;

  private boolAttachEvent: boolean = false;

  constructor(private common: CommonService, private orgService: OrgService, private logger: NGXLogger) {
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
    this.orgs = orgService.getOrgListAdminOnly();
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

    if (this.orgs.length > 0 && false === this.boolAttachEvent ) {
      this.boolAttachEvent = true;
      logger.trace('It attaches detail event : ' + this.boolAttachEvent);
    } else {
      logger.trace('It doesn\'t attach detail event : ' + this.boolAttachEvent);
    }
  }

  isAttachEvent(): Boolean { return this.boolAttachEvent; }
}

