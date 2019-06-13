import {Component, OnInit} from '@angular/core';
import {IndexCommonService} from "../userAccountMgmt/index-common.service";
import {Router} from "@angular/router";
import {CommonService} from "../../common/common.service";
import {NGXLogger} from "ngx-logger";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-resetpasswd',
  templateUrl: './resetpasswd.component.html',
  styleUrls: ['./resetpasswd.component.css']
})
export class ResetpasswdComponent implements OnInit {

  public email: string;
  public isValidation: boolean;
  public isUsed: boolean;
  public isSendEmail: boolean;

  constructor(private indexCommonService: IndexCommonService, private common: CommonService,  private router: Router, private log: NGXLogger) {
    this.email = '';
    this.isValidation = true;
    this.isUsed = true;
  }

  ngOnInit() {
  }

  ngDoCheck() {

    if (this.isSendEmail != this.indexCommonService.isSendEmail) {
      this.isSendEmail = this.indexCommonService.isSendEmail;
    }
    if (this.isUsed != this.indexCommonService.isUsed) {
      this.isUsed = this.indexCommonService.isUsed;
    }

    if (this.isSendEmail) {
      this.isSendEmail = false;
      this.indexCommonService.alertMessage('메일 발송에 성공하였습니다.', true);
      this.router.navigate(['/']);
    }
  }


  checkValidation() {
    this.isValidation = this.indexCommonService.checkValidation(this.email);
  }

  checkUser() {
    if (!this.isValidation) {
      this.log.debug("getInfra >>");
      this.common.getInfra(this.common.getSeq()).subscribe(data =>{
        this.log.debug(data);
        this.common.setAuthorization(data["authorization"]);
        this.indexCommonService.checkUsedReset(this.email);
      });
    }
  }


}
