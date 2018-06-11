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

import {FormControl} from '@angular/forms';
import {viewWrappedDebugError} from '@angular/core/src/view/errors';
import {validate} from 'codelyzer/walkerFactory/walkerFn';
import {isNumber} from "util";
import {userInfo} from "os";

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

  public token: string = '';
  public orgName: string = '';
  public username: string = '';
  public password: string = '';
  public tellPhone: string;
  public zipCode: string;

  public isPassword: boolean;
  public isRePassword: boolean;
  public isChPassword: boolean;
  public isOrignPassword: boolean;

  public isTellPhone: boolean;
  public isZipCode : boolean;

  public password_now: string = '';
  public password_new: string = '';
  public password_confirm: string = '';
  public password_check: string = '';
  public selectedOrgGuid: string = '';
  public selectedOrgName: string = '';

  public fileToUpload: File = null;

  constructor(private httpClient: HttpClient, private common: CommonService, private userMgmtService: UsermgmtService, private orgService: OrgService,
              private router: Router, private activeRoute: ActivatedRoute, private sec: SecurityService, private log: NGXLogger) {

    this.userInfo();
    this.user = new Observable<User>();
    this.orgs = orgService.getOrgList();
    this.token = '';
    this.orgName = '';
    this.password = '';
    this.isTellPhone= true;
    this.isZipCode = true;

    this.isOrignPassword = true;
    this.isPassword = false;
    this.isRePassword = true;
    this.isChPassword = false;
  }

  userInfo() {
    this.userMgmtService.userinfo(this.common.getUserid()).subscribe(data => {
      console.log(data);
      this.user = data;
      this.tellPhone = data['tellPhone'];
      this.zipCode = data['zipCode'];
      return data;
    });
  }

  userSave() {
      let params = {
      userName: this.user['userName'],
      tellPhone: this.tellPhone,
      zipCode: this.zipCode,
      address: this.user['address']
    };
      this.common.isLoading = true;
      this.userMgmtService.userSave(this.common.getUserid(), params).subscribe(data => {
        if (data== 1 && this.isTellPhone && this.isZipCode) {
          alert('성공적으로 변경되었습니다.');
          this.common.isLoading = false;
          console.log(data);
          return data;
        }else{
          this.common.isLoading = false;
        }
        return data;
      },error=>{
        alert('다시 입력하세요.');
        this.common.isLoading = false;
      });
  }

  checkOriginalPassword(event: any) {
    this.log.debug('password_now :: ' + this.password_now);
    var reg_pwd = /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/;
    //TODO  로그인시 사용되는 비밀번호 비교
    if (!reg_pwd.test(this.password_now)) {
      this.isOrignPassword = false;
    } else {
      this.isOrignPassword = true;
    }
  }

  checkPassword(event: any) {
    this.log.debug('password_new :: ' + this.password_new);
    // var reg_pwd = /^.*(?=.{6,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;
    var reg_pwd = /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/;
    if (!reg_pwd.test(this.password_new)) {
      this.isPassword = false;
      return;
    }
    this.isPassword = true;
  }

  checkRePassword(event: any) {
    this.log.debug('password_confirm :: ' + this.password_confirm);
    if (this.password_new == this.password_confirm) {
      this.isRePassword = true;
    } else {
      this.isRePassword = false;
    }
  }

  checkChPassword(event: any) {
    this.log.debug('password_check :: ' + this.password_check);
    // var reg_pwd = /^.*(?=.{6,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;
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
      //TODO : 패스워드 확인 작업 (1) 현재 비밀번호와 새 비밀번호 동일 시 F, (2) 현재 비밀번호가 맞지 않을 때 F (3) 정규식 맞지 않을 때 F
      if (data == 1 && this.isPassword && this.isRePassword) {
        alert('성공적으로 생성되었습니다.');
        this.common.isLoading = false;
        return data;
      }else{
        alert('새 비밀번호를 다시 입력하세요.');
        this.common.isLoading = false;
      }
    });
  }

  isNumber(data) {
    if (isNaN(data)) {
      return false;
    } else {
      return true;
    }
  }

  checkTellPhone(event: any) {
    //TODO: 전화번호 한 글자는 그대로 저장됨, 하지만 특정 숫자 이상 넘어가면 저장 불가능함(이하 동일 우편번호)
    var reg_alpha = /^[A-Za-z]*$/ ;
    var reg_hangeul = /^[가-힣]+$/;
    var reg_hangeul2 = /^[\u3131-\u318E\uAC00-\uD7A3]*$/;
    if (!reg_alpha.test(this.tellPhone) && !reg_hangeul.test(this.tellPhone)
        && !reg_hangeul2.test(this.tellPhone) && this.isNumber(this.tellPhone)) {
      this.isTellPhone = true;
    } else{
      this.isTellPhone = false;
    }
  }

  checkZipCode(event: any) {
    // var reg_zip = /^[a-z0-9_-]{3,6}$/;
    if (this.isNumber(this.zipCode)) {
      this.isZipCode = true;
    } else {
      this.isZipCode = false;
    }
  }

  popclickOrg(guid: string, name: string) {
    this.selectedOrgGuid = guid;
    this.selectedOrgName = name;
    console.log("::GUID::" + guid + "::NAME" + name);
  }

  cancelOrg(orgId: string) {
    this.orgService.cancelOrg(orgId, this.common.getUserGuid());
    this.orgs = this.orgService.getOrgList();
  }

  userAllDelete(){
    console.log(":: delete start ::" + " username : " +this.user['userId'] +"  "+ "password :" + this.password_check +"  "+"userGuid :" + this.common.getUserGuid()+"  "+"Guid :" + this.common.getUserid());
    this.common.isLoading = true;
    this.apiLogin(this.username,this.password).subscribe(data => {
      this.log.debug(data['user_name']);
      if(data['user_name'] == this.user['userId']){
        this.common.isLoading = false;
        // 계정삭제:cf,db
        this.userMgmtService.userAllDelete(this.common.getUserGuid(),'').subscribe();
        alert('계정삭제가 완료되었습니다.');
        this.goLogout();
      }else{
        this.common.isLoading = false;
      }
      return data;
    }, error => {
      this.common.isLoading = false;
      alert('비밀번호를 다시 입력하세요.');
    });
  }

  apiLogin(username: string, password: string) {
    this.common.isLoading = true;
    console.log(":: api Login ::" + " username : " +this.user['userId'] +"  "+ "password :" + this.password_check +"  "+"userGuid :" + this.common.getUserGuid()+"  "+"Guid :" + this.common.getUserid());
    let params = {
      id: this.user['userId'],
      password: this.password_check
    };
    if(this.password_now == this.password){
      return this.common.doPost('/portalapi/login', params, '').map(data => {
        return data;
      });
    }
  }

  goLogout(){
    this.log.debug('doLogout()');
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
