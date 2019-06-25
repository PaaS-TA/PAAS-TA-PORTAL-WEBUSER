import {Component, DoCheck, OnInit} from '@angular/core';
import {IndexCommonService} from "../userAccountMgmt/index-common.service";
import {Router} from "@angular/router";
import {CommonService} from "../../common/common.service";
import {NGXLogger} from "ngx-logger";
import {isNullOrUndefined} from "util";
import {UsermgmtService} from "../../usermgmt/usermgmt.service";

@Component({
  selector: 'app-resetpasswd',
  templateUrl: './resetpasswd.component.html',
  styleUrls: ['./resetpasswd.component.css']
})
export class ResetpasswdComponent implements OnInit, DoCheck{

  public email: string;
  public isValidation: boolean;
  public isUsed: boolean;
  public isSendEmail: boolean;

  constructor(private indexCommonService: IndexCommonService, private common: CommonService, private usermgmtService: UsermgmtService, private router: Router, private log: NGXLogger) {
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
      let usedCount = 0;     //userId 개수 확인
      let forEachCount = 0;  //apiUrl 개수 확인
      this.common.getInfrasAll().subscribe(data => {
        let size = data.length;
        data.forEach(data => {
          let result = data['apiUri'];
          this.usermgmtService.userinfoAll(result, data["authorization"]).subscribe(data2 => {
            let infoEnv = data2.userInfo;
            infoEnv.forEach(userInfoEnv => {
              let userName = userInfoEnv["userName"];
              if(this.email == userName){
                usedCount++;
              }
            });
            forEachCount++;

            if(forEachCount == size){
              if(this.email != null){
                this.multiCheckUsedReset();
              } else{
                this.common.alertMessage(data['msg'], false);
              }
            }

          },error =>{
            this.common.alertMessage(data['msg'], false);
          });

        });
      });

    }
  }


  multiCheckUsedReset() {
    if (!this.isValidation) {
      this.common.getInfra(this.common.getSeq()).subscribe(data =>{
        this.common.setAuthorization(data["authorization"]);
        this.indexCommonService.checkUsedReset(this.email);
      });

    }
  }

}
