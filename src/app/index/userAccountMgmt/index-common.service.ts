import {Injectable} from '@angular/core';
import {CommonService} from '../../common/common.service';
import {NGXLogger} from 'ngx-logger';
import {User, UsermgmtService} from '../../usermgmt/usermgmt.service';
import {error} from 'util';
import {Observable} from 'rxjs';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {forEach} from '@angular/router/src/utils/collection';

@Injectable()
export class IndexCommonService {

  public user: Observable<User>;

  isUsed: boolean;
  isSendEmail: boolean;

  public translateEntities: any = [];

  /*사용자 정보*/
  public userName: string;
  public userGuid: string;

  constructor(private usermgmtService: UsermgmtService, private commonService: CommonService, public translate: TranslateService, private log: NGXLogger) {
    this.isSendEmail = false;
    this.isUsed = false;

    this.translate.get('indexMain').subscribe((res: string) => {
      this.translateEntities = res;
    });

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateEntities = event.translations.indexMain;
    });
  }


  checkValidation(email: string): boolean {
    var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
    if (regex.test(email) === false) {
      return true;
    } else {
      return false;
    }
  }

  sendCreateEmail(url, authorization, email: string) {
    this.commonService.isLoading = true;
    this.isUsed = false;
    let param = {userid: email, username: email, seq: this.commonService.getSeq()};
    this.commonService.doPostMulti(url + '/commonapi/v3/users/create/email', authorization, param, '').subscribe(data => {
      if (data['result'] === true) {
        this.commonService.getInfrasAll().subscribe(infras => {
          infras.forEach(infra => {
            if (infra['key'] != this.commonService.getSeq()) {
              let userInfo = {
                userId: email,
                userName: email,
                status: '1',
                adminYn: 'N',
                imgPath: '',
                active: 'N'
              };
              this.commonService.doPostMulti(infra['apiUri'] + '/commonapi/v2/user', infra['authorization'], userInfo, '').subscribe(data2 => {
              });
            }
          });
        });
        this.isSendEmail = true;
      } else {
        this.log.debug("ERR");

        this.commonService.doDelete(url + '/commonapi/v2/user/' + email, param, '').subscribe();
        this.commonService.doDeleteMulti(url + '/portalapi/v2/users/' + email, authorization, param, '').subscribe();
        this.commonService.alertMessage(this.translateEntities.alertLayer.mailSendFail, false);
        this.isSendEmail = false;
      }
      this.commonService.isLoading = false;
    }, error => {
      this.commonService.doDelete(url + '/commonapi/v2/users/' + email, param, '').subscribe();
      this.commonService.doDeleteMulti(url + '/portalapi/v2/users/' + email, authorization, param, '').subscribe();
      this.commonService.alertMessage(this.translateEntities.alertLayer.mailSendFail, false);
      this.isSendEmail = false;
      this.commonService.isLoading = false;
    });
  }


  sendResetEmail(url, authorization, email: string) {
    this.commonService.isLoading = true;
    this.isUsed = false;
    let param = {userid: email, seq: this.commonService.getSeq()};
    this.commonService.doPostMulti(url + '/commonapi/v3/users/password/email', authorization, param, '').subscribe(data => {
      if (data['result'] === true) {
        this.isSendEmail = true;
      } else {
        this.isSendEmail = false;
      }
      this.commonService.isLoading = false;
    }, error => {
      this.commonService.alertMessage(this.translateEntities.alertLayer.mailSendFail, false);
      this.isSendEmail = false;
      this.commonService.isLoading = false;
    });
  }


  alertMessage(msg: string, result: boolean) {
    this.commonService.alertMessage(msg, result);
  }
}
