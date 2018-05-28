import {Component, OnInit} from "@angular/core";
import {CommonService} from "../common/common.service";
import {NGXLogger} from "ngx-logger";

@Component({
  selector: 'app-common-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class CommonHeaderComponent implements OnInit {
  // NO ACTION, ONLY TEMPLATE COMPONENT CLASS
  constructor(private common: CommonService, private logger: NGXLogger) {
  }

  ngOnInit() { }

  get name() {
    return this.common.getUserName();
  }

  get email() {
    return this.common.getUserEmail();
  }

  get pictureUrl() {
    return this.common.getImagePath();
  }

  public alertMsg(msg: string) {
    window.alert(msg);
  }
}
