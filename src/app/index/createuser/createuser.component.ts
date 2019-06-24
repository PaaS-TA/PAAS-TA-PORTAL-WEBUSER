import {Component, DoCheck, OnInit} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {Router} from "@angular/router";
import {IndexCommonService} from "../userAccountMgmt/index-common.service";
import {CommonService} from "../../common/common.service";
import {User, UsermgmtService} from "../../usermgmt/usermgmt.service";
import {Observable} from "rxjs";
import {error} from "util";
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.css']
})
export class CreateuserComponent implements OnInit, DoCheck {

  public user: Observable<User>;

  public email: string;
  public isValidation: boolean;
  public isUsed: boolean;
  public isSendEmail: boolean;

  constructor(public indexCommonService: IndexCommonService, private common: CommonService, private usermgmtService: UsermgmtService, private router: Router, private log: NGXLogger) {
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
              if(usedCount == 0){
                this.multiUsedCreate();
              }
              if(usedCount == 1){
                this.usedCreate();
              }
              if(usedCount == size){
                this.common.alertMessage("사용자 정보가 존재합니다.", false);
              }
            }
          },error =>{
            this.common.alertMessage(data['msg'], false);
          });//userinfoAll

        });
      });
    }
  }


  multiUsedCreate() {
    if (!this.isValidation) {
      this.common.getInfra(this.common.getSeq()).subscribe(data =>{
        this.common.setAuthorization(data["authorization"]);
        this.indexCommonService.checkUsedCreate(this.email);
      });

    }
  }


  usedCreate() {
    let forEachCount = 0;  //apiUrl 개수 확인
    this.common.getInfrasAll().subscribe(data => {
      let size = data.length;
      data.forEach(data => {
        let result = data['apiUri'];
        this.usermgmtService.userinfoCheck(this.email, result, data["authorization"]).subscribe(data2 => {
          let userInfoEnv = data2["User"];
          forEachCount++;

          if(userInfoEnv == null){
              let param = {userid: this.email};
              this.common.doPost2(result+"/commonapi/v2/users/create/email", data["authorization"], param,'').subscribe(data => {
                if (data['result'] === true) {
                  this.isSendEmail = true;
                  this.common.alertMessage('메일 발송에 성공하였습니다.', true);
                  this.router.navigate(['/']);
                } else {
                  this.common.doDelete(result+"/commonapi/v2/user/" + this.email, param, '').subscribe();
                  this.common.doDeleteMuti(result+"/portalapi/v2/users/" + this.email, '', param, '').subscribe();
                  this.common.alertMessage('메일 발송에 실패하였습니다.', false);
                  this.isSendEmail = false;
                }
                this.common.isLoading = false;
              }, error => {
                this.common.doDelete(result+"/commonapi/v2/users/" + this.email, param, '').subscribe();
                this.common.doDeleteMuti(result+"/portalapi/v2/users/" + this.email, '', param, '').subscribe();
                this.common.alertMessage('메일 발송에 실패하였습니다.', false);
                this.isSendEmail = false;
                this.common.isLoading = false;
              });
          }

        },error =>{
          this.common.alertMessage(data['msg'], false);
        });
      });
    });

  }//


}


