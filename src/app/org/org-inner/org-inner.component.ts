import {CommonService} from '../../common/common.service';
import {Organization} from '../../model/organization';
import {OrgService} from '../org.service';
import {Component, OnInit, Input} from '@angular/core';


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
export class OrgInnerComponent implements OnInit {
  @Input('org') org: Organization;
  @Input('wantedName') wantedName: String;

  constructor(private common: CommonService, private orgService: OrgService) {

  }

  ngOnInit(): void {}

  renameOrg() {
    this.orgService.renameOrg(this.org, this.wantedName);
  }

  deleteOrg() {
    this.orgService.deleteOrg(this.org);
    this.org = null;
  }

}
