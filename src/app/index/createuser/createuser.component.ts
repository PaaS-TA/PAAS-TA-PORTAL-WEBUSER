import {Component, DoCheck, OnInit} from '@angular/core';
import {CreateuserService} from "./createuser.service";
import {NGXLogger} from "ngx-logger";
import {Observable} from "rxjs/Observable";
import {CommonService} from "../../common/common.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.css']
})
export class CreateuserComponent implements OnInit, DoCheck {

  public email: string;
  public isValidation: boolean;
  public isUsed: boolean;
  public isSendEmail: boolean;

  constructor(public createuserService: CreateuserService, private commonService: CommonService, private router: Router, private log: NGXLogger) {
    this.email = '';
    this.isValidation = true;
    this.isUsed = false;
  }

  ngOnInit() {
  }

  ngDoCheck() {

    if (this.isSendEmail != this.createuserService.isSendEmail) {
      this.isSendEmail = this.createuserService.isSendEmail;
    }
    if (this.isUsed != this.createuserService.isUsed) {
      this.isUsed = this.createuserService.isUsed;
    }

    if (this.isSendEmail) {
      this.isSendEmail = false;
      alert("성공적으로 메일 발송");
      this.router.navigate(['/']);
    }
  }


  checkValidation() {
    this.isValidation = this.createuserService.checkValidation(this.email);
  }

  checkUser() {
    if (!this.isValidation) {
      this.createuserService.checkUsed(this.email);
    }
  }
}

