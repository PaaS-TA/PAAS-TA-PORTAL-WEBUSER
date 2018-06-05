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
  public isTellPhone: boolean;
  public isZipCode : boolean;

  public password_now: string = '';
  public password_new: string = '';
  public password_confirm: string = '';
  public password_check: string = '';
  public selectedOrgGuid: string = '';
  public selectedOrgName: string = '';

  constructor(private httpClient: HttpClient, private common: CommonService,
              private userMgmtService: UsermgmtService,
              private orgService: OrgService,
              private router: Router,
              private route: ActivatedRoute,
              private sec: SecurityService,
              private log: NGXLogger) {

    this.userInfo();
    this.user = new Observable<User>();
    this.orgs = orgService.getOrgList();
    this.token = '';
    this.orgName = '';
    this.isPassword = false;
    this.isRePassword = true;
    this.isChPassword = true;
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
    if(this.isTellPhone || this.isZipCode){
      let params = {
      userName: this.user['userName'],
      tellPhone: this.tellPhone,
      zipCode: this.zipCode,
      address: this.user['address']
    };
      this.common.isLoading = true;
      this.userMgmtService.userSave(this.common.getUserid(), params).subscribe(data => {
        if (data== 1) {
          this.common.isLoading = false;
          alert('성공적으로 생성');
          console.log(data);
        }else{
          this.common.isLoading = false;
          return data;
        }
      });
    }
  }

  checkPassword(event: any) {
    this.log.debug('password_new :: ' + this.password_new);
    var reg_pwd = /^.*(?=.{6,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;
    if (!reg_pwd.test(this.password_new)) {
      this.log.debug('password :: 1');
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
    if (this.password_now == this.password_check) {
      this.isChPassword = true;
    } else {
      this.isChPassword = false;
    }
  }

  updateUserPassword() {
    let params = {
      oldPassword: this.password_now,
      password: this.password_new
    };
    this.userMgmtService.updateUserPassword(this.common.getUserid(), params).subscribe(data => {
      console.log(this.common.getUserGuid());
      //TODO : alert 메세지 알람 필수
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
    if (this.isNumber(this.tellPhone)) {
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
    return this.orgService.cancelOrg(orgId, this.common.getUserGuid());
  }

  userAllDelete(){
    console.log(":: delete start ::" + " username : " +this.user['userId'] +"  "+ "password :" + this.password_check +"  "+"userGuid :" + this.common.getUserGuid()+"  "+"Guid :" + this.common.getUserid());
    // 로그인 시도
    // 로그인 삭제
    this.common.isLoading = true;
    this.apiLogin(this.username,this.password).subscribe(data => {
      if(data ==1){
        this.common.isLoading = false;
        console.log('success');
        alert("delete success:)");
        // 계정삭제:cf,db
        this.userMgmtService.userAllDelete(this.common.getUserGuid()).subscribe();
      }else{
        this.common.isLoading = false;
        console.log('delete does not exist');
        alert("u email or password check :(");
      }
      console.log(data);
      return data;
    }, error => {
      this.common.isLoading = false;
    });
  }

  apiLogin(username: string, password: string) {
    this.common.isLoading = true;
    console.log(":: api Login ::" + " username : " +this.user['userId'] +"  "+ "password :" + this.password_check +"  "+"userGuid :" + this.common.getUserGuid()+"  "+"Guid :" + this.common.getUserid());
    let params = {
      id: this.user['userId'],
      password: this.password_check
    };
    return this.common.doPost('/portalapi/login', params, '').map(data => {
      this.log.debug(data);
      return data;
    });
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
