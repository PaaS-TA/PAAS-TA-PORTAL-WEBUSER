import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {NGXLogger} from 'ngx-logger';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {CommonService} from '../common/common.service';
import {appendChild} from '@angular/core/src/render3/node_manipulation';
import {toBase64String} from '@angular/compiler/src/output/source_map';
import {UsermgmtService} from "../usermgmt/usermgmt.service";
import {LoginComponent} from "../login/login.component";
import {AuthConfig} from "../auth/authconfig"


@Injectable()
export class SecurityService {
  url: string;

  constructor(private common: CommonService, private http: HttpClient, private router: Router, private log: NGXLogger) {
  }

  /*
   * 로그인 시도 - > OAUTH 로그인용
   */
  doAuthorization() {
    this.log.debug('doAuthorization()');
    const params = {
      'response_type': 'code',
      'client_id': AuthConfig.clientId,
      'scope': AuthConfig.scope,
      'redirect_uri': AuthConfig.redirectUri
    };

    this.router.navigate(['/login']).then(result => {
      window.location.href = AuthConfig.authUrl +
        '?response_type=' + AuthConfig.code +
        '&client_id=' + AuthConfig.clientId +
        '&redirect_uri=' + AuthConfig.redirectUri +
        '&scope=' + AuthConfig.scope +
        '&state=';
    });

  }

  /*
   * 토큰 추출 - > OAUTH 로그인용
   */
  doToken() {
    this.log.debug('doToken()');
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded');

    let accessUrl = AuthConfig.accessUrl +
      '?response_type=token' +
      '&client_id=' + AuthConfig.clientId +
      '&client_secret=' + AuthConfig.clientSecret +
      '&redirect_uri=' + AuthConfig.redirectUri + '' +
      '&grant_type=authorization_code' +
      '&code=' + AuthConfig.code;

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
      .append('Authorization', 'Basic ' + btoa(AuthConfig.clientId + ':' + AuthConfig.clientSecret))
      .append('Content-Type', 'application/x-www-form-urlencoded');

    let checkUrl = AuthConfig.checkUrl + '?token=' + this.common.getToken();

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

    let checkUrl = AuthConfig.infoUrl;

    this.http.get(checkUrl, {
      headers: headers
    }).retryWhen(error => {
      return error.flatMap((error: any) => {
        return Observable.of(error.status).delay(1000);
      }).take(3).concat(Observable.throw({error: 'Sorry, there was an error (after 3 retries)'}));
    }).subscribe(data => {
      this.log.debug(data);
      this.common.saveCfUserInfo(data['user_id'], data['user_name'], data['name'], data['given_name'], data['family_name'],
        data['email'], data['phone_number'], data['exp'], data['previous_logon_time']);
      this.doUserInfoProvider(data['user_id']);
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

    let refreshUrl = AuthConfig.accessUrl +
      '?response_type=refresh_token' +
      '&client_id=' + AuthConfig.clientId +
      '&client_secret=' + AuthConfig.clientSecret +
      '&redirect_uri=' + AuthConfig.redirectUri +
      '&grant_type=refresh_token' +
      '&code=' + AuthConfig.code +
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
    return this.common.doGET(AuthConfig.userUrl + '/' + userId, this.common.getToken()).retryWhen(error => {
      return error.flatMap((error: any) => {
        return Observable.of(error.status).delay(1000);
      }).take(3).concat(Observable.throw({error: 'Sorry, there was an error (after 3 retries)'}));
    }).subscribe(data => {
      if (data['User'] != null) {
        this.common.isLoading = false;
        this.common.saveUserInfo(data['User']['userId'], data['User']['userName'], data['User']['status'], data['User']['tellPhone'], data['User']['zipCode'], data['User']['address'], data['User']['addressDetail'], data['User']['imgPath']);
        this.router.navigate(['dashboard']);
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
    let params = {userId: userId, userName: '', status: '1', adminYn: 'N', imgPath: ''};
    this.log.debug(AuthConfig.userUrl);
    this.common.doPost(AuthConfig.userUrl, params, this.common.getToken()).retryWhen(error => {
      return error.flatMap((error: any) => {
        return Observable.of(error.status).delay(1000);
      }).take(3).concat(Observable.throw({error: 'Sorry, there was an error (after 3 retries)'}));
    }).subscribe(data => {
      let result = data['result'];
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
      return data['result'];
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
      this.router.navigate(['error'], {queryParams: {error: '1'}});
    }
  }
}
