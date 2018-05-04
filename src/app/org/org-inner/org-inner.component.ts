import {CommonService} from '../../common/common.service';
import {OrgQuota} from '../../model/org-quota';
import {Organization} from '../../model/organization';
import {Space} from '../../model/space';
import {SpaceService} from '../../space/space.service';
import {OrgQuotaService} from '../common/org-quota.service';
import {OrgService} from '../common/org.service';
import {Component, OnInit, Input, Output, EventEmitter, AfterContentChecked} from '@angular/core';
import {NGXLogger} from 'ngx-logger';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-org-inner',
  templateUrl: './org-inner.component.html',
  styleUrls: [
    // Is this needed really?
    // '../../../assets/resources/css/common.css',
    // '../../../assets/resources/css/normalize.css',
    '../common/org.component.css',
    './org-inner.component.css',
  ],
})
export class OrgInnerComponent implements OnInit, AfterContentChecked {
  @Input('org') org: Organization;
  @Input('wantedName') wantedName: String;

  private _availableQuotas: Array<OrgQuota>;
  private exactlyQuotaIndex = -1;

  @Output() selectEvent = new EventEmitter<Organization>();

  private defaultValue = '(dummy)';

  constructor(private orgService: OrgService, private spaceService: SpaceService,
    private quotaService: OrgQuotaService, private logger: NGXLogger) {
  }

  ngOnInit(): void {
    const orgId = this.org.guid;
    this.setSpaces(this.spaceService.getOrgSpaceList(orgId));
    this.setQuota(this.quotaService.getOrgQuota(orgId));
    this.setAvailableQuotas(this.quotaService.getOrgAvailableQuota());
  }

  ngAfterContentChecked(): void {
    if (this.quota !== null && this.quota !== undefined) {
      if (this.availableQuotas.length > 0 && this.exactlyQuotaIndex === -1) {
        const len = this.availableQuotas.length;
        for (let i = 0; i < len; i++) {
          const aquota = this.availableQuotas[i];
          if ((this.quota === aquota) || (this.quota.guid === aquota.guid)) {
            this.exactlyQuotaIndex = i;
            this.logger.debug('OrgQuota : ', aquota.name, '(' + aquota.guid + ')');
          }
          if (this.exactlyQuotaIndex !== -1) {
            break;
          }
        }
      }
    }
  }

  renameOrg() {
    this.orgService.renameOrg(this.org, this.wantedName);
  }

  deleteOrg() {
    this.orgService.deleteOrg(this.org);
    this.org = null;
  }

  get spaces() {
    return this.org.spaces;
  }

  private setSpaces(spacesParam: Array<Space>) {
    if (spacesParam === null || spacesParam === undefined) {
      this.org.spaces = [];
    } else {
      this.org.spaces = spacesParam.sort(Space.compareTo);
    }
  }

  renameSpace() {
    this.logger.error('TODO renameSpace');
  }

  deleteSpace() {
    this.logger.error('TODO deleteSpace');
  }

  get quota() {
    return this.org.quota;
  }

  private setQuota(quotaParam?: OrgQuota) {
    if (quotaParam === null || quotaParam === undefined) {
      this.org.quota = new OrgQuota();
    } else {
      this.org.quota = quotaParam;
    }
  }

  get availableQuotas() {
    return this._availableQuotas;
  }

  private setAvailableQuotas(availableQuotasParam: Array<OrgQuota>) {
    if (availableQuotasParam === null || availableQuotasParam === undefined) {
      this._availableQuotas = [];
    } else {
      this._availableQuotas = availableQuotasParam.sort((quotaA, quotaB) => {
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

  isSelected(quota: OrgQuota) {
    return this.quota.name === quota.name;
  }

  selectQuota($event, quota: OrgQuota, logger = this.logger) {
    // TODO
    if (!this.isSelected(quota)) {
      const inputElement = $event.srcElement;
      const inputs = inputElement.parentElement.parentElement.parentElement.getElementsByTagName('input');
      logger.info(inputs);

      $(inputElement).attr('checked', '');
    }
    logger.info(event);
  }

  private isValid(param): boolean {
    if (param === null || param === undefined) {
      return false;
    } else {
      return true;
    }
  }
}
