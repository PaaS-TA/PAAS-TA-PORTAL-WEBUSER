import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {NGXLogger} from 'ngx-logger';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {CommonService} from '../common/common.service';

declare  var require : any;
let appConfig = require('assets/resources/env/config.json');
@Injectable()
export class SecurityService {
  url: string;

  constructor(private common: CommonService, private http: HttpClient, private router: Router, private activeRoute: ActivatedRoute, private log: NGXLogger) {
  }

  /*
   * 로그인 시도 - > OAUTH 로그인용
   */
  doLogout() {
    this.log.debug('doLogout()');
    this.common.signOut();
    window.location.href = appConfig['logoutUrl'] +
      '?redirect=' + window.location.origin + appConfig['logoutredirectUri'] + '&client_id=' + appConfig['clientId'] ;
  }


  /*
   * 로그인 시도 - > OAUTH 로그인용
   */
  doAuthorization() {
    this.log.debug('doAuthorization()');

    const returnUrl = this.activeRoute.snapshot.queryParams['returnUrl'] || 'dashboard';
    const params = {
      // 'response_type': 'code',
      'client_id': appConfig['clientId'],
      'scope': appConfig['scope'],
      'redirect_uri': window.location.origin + appConfig['redirectUri'] + ('%3FreturnUrl%3D' + returnUrl)
    };

    this.router.navigate(['/login']).then(result => {
      window.location.href = appConfig['authUrl'] +
        '?response_type=' + appConfig['code'] +
        '&client_id=' + appConfig['clientId'] +
        '&redirect_uri=' + window.location.origin + appConfig['redirectUri'] + ('%3FreturnUrl%3D' + returnUrl) +
        '&scope=' + appConfig['scope'];
      this.log.debug(appConfig['authUrl'] +
        '?response_type=' + appConfig['code'] +
        '&client_id=' + appConfig['clientId'] +
        '&redirect_uri=' + window.location.origin + appConfig['redirectUri'] + ('%3FreturnUrl%3D' + returnUrl) +
        '&scope=' + appConfig['scope']);
    });

  }


  /*
   * 토큰 추출 - > OAUTH 로그인용
   */
  doToken() {
    this.log.debug('doToken()');
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded');

    const returnUrl = this.activeRoute.snapshot.queryParams['returnUrl'] || 'dashboard';

    let accessUrl = appConfig['accessUrl'] +
      '?response_type=token' +
      '&client_id=' + appConfig['clientId'] +
      '&client_secret=' + appConfig['clientSecret'] +
      '&redirect_uri=' + window.location.origin + appConfig['redirectUri'] + ('%3FreturnUrl%3D' + returnUrl) +
      '&grant_type=authorization_code' +
      '&code=' + appConfig['code'];


    this.http.post(accessUrl, null, {
      headers: headers
    }).retryWhen(error => {
      return error.flatMap((error: any) => {
        return Observable.of(error.status).delay(1000);
      }).take(3).concat(Observable.throw({error: 'Sorry, there was an error (after 3 retries)'}));
    }).subscribe(data => {
      this.common.saveToken(data['token_type'], data['access_token'], data['refresh_token'], data['expires_in'], data['scope'], 'OAUTH');
      this.doCheckToken();
    }, error => {
      this.moveErrLogin();
    });
  }

  /*
   * 토큰 정상 여부 확인 - > OAUTH 로그인용
   */
  doCheckToken() {
    this.log.debug('doCheckToken()');
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic ' + btoa(appConfig['clientId'] + ':' + appConfig['clientSecret']))
      .append('Content-Type', 'application/x-www-form-urlencoded');

    let checkUrl = appConfig['checkUrl'] + '?token=' + this.common.getToken();

    this.http.post(checkUrl, null, {
      headers: headers
    }).retryWhen(error => {
      return error.flatMap((error: any) => {
        return Observable.of(error.status).delay(1000);
      }).take(3).concat(Observable.throw({error: 'Sorry, there was an error (after 3 retries)'}));
    }).subscribe(data => {
      this.common.saveCfUserInfo(data['user_id'], data['user_name'], data['name'], data['given_name'], data['family_name'],
        data['email'], data['phone_number'], data['exp'], data['previous_logon_time']);
      this.doUserInfo();
    }, error => {
      this.moveErrLogin();
    });
  }

  /*
   * CF에서 사용자 정보 추출 - > OAUTH 로그인용
   */
  doUserInfo() {
    this.log.debug('doUserInfo()');
    const headers = new HttpHeaders()
      .append('Authorization', 'Bearer ' + this.common.getToken())
      .append('Content-Type', 'application/x-www-form-urlencoded');

    let checkUrl = appConfig['infoUrl'];

    this.http.get(checkUrl, {
      headers: headers
    }).retryWhen(error => {
      return error.flatMap((error: any) => {
        return Observable.of(error.status).delay(1000);
      }).take(3).concat(Observable.throw({error: 'Sorry, there was an error (after 3 retries)'}));
    }).subscribe(data => {
      this.common.saveCfUserInfo(data['user_id'], data['user_name'], data['name'], data['given_name'], data['family_name'],
        data['email'], data['phone_number'], data['exp'], data['previous_logon_time']);
      this.doUserInfoProvider(data['user_name']);
    }, error => {
      this.moveErrLogin();
    });
  }

  /*
   * 토큰은 재생성 하는 과정 - > OAUTH 로그인용
   */
  doTokenRefresh() {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded');

    const returnUrl = this.activeRoute.snapshot.queryParams['returnUrl'] || 'dashboard';

    let refreshUrl = appConfig['accessUrl'] +
      '?response_type=refresh_token' +
      '&client_id=' + appConfig['clientId'] +
      '&client_secret=' + appConfig['clientSecret'] +
      '&redirect_uri=' + window.location.origin + appConfig['redirectUri'] + ('%3FreturnUrl%3D' + returnUrl) +
      '&grant_type=refresh_token' +
      '&code=' + appConfig['code'] +
      '&refresh_token=' + this.common.getRefreshToken();

    this.http.post(refreshUrl, null, {
      headers: headers
    }).retryWhen(error => {
      return error.flatMap((error: any) => {
        return Observable.of(error.status).delay(1000);
      }).take(3).concat(Observable.throw({error: 'Sorry, there was an error (after 3 retries)'}));
    }).subscribe(data => {
      this.common.saveToken(data['token_type'], data['access_token'], data['refresh_token'], data['expires_in'], data['scope'], 'OAUTH');
      this.doCheckToken();
    }, error => {
      this.moveErrLogin();
    });
  }

  /*
   * DB에서 사용자 정보를 추출 - 공통
   */
  doUserInfoProvider(userId: string) {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded');
    return this.common.doGet(appConfig['userinfoUrl'] + '/' + userId, this.common.getToken()).retryWhen(error => {
      return error.flatMap((error: any) => {
        return Observable.of(error.status).delay(1000);
      }).take(3).concat(Observable.throw({error: 'Sorry, there was an error (after 3 retries)'}));
    }).subscribe(data => {
      if (data['User'] != null) {
        this.common.isLoading = false;
        this.common.saveUserInfo(data['User']['userId'], data['User']['userName'], data['User']['status'], data['User']['tellPhone'],
          data['User']['zipCode'], data['User']['address'], data['User']['addressDetail'], data['User']['imgPath']);

        const nextUrl = this.activeRoute.snapshot.queryParams['returnUrl'] || 'dashboard';
        this.router.navigate([nextUrl]);
      } else {
        this.saveUserDB(userId);
      }
      return true;
    }, error => {
      this.moveErrLogin();
      return false;
    });
  }

  /*
   * 모든 로그인 방식의 제일 마지막 - 공통
   */
  saveUserDB(userId: string) {
    this.common.doGet('commonapi/v2/user/'+ userId + '/uaa',this.common.getToken()).subscribe(data => {
      let params = {userId: userId, userName: '', status: '1', adminYn: 'N', imgPath: '', active : (data['active'] === 't') ? 'Y':'N'};
      this.common.doPost(appConfig['userinfoUrl'], params, this.common.getToken()).retryWhen(error => {
        return error.flatMap((error: any) => {
          return Observable.of(error.status).delay(1000);
        }).take(3).concat(Observable.throw({error: 'Sorry, there was an error (after 3 retries)'}));
      }).subscribe(data2 => {
        let result = data2['result'];
        if (result != null) {
          if (result == 1) {
            this.doUserInfoProvider(userId);
          } else {
            this.moveErrLogin();
          }
        } else {
          this.moveErrLogin();
        }
        this.common.isLoading = false;
        return data2['result'];
      }, error => {
        this.moveErrLogin();
      });
    }, error => {
      this.moveErrLogin();
    });
  }

  moveErrLogin() {
    this.common.isLoading = false;
    if (this.common.getLoginType() === 'API') {
      this.router.navigate(['login'], {queryParams: {error: '1'}});
      window.location.reload();
    } else {
      this.router.navigate(['/login']);
    }
  }
}
