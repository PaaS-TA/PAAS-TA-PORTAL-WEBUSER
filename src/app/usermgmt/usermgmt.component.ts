import {Component, OnInit} from '@angular/core';
import {CommonService} from '../common/common.service';
import {User, UsermgmtService} from './usermgmt.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {NGXLogger} from 'ngx-logger';
import {Organization} from '../model/organization';
import {OrgService} from '../org/common/org.service';
import {ActivatedRoute, Router} from "@angular/router";
import {SecurityService} from "../auth/security.service";
import {AppConfig} from "../app.config";
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import {isNullOrUndefined} from "util";


declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-usermgmt',
  templateUrl: './usermgmt.component.html',
  styleUrls: ['./usermgmt.component.css']
})
export class UsermgmtComponent implements OnInit {
  public user: Observable<User>;
  public orgs: Array<Organization> = [];
  public translateEntities: any = [];

  public token: string = '';
  public orgName: string = '';
  public username: string = '';
  public password: string = '';
  public tellPhone: string;
  public zipCode: string;
  public address: string;
  public photoFile : string;
  public imgPath : string;

  public isPassword: boolean;
  public isRePassword: boolean;
  public isChPassword: boolean;
  /*현재비밀번호 public isOrignPassword: boolean; */

  public isTellPhone: boolean;
  public isZipCode: boolean;
  public isAddress: boolean;

  public password_now: string = '';
  public password_new: string = '';
  public password_confirm: string = '';
  public password_check: string = '';
  public selectedOrgGuid: string = '';
  public selectedOrgName: string = '';

  public check: number = 0;

  public fileToUpload: File = null;

  constructor(private httpClient: HttpClient, private common: CommonService, private userMgmtService: UsermgmtService, private translate: TranslateService,
              private router: Router, private activeRoute: ActivatedRoute, private sec: SecurityService, private log: NGXLogger) {


    this.user = new Observable<User>();
    this.orgs = new Array<Organization>();
    this.token = '';
    this.orgName = '';
    this.password = '';
    this.isTellPhone = false;
    this.isZipCode = false;
    this.isAddress = false;
    this.photoFile = '';

    /*현재비밀번호 this.isOrignPassword = true; */
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

  onFileChanged(){
    $("#photoFile").trigger("click");
  }

  onFileChanged_click(event) {

    const file = event.target.files[0];
    if(isNullOrUndefined(file)){
      return;
    }
    this.fileToUpload = file;
    $("#photo").fadeIn("fast").attr('src',URL.createObjectURL(event.target.files[0]));
    $("#onUploadBtn").show();
  }

  onUpload(){
    if(isNullOrUndefined(this.fileToUpload)){
      return;
    }
    let formData = new FormData();
    formData.append('file',  this.fileToUpload,  this.fileToUpload.name);
    this.userMgmtService.photoRegistration(formData).subscribe(data => {
      $("#onUploadBtn").hide(); //TO disabled
      this.imgPath = data.fileURL;
      this.userSave();
    },error => {
      console.debug(error);
    });
  }


  userInfo() {
    this.userMgmtService.userinfo(this.common.getUserid()).subscribe(data => {
      this.user = data;
      this.tellPhone = data['tellPhone'];
      this.zipCode = data['zipCode'];
      this.address = data['address'];
      try{
        var pathHeader = data['imgPath'].lastIndexOf("/");
        var pathEnd = data['imgPath'].length;
        var fileName = data['imgPath'].substring(pathHeader + 1, pathEnd);
        this.userMgmtService.getImg('/storageapi/v2/swift/'+fileName).subscribe(data => {
          let reader = new FileReader();
          reader.addEventListener("load", () => {
            this.photoFile = reader.result;
            this.common.setImagePath(this.photoFile);
          }, false);
          if (data) {
            reader.readAsDataURL(data);
          }}, error=> {
        });
      } catch (e) {
      }
      return data;
    });
  }

  userSave() {

    let params = {
      userName: this.user['userName'],
      tellPhone: this.tellPhone,
      zipCode: this.zipCode,
      address: this.address,
      imgPath : this.imgPath
    };

    this.common.isLoading = true;
    console.log(params);
    this.userMgmtService.userSave(this.common.getUserid(), params).subscribe(data => {
      if(data.result){
        this.common.alertMessage(this.translateEntities.alertLayer.ChangeSuccess, true);
        this.common.isLoading = false;
        console.log(data);
        return this.userInfo();
      }else{
        this.common.alertMessage(this.translateEntities.alertLayer.ChangeSuccessFail + "<br><br>" + data.msg, false);
        this.common.isLoading = false;
      }
    }, error => {
      this.common.alertMessage(this.translateEntities.alertLayer.ChangeSuccessFail, false);
      this.common.isLoading = false;
    });
    /*reset*/
    $('#tellPhone').val('');
    $('#zipCode').val('');
    $('#address').val('');
  }

  cancelButton(){
    $('#userName').val('');
    $('#tellPhone').val('');
    $('#zipCode').val('');
    $('#address').val('');
  }

  checkTellPhone() {
    // this.log.debug(this.tellPhone + ' :::: ' + this.tellPhone_pattenTest());
    if (this.tellPhone_pattenTest()){
      this.isTellPhone == true;
      $('#tellPhone').val(this.user['tellPhone']);
      this.userSave();
    } else {
      this.isTellPhone == false;
      this.common.alertMessage(this.translateEntities.alertLayer.ChangeSuccessFail, false);
      $('#tellPhone').val('');
      return this.userInfo;
    }
  }

  checkZipCode() {
    // this.log.debug(this.zipCode + ' :::: ' + this.zipCode_pattenTest());
    if (this.zipCode_pattenTest()){
      this.isZipCode == true;
      $('#zipCode').val(this.user['zipCode']);
      this.userSave();
    }else{
      this.isZipCode == false;
      this.common.alertMessage(this.translateEntities.alertLayer.ChangeSuccessFail, false);
      $('#zipCode').val('');
      return this.userInfo;
    }
  }

  checkAddress() {
    // this.log.debug(this.address + ' :::: ' + this.address_pattenTest());
    if (this.address_pattenTest()){
      this.isAddress == true;
      $('#address').val(this.user['address']);
      this.userSave();
    }else{
      this.isAddress == false;
      this.common.alertMessage(this.translateEntities.alertLayer.ChangeSuccessFail, false);
      $('#address').val('');
      return this.userInfo;
    }
  }

  checkPassword(event: any) {
    // this.log.debug('password_new :: ' + this.password_new);
    // var reg_pwd = /^.*(?=.{6,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;
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
    let params = {
      oldPassword: this.password_now,
      password: this.password_new
    };
    this.common.isLoading = true;
    this.userMgmtService.updateUserPassword(this.common.getUserid(), params).subscribe(data => {
      console.debug(this.common.getUserGuid());
      if (data == 1 && this.isPassword && this.isRePassword) {
        this.common.alertMessage(this.translateEntities.alertLayer.passwordSuccess, true);
        this.common.isLoading = false;
      } else {
        this.common.alertMessage(this.translateEntities.alertLayer.newPasswordFail+ "<br><br>" + data.msg, false);
        this.common.isLoading = false;
      }
      /*reset*/
      $('#password_now').val('');
      $('#password_new').val('');
      $('#password_confirm').val('');
    });
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

    var reg_alpha = /^[A-Za-z]*$/;
    var reg_koreanPatten = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;
    // var reg_koreanPatten2 = /^[\u3131-\u318E\uAC00-\uD7A3]*$/;
    if (!reg_alpha.test(value) && !reg_koreanPatten.test(value) && this.isNumber(value)) {
      this.isTellPhone = true;
      return true;
    } else {
      this.isTellPhone = false;
      return false;
    }
  }

  zipCode_pattenTest() {
    let value = this.zipCode;

    const reg_koreanPatten = /^[가-힣]+$/;
    // var reg_koreanPatten =  /^[\u3131-\u318E\uAC00-\uD7A3]*$/;
    var reg_zip = /^[A-Za-z0-9]{0,1000}$/;
    if (reg_zip.test(value) && !reg_koreanPatten.test(value)) {
      this.isZipCode = true;
      return true;
    } else {
      this.isZipCode = false;
      return false;
    }
  }

  address_pattenTest() {
    let value = this.address;

    if (this.address.length < 256) {
      console.log(this.address.length);
      this.isAddress = true;
      return true;
    } else {
      this.isAddress = false;
      return false;
    }
  }

  orgInit(){
    this.userMgmtService.getOrgList().subscribe(data => {
      this.orgs = data.resources;
      console.log(this.orgs);
    })
  }

  popclickOrg(guid: string, name: string) {
    this.selectedOrgGuid = guid;
    this.selectedOrgName = name;
    console.log("::GUID::" + guid + "::NAME" + name);
  }

  cancelOrg(orgId: string) {
    this.common.isLoading = true;
    if (orgId != '') {
      let param = {
        userId : this.common.getUserGuid()
      }
      this.deleteOrg('/portalapi/v2/orgs/' + orgId + '/member', param).subscribe(data => {
        this.common.alertMessage(this.translateEntities.alertLayer.orgDeleteSuccess, true);
        this.userMgmtService.getOrgList().subscribe(data => {
            this.orgs = data.resources;
        })
      }, error=> {
        this.common.alertMessage(this.translateEntities.alertLayer.orgDeleteFail, false);
      },() => {
        this.common.isLoading= false;
      });
    } else {
      this.common.isLoading = false;
    }
  }

  deleteOrg(url : string, body : any){
    return this.common.doDelete(url, body, this.common.getToken()).map((res : any) => {
      return res;
    });
  }

  userAllDelete() {
    console.log(":: delete start ::" + " username : " + this.user['userId'] + "  " + "password :" + this.password_check + "  " + "userGuid :" + this.common.getUserGuid() + "  " + "Guid :" + this.common.getUserid());
    this.common.isLoading = true;
    this.apiLogin(this.username, this.password).subscribe(data => {
      // this.log.debug(data['user_name']);
      if (data['user_name'] == this.user['userId']) {
        this.common.isLoading = false;
        // 계정삭제:cf,db
        this.userMgmtService.userAllDelete(this.common.getUserGuid(), '').subscribe();
        this.common.alertMessage(this.translateEntities.alertLayer.accountDeleteSuccess, true);
        this.goLogout();
      } else {
        this.common.isLoading = false;
      }
      return data;
    }, error => {
      this.common.isLoading = false;
      this.common.alertMessage('비밀번호를 다시 입력하세요.' , false);
      this.common.alertMessage(this.translateEntities.alertLayer.passwordFail, false);
    });
  }

  apiLogin(username: string, password: string) {
    this.common.isLoading = true;
    console.log(":: api Login ::" + " username : " + this.user['userId'] + "  " + "password :" + this.password_check + "  " + "userGuid :" + this.common.getUserGuid() + "  " + "Guid :" + this.common.getUserid());
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
    // this.log.debug('doLogout()');
    this.common.signOut();

    const returnUrl = this.activeRoute.snapshot.queryParams['returnUrl'] || '/';
    window.location.href = AppConfig.logoutUrl +
      '?response_type=' + AppConfig.code +
      '&client_id=' + AppConfig.clientId +
      '&redirect_uri=' + AppConfig.redirectUri + ('%3FreturnUrl%3D' + returnUrl) +
      '&scope=' + AppConfig.scope +
      '&state=';
  }

  ngOnInit() {
    console.log('ngOnInit fired');

    $(document).ready(() => {
      //TODO 임시로...
      $.getScript("../../assets/resources/js/common.js")
        .done(function (script, textStatus) {
          //console.log( textStatus );
        })
        .fail(function (jqxhr, settings, exception) {
          console.log(exception);
        });
    });
  }

}//
