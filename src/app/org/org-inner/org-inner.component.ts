import { CommonService } from '../../common/common.service';
import { Organization } from '../organization';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-org-inner',
  templateUrl: './org-inner.component.html',
  styleUrls: [
    // Is this needed really?
    // '/src/assets/resources/css/common.css',
    // '/src/assets/resources/css/normalize.css',
   './org-inner.component.css']
})
export class OrgInnerComponent implements OnInit {
  constructor(private common: CommonService, private orgData: Organization) { }

  ngOnInit(): void { }
}
