import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-resetpasswd',
  templateUrl: './resetpasswd.component.html',
  styleUrls: ['./resetpasswd.component.css']
})
export class ResetpasswdComponent implements OnInit {

  public email: string;
  public isValidation: boolean;

  constructor() {
    this.email = '';
    this.isValidation = false;
  }

  ngOnInit() {
  }

  sendEmail() {

  }

  checkValidation() {
    var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
    if (regex.test(this.email) === false) {
      this.isValidation = true;
    } else {
      this.isValidation = false;
    }
  }

}
