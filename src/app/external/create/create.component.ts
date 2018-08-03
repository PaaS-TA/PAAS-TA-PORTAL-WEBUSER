import {Component, OnInit} from '@angular/core';
import {CommonService} from "../../common/common.service";
import {NGXLogger} from "ngx-logger";
import {ActivatedRoute, Router} from "@angular/router";
import {ExternalcommonService} from "../common/externalcommon.service";
declare var $: any;
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  public token: string;
  public userId: string;
  public username: string;
  public password: string;
  public re_password: string;
  public isValidation: boolean;
  public isUserName: boolean;
  public isPassword: boolean;
  public isRePassword: boolean;

  constructor(private commonService: CommonService, private externalService: ExternalcommonService, private router: Router, private route: ActivatedRoute, private log: NGXLogger) {
    this.userId = '';
    this.username = '';
    this.password = '';
    this.re_password = '';
    this.isValidation = false;
    this.isUserName = false;
    this.isPassword = false;
    this.isRePassword = true;
    this.userId = this.route.snapshot.queryParams['userId'] || '/';
    this.token = this.route.snapshot.queryParams['refreshToken'] || '/';
    if (this.userId.length > 0 && this.token.length > 0) {
      this.externalService.getUserTokenInfo(this.userId, this.token).subscribe(data => {
        if (data == null) {
          this.router.navigate(['error'], {queryParams: {error: '1'}});
        } else {
          let accessTime = data['authAccessTime'];
          let accessCount = data['authAccessCnt'];
          let now = new Date();
          if (accessTime <= now.getTime().toString()) {
            let userInfo = {'refreshToken': '', 'authAccessTime': '', 'authAccessCnt': 0};
            this.externalService.updateInfo(this.userId, userInfo);
            this.router.navigate(['error'], {queryParams: {error: '1'}});
          }
          if (accessCount > 3) {
            let userInfo = {'refreshToken': '', 'authAccessTime': '', 'authAccessCnt': 0};
            this.externalService.updateInfo(this.userId, userInfo);
            this.router.navigate(['error'], {queryParams: {error: '1'}});
          } else {
            let userInfo = {'authAccessCnt': (accessCount + 1)};
            this.externalService.updateInfo(this.userId, userInfo);
          }
        }
      });

    } else {
      this.router.navigate(['error'], {queryParams: {error: '1'}});
    }

  }


  ngOnInit() {

  }

  checkUsername() {
    ////this.log.debug('username :: ' + this.username);
    if (this.username.length == 0) {
      this.isUserName = false;
    } else {
      this.isUserName = true;
    }
  }


  checkPassword() {
    ////this.log.debug('password :: ' + this.password);
    var reg_pwd = /^.*(?=.{6,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;
    if (!reg_pwd.test(this.password)) {
      ////this.log.debug('password :: 1');
      this.isPassword = false;
      return;
    }

    if (this.password.search(/₩s/) != -1) {
      ////this.log.debug('password :: 2');
      this.isPassword = false;
      return;
    }

    this.isPassword = true;
  }


  checkRePassword() {
    ////this.log.debug('repassword :: ' + this.re_password);
    if (this.password == this.re_password) {
      this.isRePassword = true;
    } else {
      this.isRePassword = false;
    }
  }

  save() {
    if (this.isUserName && this.isPassword && this.isRePassword) {
      let param = {
        'userId': this.userId,
        'userName': this.username,
        'password': this.password,
        'tellPhone': '',
        'address': '',
        'active' : true
         // 'active' : $("[id^='ra2']").is(":checked")
      }

      this.externalService.createUser(param).subscribe(data => {
        this.commonService.isLoading = true;
        if (data['result'] == true) {
          this.commonService.isLoading = false;
          this.commonService.alertMessage('성공적으로 생성되었습니다.', true);
          let userInfo = {
            'userId': this.userId,
            'userName': this.username,
            'refreshToken': '',
            'authAccessTime': '',
            'authAccessCnt': 0,
            'active' : 'Y'
            // 'active' : $("[id^='ra2']").is(":checked") ? 'Y' : 'N'
          };
          this.externalService.updateInfo(this.userId, userInfo);
          this.router.navigate(['login']);
        } else {
          this.commonService.alertMessage(data['msg'], false);
        }
      });
    }
  }


}
