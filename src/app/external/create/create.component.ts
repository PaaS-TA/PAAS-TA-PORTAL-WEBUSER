import {Component, OnInit} from '@angular/core';
import {CommonService} from "../../common/common.service";
import {NGXLogger} from "ngx-logger";
import {ActivatedRoute, Router} from "@angular/router";
import {ExternalcommonService} from "../common/externalcommon.service";
import {User, UsermgmtService} from "../../usermgmt/usermgmt.service";
import {Observable} from "rxjs";
import {IndexCommonService} from "../../index/userAccountMgmt/index-common.service";

declare var $: any;
declare var require: any;
let appConfig = require('assets/resources/env/config.json');

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})


export class CreateComponent implements OnInit {

  apiversion = appConfig['apiversion'];
  public user: Observable<User>;

  public seq: string;
  public token: string;
  public userId: string;
  public username: string;
  public password: string;
  public re_password: string;
  public isValidation: boolean;
  public isUserName: boolean;
  public isPassword: boolean;
  public isRePassword: boolean;
  public regions: string[];
  public key: string;
  public password_check: string = '';
  public password_now: string = '';

  public isUsed: boolean;


  constructor(public indexCommonService: IndexCommonService, private commonService: CommonService, private userMgmtService: UsermgmtService, private externalService: ExternalcommonService,
              private activeRoute: ActivatedRoute, private router: Router, private route: ActivatedRoute, private log: NGXLogger) {

    this.seq = '';
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
    this.seq = this.route.snapshot.queryParams['seq'] || '/';

    this.commonService.getInfra(this.seq).subscribe(infra =>{
      if (this.userId.length > 0 && this.token.length > 0) {
        this.externalService.getUserTokenInfo(this.userId, this.token, this.seq).subscribe(tokeninfo => {
          if (tokeninfo == null) {
            this.router.navigate(['error'], {queryParams: {error: '1'}});
          } else {
            let accessTime = tokeninfo['authAccessTime'];
            let accessCount = tokeninfo['authAccessCnt'];
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
    });
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
    this.commonService.isLoading = true;
    if (this.isUserName && this.isPassword && this.isRePassword) {

      let param = {
        'userId': this.userId,
        'userName': this.username,
        'password': this.password,
        'tellPhone': '',
        'address': '',
        'active': this.commonService.getAutomaticApproval()
      }

      this.commonService.getInfrasAll().subscribe(data => {
        let size = data.length;
        let createSuccess = 0; // 성공여부 확인
        let forEachCount = 0;  // apiUrl 개수 확인

        data.forEach(data => {
          if (size > 0) {
            let result = data['apiUri'];
            this.externalService.createUser_external(result, data["authorization"], param).subscribe(region => {
              forEachCount++;
              this.commonService.isLoading = false;

              let userInfo = {'userId': this.userId, 'userName': this.username, 'password': this.password, 'tellPhone': '', 'address': '',
                'active': this.commonService.getAutomaticApproval() ? 'Y' : 'N', 'refreshToken': '', 'authAccessTime': '', 'authAccessCnt': 0, 'seq' : this.commonService.getSeq()
              };

              if (region['result'] == true) {
                createSuccess++;
                this.externalService.updateInfo_external(this.userId, result, data["authorization"], userInfo);
              }

              this.log.debug("forEachCount: " + forEachCount + " " +  "size: " + size + " " + "createSuccess: " + createSuccess);

              if(forEachCount == size){
                this.log.debug("1:: " + forEachCount + " " + size);
                if (createSuccess == size) {
                  this.log.debug("2:: " + createSuccess + " " + size+ " " + "active: "+ userInfo['active']);

                  if (userInfo['active'] == 'Y'){
                    this.commonService.isLoading = false;
                    this.commonService.alertMessage("회원가입 완료, 로그인이 가능합니다.", true);
                  } else {
                    this.commonService.isLoading = false;
                    this.commonService.alertMessage("회원가입 완료, 운영자가 승인을 해야 로그인 할 수 있습니다.", true);
                  }
                  setTimeout(()=>{
                    this.commonService.isLoading = false;
                    this.router.navigate(['/']);
                    },2000)
                }else{
                  this.commonService.alertMessage('회원가입 실패, 다시 시도하세요.', false);
                  this.commonService.isLoading = false;
                  this.commonService.getInfra(data["key"]).subscribe(data =>{
                    this.commonService.setAuthorization(data["authorization"]);
                  });
                }
              }
            });
          }
          });
      }, error => {
        this.commonService.alertMessage('시스템 에러가 발생하였습니다. 다시 시도하세요. ', false);
      });
    }
  }
}
