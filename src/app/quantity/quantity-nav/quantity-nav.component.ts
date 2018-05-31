import { Component, OnInit } from '@angular/core';
import {CommonService} from "../../common/common.service";
import {NGXLogger} from "ngx-logger";

@Component({
  selector: 'app-quantity-nav',
  templateUrl: './quantity-nav.component.html',
  styleUrls: ['./quantity-nav.component.css']
})
export class QuantityNavComponent implements OnInit {
  constructor(private common: CommonService, private logger: NGXLogger) { }
  ngOnInit() { }

  reloadQuantity(isReloaded) {
    if (isReloaded) {
      this.common.reloadPage();
    } else {
      this.logger.debug("Cancel reload.");
    }
  }
}
