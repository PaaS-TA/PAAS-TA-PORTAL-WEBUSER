import {Component, DoCheck, OnInit} from '@angular/core';
import {IndexCommonService} from "../userAccountMgmt/index-common.service";
import {Router} from "@angular/router";
import {CommonService} from "../../common/common.service";
import {NGXLogger} from "ngx-logger";
import {isNullOrUndefined} from "util";
import {UsermgmtService} from "../../usermgmt/usermgmt.service";
import {HttpClient} from '@angular/common/http';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';

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

  public translateEntities: any = [];

  constructor(private httpClient: HttpClient, private indexCommonService: IndexCommonService, private common: CommonService, private usermgmtService: UsermgmtService,
    private translate: TranslateService, private router: Router, private log: NGXLogger) {
    this.email = '';
    this.isValidation = true;
    this.isUsed = true;

    if(this.common.getSeq() == null || this.common.getSeq() === ''){
      this.router.navigate(['/']);
    }

    this.translate.get('indexMain').subscribe((res: string) => {
      this.translateEntities = res;
    });

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateEntities = event.translations.indexMain;
    });

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
      this.indexCommonService.alertMessage(this.translateEntities.alertLayer.mailSendSuccess, true);
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
          this.usermgmtService.userInfoAll(result, data["authorization"]).subscribe(data2 => {
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
                this.common.alertMessage(this.translateEntities.alertLayer.accountNotExist, false);
              }else{
                if(this.email != null){
                  this.multiCheckUsedReset();
                }
              }
            }
          });
        });
      },error=> {
        this.common.alertMessage(this.translateEntities.alertLayer.systemError,false);
      });

    }
  }


  multiCheckUsedReset() {
    if (!this.isValidation) {
      this.common.getInfra(this.common.getSeq()).subscribe(infra =>{
        this.indexCommonService.sendResetEmail(infra['apiUri'], infra["authorization"],this.email);
      });
    }
  }

}
