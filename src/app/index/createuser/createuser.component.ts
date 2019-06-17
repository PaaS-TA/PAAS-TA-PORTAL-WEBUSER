import {Component, DoCheck, OnInit} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {Router} from "@angular/router";
import {IndexCommonService} from "../userAccountMgmt/index-common.service";
import {CommonService} from "../../common/common.service";

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.css']
})
export class CreateuserComponent implements OnInit, DoCheck {

  public email: string;
  public isValidation: boolean;
  public isUsed: boolean;
  public isSendEmail: boolean;

  constructor(public indexCommonService: IndexCommonService, private common: CommonService, private router: Router, private log: NGXLogger) {
    this.email = '';
    this.isValidation = true;
    this.isUsed = false;
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
      this.indexCommonService.alertMessage("성공적으로 메일 발송하였습니다.", true);
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
        this.indexCommonService.checkUsedCreate(this.email);
      });

    }
  }

}

