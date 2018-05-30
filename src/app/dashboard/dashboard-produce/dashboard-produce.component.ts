import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../common/common.service';
import {NGXLogger} from 'ngx-logger';

import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DashboardService} from '../dashboard.service';
import {OrgService} from "../../org/common/org.service";
import {Organization} from "../../model/organization";
import {SpaceService} from "../../space/space.service";
import {Space} from '../../model/space';
import {SecurityService} from "../../auth/security.service";
import {OrgQuotaService} from "../../org/common/org-quota.service";
import {OrgURLConstant} from "../../org/common/org.constant";
import {OrgQuota} from "../../model/org-quota";

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-dashboard-produce',
  templateUrl: './dashboard-produce.component.html',
  styleUrls: ['./dashboard-produce.component.css'],
})
export class DashboardProduceComponent implements OnInit {
  public errorMessage: string;
  public isError: boolean;

  private doAttachEvent: boolean = false;
  private _availableQuotas: Array<OrgQuota>;

  private _orgName: string;
  private _selectQuota: OrgQuota;

  private _createdOrg: Organization;


  constructor(private common: CommonService,
              private orgService: OrgService,
              private orgQuotaService: OrgQuotaService,
              private router: Router,
              private logger: NGXLogger) {
    this.availableQuotas = this.orgQuotaService.getOrgAvailableQuota();
    this.resetToCreate();
  }

  ngOnInit() {
    const selfCom = this;
    const logger = this.logger;
    const scriptURL = '/assets/resources/js/common2.js';
    let retryCount = 0;
    while (retryCount < 3) {
      $.ajaxSetup({async: false});
      $.getScript(scriptURL).fail(function (jqxhr, settings, exception) {
        logger.error('Occured error :', exception);
        logger.error('It doesn\'t attach detail event :', selfCom.doAttachEvent);
      }).done(function (script, textStatus) {
          selfCom.doAttachEvent = true;
          logger.debug('Success to attach common2.js...', textStatus);
      });
      $.ajaxSetup({async: true});  // rollback
      retryCount++;
    }

    if (this.doAttachEvent)
      logger.debug('It attaches detail event : ' + this.doAttachEvent);
  }

  get orgName() {
    return this._orgName;
  }

  set orgName(extOrgName) {
    this._orgName = extOrgName;
  }

  get availableQuotas() {
    return this._availableQuotas;
  }

  set availableQuotas(extQuotas: Array<OrgQuota>) {
    if (extQuotas == null) {
      this._availableQuotas = [];
    } else {
      this._availableQuotas = extQuotas.sort((quotaA, quotaB) => {
        const nameA = quotaA.name;
        const nameB = quotaB.name;
        if (nameA === nameB && nameA === 'default') {
          return 0;
        } else if (nameA === 'default') {
          return -1;
        } else if (nameB === 'default') {
          return 1;
        }

        if (nameA === nameB) {
          return 0;
        } else if (nameA < nameB) {
          return -1;
        } else {
          return 1;
        }
      });
    }
  }

  get selectQuota() {
    return this._selectQuota;
  }

  set selectQuota(extQuota) {
    this._selectQuota = extQuota;
  }

  get createdOrganization() {
    return this._createdOrg;
  }

  set createdOrganization(extOrg) {
    this._createdOrg = extOrg;
  }

  private getToken() {
    return this.common.getToken();
  }

  isSelectedQuota(extQuota: OrgQuota) {
    if (this.selectQuota !== null)
      return this.selectQuota.name === extQuota.name;
    else
      return false;
  }

  changeQuota(extQuota: OrgQuota) {
    this.selectQuota = extQuota;
    this.logger.debug('Select quota : ' + this.selectQuota.name);
  }

  isExistOrgName() {
    const msgElement = $('#action-info-message');
    const btnCreateOrg = $('#btn_create_org');

    if (this.orgName == null || (this.orgName != null && "" === this.orgName.trim())) {
      msgElement.removeClass('blue');
      msgElement.addClass('red');
      btnCreateOrg.attr('disabled', '');
      this.isError = true;
      this.errorMessage = '조직 이름이 비어있습니다.';
      return;
    }

    try {
      const url = OrgURLConstant.URLOrgRequestBase + this.orgName + '/exist';
      this.common.doGet(url, this.getToken()).subscribe(data => {
        if (data === false || data === 'false') {
          // can create org using new name
          msgElement.removeClass('red');
          msgElement.addClass('blue');
          btnCreateOrg.removeAttr('disabled');
          this.isError = false;
          this.errorMessage = '생성이 가능합니다.';
        } else if (data === true || data === 'true') {
          // "CANNOT" create org using new name
          msgElement.removeClass('blue');
          msgElement.addClass('red');
          btnCreateOrg.attr('disabled', '');
          this.isError = true;
          this.errorMessage = '입력한 이름을 가진 조직이 이미 존재합니다.';
        } else {
          // "CANNOT" create org using new name (bad request or server error)
          msgElement.removeClass('blue');
          msgElement.addClass('red');
          btnCreateOrg.attr('disabled', '');
          this.isError = true;
          this.errorMessage = '잘못된 요청입니다. 관리자에게 문의하십시오.';
        }
      });
    } catch (error) {
      // "CANNOT" create org using new name (server error)
      msgElement.removeClass('blue');
      msgElement.addClass('red');
      btnCreateOrg.attr('disabled', '');
      this.isError = true;
      this.errorMessage = '서버가 불안정합니다. 관리자에게 문의하십시오.';
      this.logger.error('Occured error :', error);
    }
  }

  resetToCreate() {
    this.orgName = '';
    this.isError = false;
    this.errorMessage = '';
    this.selectQuota = OrgQuota.empty();
    this.createdOrganization = new Organization(null, null);
  }

  async createOrg() {
    this.common.isLoading = true;
    this.logger.debug('isLoading :', this.common.isLoading);

    const url = OrgURLConstant.URLOrgRequestBase;
    const body = {
      orgName: this.orgName,
      quotaGuid: this.selectQuota.guid,
    };

    this.isExistOrgName();
    if (!this.isError) {
      const data = await this.common.doPost(url, body, this.getToken()).toPromise();
      const org: Organization = new Organization(data['metadata'], data['entity']);
      if (org.name === this.orgName) {
        this.logger.debug('Done to create organization :', org.name);
        this.createdOrganization = org;
        this.isError = false;
      } else {
        this.logger.debug('Fail to create organization :', org.name);
        this.isError = true;
      }
    }

    this.common.isLoading = false;
    this.logger.debug('isLoading :', this.common.isLoading);
  }

  navigateOrg() {
    this.router.navigate(['/org'], { /* extras are none */ });
  }
}
