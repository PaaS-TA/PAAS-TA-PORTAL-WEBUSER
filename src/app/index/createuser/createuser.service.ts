import {Injectable} from '@angular/core';
import {UsermgmtService} from "../../usermgmt/usermgmt.service";
import {error} from "selenium-webdriver";
import {NGXLogger} from "ngx-logger";
import {Observable} from "rxjs/Observable";
import {CommonService} from "../../common/common.service";

@Injectable()
export class CreateuserService {
  isUsed: boolean;
  isSendEmail: boolean;

  constructor(private usermgmtService: UsermgmtService, private commonService: CommonService, private log: NGXLogger) {
    this.isSendEmail = false;
    this.isUsed = false;
  }


  checkValidation(email: string): boolean {
    var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
    if (regex.test(email) === false) {
      return true;
    } else {
      return false;
    }
  }

  checkUsed(email: string) {
    this.commonService.isLoading = true;
    this.isUsed = false;
    this.usermgmtService.userinfo(email).subscribe(data => {
      let userId = data;

      if (userId == null) {
        this.sendEmail(email);
        this.isUsed = false;
      } else {
        this.isUsed = true;
        this.commonService.isLoading = false;
      }
    }, error => {
      this.commonService.isLoading = false;
    });
  }


  sendEmail(email: string) {
    let param = {userid: email};
    this.commonService.doPost("/commonapi/v2/users/create/email", param, '').subscribe(data => {
      if (data['result'] === true) {
        this.isSendEmail = true;
      } else {
        this.isSendEmail = false;
      }
      this.commonService.isLoading = false;
    }, error => {
      this.commonService.doDelete("/commonapi/v2/users" + email, '', '').subscribe();
      this.isSendEmail = false;
      this.commonService.isLoading = false;
    });
  }


}
