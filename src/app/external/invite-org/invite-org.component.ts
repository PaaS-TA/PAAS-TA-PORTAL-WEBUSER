import {AfterContentChecked, AfterViewChecked, AfterViewInit, Component, DoCheck, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {CommonService} from "../../common/common.service";
import {NGXLogger} from "ngx-logger";
import {Observable} from "rxjs/Observable";
import {OrgMainService} from "../../org/org-main/org-main.service";


declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-invite-org',
  templateUrl: './invite-org.component.html',
  styleUrls: ['./invite-org.component.css']
})
export class InviteOrgComponent implements OnInit, AfterViewChecked {
  private waitTime: number = 5 * 1000;
  private timestamp: number;

  private _userId: string;
  private _orgName: string;
  private refreshToken: string;
  private seq : string;

  constructor(private common: CommonService, private orgService: OrgMainService, private router: Router, private logger: NGXLogger) {
  }

  ngOnInit() {

    // last
    if (this.common.isLoading === false) {
      this.common.isLoading = true;
    }

    //const params = location.search.split(/[?&]/);
    const parser = new URLSearchParams(location.search.replace(/[?]/, ''));
    this.userId = parser.get('userId');
    this.orgName = parser.get('orgName');
    this.refreshToken = parser.get('refreshToken');
    this.seq = parser.get('seq');
    // remove parameters
    //location.hash = '';
    //location.search = '';
    this.userInviteAccept();

    // window.setTimeout(() => {
    //   this.common.isLoading = false;
    //
    //   this.timestamp = new Date().getTime();
    //   this.logger.debug('first false action!');
    // }, 10000);
  }

  userInviteAccept() {
    let params = {
      token: this.refreshToken
    };

    this.common.getInfra(this.seq).subscribe(infra => {
      this.orgService.userInviteAcceptSend(infra['apiUri'], infra['authorization'], params).subscribe(data => {

        if(!data){
          this.common.isLoading = false;
          this.router.navigate(['error']);
        } else {
          $("#html1").show();
          $("#html2").show();

          if(data != null) {
            $("[id^='layerpop']").modal("hide");
            this.common.isLoading = false;
          }

          setTimeout(() => {
            const current = new Date().getTime();
            this.logger.debug('auto-navigate organization... ');
            this.logger.debug('userId : ', this.userId, ' / orgName : ', this.orgName, ' / refreshToken : ', this.refreshToken, ' / seq : ', this.common.getSeq());
            this.logger.debug('start : ', this.timestamp, 'want to wait time : ', this.waitTime, 'real wait time : ', (current - this.timestamp), 'ms');
            this.router.navigate(['/']);
          }, this.waitTime);
        }
      });

    });

  }


  ngAfterViewChecked() {
    /*

    */
    this.logger.debug('checked test');
    /*
    if (this.common.isLoading === false) {

    }
    */
    if (this.common.isLoading === false) {
      setTimeout(() => {
        const current = new Date().getTime();
        this.logger.debug('auto-navigate organization... ');
        this.logger.debug('userId : ', this.userId, ' / orgName : ', this.orgName, ' / refreshToken : ', this.refreshToken);
        this.logger.debug('start : ', this.timestamp, 'want to wait time : ', this.waitTime, 'real wait time : ', (current - this.timestamp), 'ms');
        this.router.navigate(['/']);
      }, this.waitTime);
    }
  }

  get userId() { return this._userId; }
  set userId(param) { this._userId = param; }

  get orgName() { return this._orgName; }
  set orgName(param) { this._orgName = param; }
}
