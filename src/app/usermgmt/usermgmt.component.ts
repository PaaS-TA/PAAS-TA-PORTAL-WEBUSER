import {Component, OnInit} from '@angular/core';
import {CommonService} from '../common/common.service';
import {User, UsermgmtService} from './usermgmt.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {NGXLogger} from 'ngx-logger';
import {Organization} from '../model/organization';
import {ActivatedRoute, Router} from '@angular/router';
import {SecurityService} from '../auth/security.service';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {isNullOrUndefined} from 'util';
import {ExternalcommonService} from '../external/common/externalcommon.service';
import {stringify} from 'querystring';


declare var $: any;
declare var jQuery: any;
declare var require: any;
let appConfig = require('assets/resources/env/config.json');

@Component({
  selector: 'app-usermgmt',
  templateUrl: './usermgmt.component.html',
  styleUrls: ['./usermgmt.component.css']
})
export class UsermgmtComponent implements OnInit {
  public user: Observable<User>;
  public orgs: Array<Organization> = [];
  public translateEntities: any = [];

  apiversion = appConfig['apiversion'];

  /*로그인 정보*/
  public isPassword: boolean;
  public isRePassword: boolean;
  public isChPassword: boolean;
  public isTellPhone: boolean;
  public isZipCode: boolean;
  public isAddress: boolean;

  /*사용자 정보*/
  public userName: string;
  public tellPhone: string;
  public zipCode: string;
  public address: string;
  public photoFile: string;
  public imgPath: string;

  public token: string = '';
  public orgName: string = '';
  public username: string = '';
  public password: string = '';
  public password_now: string = '';
  public password_new: string = '';
  public password_confirm: string = '';
  public password_check: string = '';
  public selectedOrgGuid: string = '';
  public selectedOrgName: string = '';

  public check: number = 0;

  public fileToUpload: File = null;

  public regions: string[];

  constructor(private httpClient: HttpClient, private common: CommonService, private userMgmtService: UsermgmtService, private translate: TranslateService,
              private externalService: ExternalcommonService, private router: Router, private activeRoute: ActivatedRoute, private sec: SecurityService, private log: NGXLogger) {


    this.user = new Observable<User>();
    this.orgs = new Array<Organization>();
    this.token = '';
    this.orgName = '';
    this.password = '';
    this.isTellPhone = true;
    this.isZipCode = true;
    this.isAddress = true;
    this.photoFile = '';

    this.isPassword = false;
    this.isRePassword = true;
    this.isChPassword = false;
    this.userInfo();
    this.orgInit();
    this.translate.get('usermgmt').subscribe((res: string) => {
      this.translateEntities = res;
    });

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateEntities = event.translations.usermgmt;
    });

  }

  onFileChanged() {
    $('#photoFile').trigger('click');
  }

  onFileChanged_click(event) {
    const file = event.target.files[0];
    if (isNullOrUndefined(file)) {
      return;
    }
    this.fileToUpload = file;
    $('#photo').fadeIn('fast').attr('src', URL.createObjectURL(event.target.files[0]));
    $('#onUploadBtn').show();
  }

  onUpload() {
    if (isNullOrUndefined(this.fileToUpload)) {
      return;
    }
    let formData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    this.userMgmtService.photoRegistration(formData).subscribe(data => {
      $('#onUploadBtn').hide(); //TO disabled
      this.imgPath = data.fileURL;
      this.userSave();
    }, error => {
    });
  }

  userInfo() {
    this.userName = '';
    this.tellPhone = '';
    this.zipCode = '';
    this.address = '';

    this.userMgmtService.userinfo(this.common.getUserid()).subscribe(data => {
      this.user = data;
      this.userName = data['userName'];
      this.tellPhone = data['tellPhone'];
      this.zipCode = data['zipCode'];
      this.address = data['address'];
      try {
        if (isNullOrUndefined(data['imgPath'].lastIndexOf('/')) || data['imgPath'] === '') {
          return '';
        }
        var pathHeader = data['imgPath'].lastIndexOf('/');
        var pathEnd = data['imgPath'].length;
        var fileName = data['imgPath'].substring(pathHeader + 1, pathEnd);
        this.userMgmtService.getImg('/storageapi/v2/swift/' + fileName).subscribe(data => {
          let reader = new FileReader();
          reader.addEventListener('load', () => {
            this.photoFile = reader.result;
            this.common.setImagePath(this.photoFile);
          }, false);
          if (data) {
            reader.readAsDataURL(data);
          }
        }, error => {
        });
      } catch (e) {
      }
      return data;
    });
  }

  userSave() {
    let params = {
      //userName: this.user['userName'],
      userName: this.userName,
      tellPhone: this.tellPhone,
      zipCode: this.zipCode,
      address: this.address,
      imgPath: this.imgPath
    };

    this.common.isLoading = true;
    this.userMgmtService.userSave(this.common.getUserid(), params).subscribe(data => {
      if (data === 1) {
        this.common.alertMessage(this.translateEntities.alertLayer.ChangeSuccess, true);
        this.common.isLoading = false;
        this.common.setUserName(this.userName);
        return this.userInfo();
      } else {
        this.common.alertMessage(this.translateEntities.alertLayer.ChangeSuccessFail + '<br><br>' + data.msg, false);
        this.common.isLoading = false;
        return this.userInfo();
      }
    }, error => {
      this.common.alertMessage(this.translateEntities.alertLayer.ChangeSuccessFail, false);
      this.common.isLoading = false;
      return this.userInfo();

    });
    /*reset*/
    // $('#userName').val('');
    // $('#tellPhone').val('');
    // $('#zipCode').val('');
    // $('#address').val('');
  }

  cancelButton() {
    // $('#userName').val('');
    // $('#tellPhone').val('');
    // $('#zipCode').val('');
    // $('#address').val('');
    // $('#password_check').val('');

    this.userInfo();
  }

  userSaveEnter() {
    $('#userSave').click();
  }

  replaceInvalidateString($event) {
    const regFirstExpPattern = /^[\{\}\[\]\/?,;:|\)*~`!^+<>\#\-_@$%&\\\=\(\'\"]+/g;
    const regExpPattern = /[\{\}\[\]\/?,;:|\)*~`!^+<>\#@$%&\\\=\(\'\"]/g;
    const regExpBlankPattern = /[\s]/g;

    let typingStr = $event.target.value.replace(regFirstExpPattern, '')
      .replace(regExpPattern, '').replace(regExpBlankPattern, '')
      .substring(0, 64);

    $event.target.value = typingStr;
  }

  updateUserPasswordEnter() {
    $('#passwordChange').click();
  }

  checkTellPhoneEnter() {
    $('#checkTellPhone').click();
  }

  checkTellPhone() {
    // this.log.debug(this.tellPhone + ' :::: ' + this.tellPhone_pattenTest());
    if (this.tellPhone_pattenTest()) {
      this.isTellPhone == true;
      $('#tellPhone').val(this.user['tellPhone']);
      this.userSave();
    } else {
      this.userInfo();
    }
  }

  checkZipCodeEnter() {
    $('#checkZipCode').click();
  }

  checkZipCode() {
    // this.log.debug(this.zipCode + ' :::: ' + this.zipCode_pattenTest());

    if (this.zipCode_pattenTest()) {
      this.isZipCode == true;
      $('#zipCode').val(this.user['zipCode']);
      this.userSave();
    } else {
      this.userInfo();
    }
  }

  checkAddressEnter() {
    $('#checkAddress').click();
  }

  checkAddress() {
    // this.log.debug(this.address + ' :::: ' + this.address_pattenTest());
    if (this.address_pattenTest()) {
      this.isAddress == true;
      $('#address').val(this.user['address']);
      this.userSave();
    } else {
      this.userInfo();
    }
  }

  checkPassword(event: any) {

    var reg_pwd = /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/;
    if (!reg_pwd.test(this.password_new)) {
      this.isPassword = false;
      return;
    }
    this.isPassword = true;
  }

  checkRePassword(event: any) {
    if (this.password_new == this.password_confirm) {
      this.isRePassword = true;
      return;
    } else {
      this.isRePassword = false;
    }
  }

  checkChPassword(event: any) {
    var reg_pwd = /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/;
    if (!reg_pwd.test(this.password_check)) {
      this.isChPassword = false;
      return;
    }
    this.isChPassword = true;
  }

  updateUserPassword() {
    this.common.isLoading = true;
    this.common.getInfrasAll().subscribe(data => {
      data.forEach(data => {
        if (data.length <= 0) {
          this.defaultPassword();
        } else {
          let param = {id: this.user['userId'], password: this.password_now};
          this.common.doPost('/portalapi/login', param, '').subscribe(data => { //1)로그인
            this.regionPassword();
          }, error => {
            this.common.alertMessage('변경하는데 실패하였습니다.', false);
            this.common.isLoading = false;
            $('#password_now').val('');
            $('#password_new').val('');
            $('#password_confirm').val('');
          });
        }
      });
    });
  }

  defaultPassword() {
    let params = {
      userGuid: this.common.getUserGuid(),
      oldPassword: this.password_now,
      password: this.password_new
    };
    this.userMgmtService.updateUserPassword(this.common.getUserid(), params).subscribe(data => {
      if (data.result && this.isPassword && this.isRePassword) {
        this.common.saveToken(data.token['token_type'], data.token['access_token'], data.token['refresh_token'], data.token['expires_in'], data.token['scope'], 'OAUTH');
        this.common.alertMessage(this.translateEntities.alertLayer.passwordSuccess, true);
        this.common.isLoading = false;
      } else {
        this.common.alertMessage(this.translateEntities.alertLayer.newPasswordFail + '<br><br>' + data.msg, false);
        this.common.isLoading = false;
      }
      $('#password_now').val('');
      $('#password_new').val('');
      $('#password_confirm').val('');
    });
  }


  regionPassword() {
    this.common.isLoading = true;
    let param = {userId: this.user['userId'], password: this.password_new};
    if (this.password_now != this.password_new) {
      if (this.password_new == this.password_confirm) {
        this.common.getInfrasAll().subscribe(data => {
          let size = data.length;
          let success = 0;
          let forEachCount = 0;

          data.forEach(data => {
            let result = data['apiUri'];
            this.externalService.reset_external(result, data['authorization'], param).subscribe(region => {
              forEachCount++;
              this.common.isLoading = false;
              if (region['result'] == true) {
                success++;
              }

              if (forEachCount == size) {
                if (success == size) {
                  this.common.alertMessage(this.translateEntities.alertLayer.passwordSuccess, true);
                  setTimeout(() => {
                    this.common.isLoading = false;
                    this.router.navigate(['/logout']);
                  }, 2000);
                }
              }

            }, error => {
              this.common.isLoading = false;
              this.common.alertMessage(this.translateEntities.alertLayer.passwordFailNotFound, false);
              this.router.navigate(['/usermgmt']);
            });
          });
        }, error => {
          this.serverError();
        }, () => {
          this.common.isLoading = false;
        });
      } else {
        this.common.isLoading = false;
        this.common.alertMessage(this.translateEntities.alertLayer.newPasswordFail, false);
        setTimeout(() => {
          this.router.navigate(['/usermgmt']);
        }, 1000);
        $('#password_now').val('');
        $('#password_new').val('');
        $('#password_confirm').val('');
      }
    } else {
      this.common.isLoading = false;
      this.common.alertMessage(this.translateEntities.alertLayer.sameAsPasswordFail, false);
      setTimeout(() => {
        this.router.navigate(['/usermgmt']);
      }, 1000);
      $('#password_now').val('');
      $('#password_new').val('');
      $('#password_confirm').val('');
    }
  }

  isNumber(data) {
    if (isNaN(data)) {
      return false;
    } else {
      return true;
    }
  }


  tellPhone_pattenTest() {
    let value = this.tellPhone;

    const reg_alpha = /^[A-Za-z]*$/;
    const regExpBlankPattern = /[\s]/g;
    const reg_koreanPatten = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;

    if (this.tellPhone.length > 11) {
      this.isTellPhone = false;
      return false;
    }

    if (!reg_alpha.test(value) && !reg_koreanPatten.test(value) && !regExpBlankPattern.test(value) && this.isNumber(value)) {
      this.isTellPhone = true;
      return true;
    } else {
      // $('#tellPhone').val('');
      this.isTellPhone = false;
      return false;
    }

  }

  zipCode_pattenTest() {
    let value = this.zipCode;

    const reg_koreanPatten = /^[가-힣]+$/;
    const regExpBlankPattern = /[\s]/g;
    const reg_zip = /^[A-Za-z0-9]{0,1000}$/;

    if (this.zipCode.length > 14) {
      this.isZipCode = false;
      return false;
    }

    if (reg_zip.test(value) && !reg_koreanPatten.test(value) && !regExpBlankPattern.test(value)) {
      this.isZipCode = true;
      return true;
    } else {
      // $('#zipCode').val('');
      this.isZipCode = false;
      return false;
    }
  }

  address_pattenTest() {
    let value = this.address;

    if (this.address.length < 256) {
      this.isAddress = true;
      return true;
    } else {
      // $('#address').val('');
      this.isAddress = false;
      return false;
    }
  }


  orgInit() {
    this.userMgmtService.getOrgList().subscribe(data => {
      this.orgs = data.resources;
    });
  }

  popclickOrg(guid: string, name: string) {
    this.selectedOrgGuid = guid;
    this.selectedOrgName = name;
  }

  cancelOrg(orgId: string) {
    this.common.isLoading = true;
    if (orgId != '') {
      let param = {
        userId: this.common.getUserGuid()
      };
      this.userMgmtService.orgMembers(orgId).subscribe(data => {
        let members = data.resources;
        if (members.length > 1) {
          this.deleteOrg('/portalapi/' + this.apiversion + '/orgs/' + orgId + '/member', param).subscribe(data => {
            this.common.alertMessage(this.translateEntities.alertLayer.orgDeleteSuccess, true);
            this.userMgmtService.getOrgList().subscribe(data => {
              this.orgs = data.resources;
            });
          }, error => {
            this.common.alertMessage(this.translateEntities.alertLayer.orgDeleteFail, false);
          }, () => {
            this.common.isLoading = false;
          });
        } else {
          this.common.alertMessage(this.translateEntities.alertLayer.memberCancelFail2, false);
          this.common.isLoading = false;
        }
      });
    } else {
      this.common.isLoading = false;
    }
  }

  deleteOrg(url: string, body: any) {
    return this.common.doDelete(url, body, this.common.getToken()).map((res: any) => {
      return res;
    });
  }

  userAllDelete() {
    this.common.isLoading = true;
    this.apiLogin(this.username, this.password).subscribe(data => {
      if (data['user_name'] == this.user['userId']) {
        // 조직 유무 확인
        this.userMgmtService.getOrgList().subscribe(data => {
          if (data.resources.length > 0) {
            this.common.isLoading = false;
            this.common.alertMessage(this.translateEntities.alertLayer.orgDeleteFeedback, false);
          } else {
            this.common.isLoading = false;
            // 계정삭제:cf,db
            this.userMgmtService.userAllDelete(this.common.getUserGuid(), '').subscribe(data => {
              this.common.isLoading = false;
              this.common.alertMessage(this.translateEntities.alertLayer.accountDeleteSuccess, true);
              this.goLogout();
            });
          }
        });
      }
      return data;
    }, error => {
      this.common.isLoading = false;
      this.common.alertMessage('비밀번호를 다시 입력하세요.', false);
      this.common.alertMessage(this.translateEntities.alertLayer.passwordFail, false);
    });
  }

  serverError() {
    this.common.alertMessage(this.translateEntities.alertLayer.serverError, false);
    this.userMgmtService.back();
  }

  apiLogin(username: string, password: string) {
    this.common.isLoading = true;
    let params = {
      id: this.user['userId'],
      password: this.password_check
    };
    if (this.password_now == this.password) {
      return this.common.doPost('/portalapi/login', params, '').map(data => {
        return data;
      });
    }
  }

  goLogout() {
    this.common.signOut();
  }

  ngOnInit() {
    $(document).ready(() => {
      //TODO 임시로...
      $.getScript('../../assets/resources/js/common.js')
        .done(function (script, textStatus) {
        })
        .fail(function (jqxhr, settings, exception) {
        });
    });
  }

  inputFocus(inputid: string) {
    setTimeout(() => {
      if (inputid === 'password_now') {
        $('#password_now').trigger('focus');
      } else if (inputid === 'userName') {
        $('#userName').trigger('focus');
      } else if (inputid === 'tellPhone') {
        $('#tellPhone').trigger('focus');
      } else if (inputid === 'zipCode') {
        $('#zipCode').trigger('focus');
      } else if (inputid === 'address') {
        $('#address').trigger('focus');
      }
    }, 300);
  }

}
