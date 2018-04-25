import {CommonService} from '../../common/common.service';
import {OrgQuota} from '../../model/org-quota';
import {Organization} from '../../model/organization';
import {Space} from '../../model/space';
import {SpaceService} from '../../space/space.service';
import {OrgQuotaService} from '../org-quota.service';
import {OrgService} from '../org.service';
import {Component, OnInit, Input, Output, EventEmitter, AfterContentChecked} from '@angular/core';
import {NGXLogger} from 'ngx-logger';


@Component({
  selector: 'app-org-inner',
  templateUrl: './org-inner.component.html',
  styleUrls: [
    // Is this needed really?
    // '../../../assets/resources/css/common.css',
    // '../../../assets/resources/css/normalize.css',
    '../org.component.css',
    './org-inner.component.css']
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
    this.org.spaces = spacesParam;
  }

  get quota() {
    return this.org.quota;
  }

  private setQuota(quotaParam: OrgQuota) {
    this.org.quota = quotaParam;
  }

  get availableQuotas() {
    return this._availableQuotas;
  }

  private setAvailableQuotas(availableQuotasParam: Array<OrgQuota>) {
    this._availableQuotas = availableQuotasParam;
  }
}
