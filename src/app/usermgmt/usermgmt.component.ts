import {Component, OnInit} from '@angular/core';
import {CommonService} from '../common/common.service';
import {User, UsermgmtService} from './usermgmt.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {NGXLogger} from 'ngx-logger';
import {Organization} from '../model/organization';
import {OrgService} from '../org/common/org.service';
import {FormControl} from '@angular/forms';
import {viewWrappedDebugError} from '@angular/core/src/view/errors';
import {validate} from 'codelyzer/walkerFactory/walkerFn';
import {isNumber} from "util";

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
  public isTellPhone: boolean;
  public password_new: string = '';
  public password_confirm: string = '';
  public selectedOrgGuid: string = '';
  public selectedOrgName: string = '';

  constructor(private httpClient: HttpClient, private common: CommonService,
              private userMgmtService: UsermgmtService,
              private orgService: OrgService,
              private logger: NGXLogger) {

    this.userInfo();
    this.user = new Observable<User>();
    this.orgs = orgService.getOrgList();
    this.token = '';
    this.orgName = '';
  }


  userInfo() {
    this.userMgmtService.userinfo(this.common.getUserid()).subscribe(data => {
      this.user = data;
      this.tellPhone = data['tellPhone'];
      return data;
    });
  }

  userSave() {
    let params = {
      userName: this.user['userName'],
      tellPhone: this.user['tellPhone'],
      zipCode: this.user['zipCode'],
      address: this.user['address']
    };
    this.userMgmtService.userSave(this.common.getUserid(), params).subscribe(data => {
      if (data == 1) {
        console.log('success');
      } else {
        console.log('User does not exist');
      }
      console.log(data);
      return data;
    });
  }

  updateUserPassword() {
    let params = {
      oldPassword: this.password,
      password: this.password_new
    };
    this.userMgmtService.updateUserPassword(this.common.getUserid(), params).subscribe(data => {
      console.log(this.common.getUserGuid());
      alert("비밀번호 변경이 완료되었습니다.");
    });
  }

  checkTellPhone(event: any) {
    if (this.isNumber(this.tellPhone)) {
      this.isTellPhone = true;
    } else {
      this.isTellPhone = false;
    }
  }

  isNumber(data) {
    if (isNaN(data)) {
      return false;
    } else {
      return true;
    }
  }


  public alertMsg(msg: string) {
    alert(msg);
  }

  popclickOrg(guid: string, name: string) {
    this.selectedOrgGuid = guid;
    this.selectedOrgName = name;
    console.log("::GUID::" + guid + "::NAME" + name);
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

  cancelOrg(orgId: string) {
    return this.orgService.cancelOrg(orgId, this.common.getUserGuid());
  }

}//
