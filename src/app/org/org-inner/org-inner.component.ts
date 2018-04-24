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

  constructor(private common: CommonService, private orgService: OrgService) {

  }

  ngOnInit(): void {}

  orgReName() {
    this.orgService.orgReName(this.org);
  }

  orgDelete() {
    this.orgService.orgDelete(this.org);
    this.org = null
  }

}
