import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CommonService} from "../../common/common.service";
import {NGXLogger} from "ngx-logger";
import {ExternalcommonService} from "../common/externalcommon.service";

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

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


  checkPassword() {
    this.log.debug('password :: ' + this.password);
    var reg_pwd = /^.*(?=.{6,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/;
    if (!reg_pwd.test(this.password)) {
      this.log.debug('password :: 1');
      this.isPassword = false;
      return;
    }

    if (this.password.search(/₩s/) != -1) {
      this.log.debug('password :: 2');
      this.isPassword = false;
      return;
    }

    this.isPassword = true;
  }


  checkRePassword() {
    this.log.debug('repassword :: ' + this.re_password);
    if (this.password == this.re_password) {
      this.isRePassword = true;
    } else {
      this.isRePassword = false;
    }
  }

  save() {
    this.commonService.isLoading = true;
    if (this.isPassword && this.isRePassword) {
      let param = {
        'userId': this.userId,
        'password': this.password
      }
      this.externalService.reset(param).subscribe(data => {
        if (data['result'] == true) {
          this.commonService.isLoading = false;
          this.commonService.alertMessage('성공적으로 변경되었습니다.', true);
          let userInfo = {'refreshToken': '', 'authAccessTime': '', 'authAccessCnt': 0};
          this.externalService.updateInfo(this.userId, userInfo);
          this.router.navigate(['login']);
        } else {
          alert(data['msg']);
        }
      },error =>{
        this.commonService.alertMessage('변경하는데 실패하였습니다.', false);
        this.commonService.isLoading = false;
      } );
    }
  }

}
