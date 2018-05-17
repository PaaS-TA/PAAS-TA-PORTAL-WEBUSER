import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {reject} from 'q';
import {logger} from 'codelyzer/util/logger';
import {NGXLogger} from 'ngx-logger';
import {Param} from "../login/login.component";
import {Router} from "@angular/router";
import {AppConfig} from "../app.config"


@Injectable()
export class CommonService {
  isLoading = false;
  isLoginBtn = false;
  isLogin = false;
  headers: HttpHeaders;
  private gateway = '';

  constructor(public http: HttpClient, public router: Router, public log: NGXLogger) {
    this.headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Basic YWRtaW46b3BlbnBhYXN0YQ==')
      .set('X-Broker-Api-Version', '2.4')
      .set('X-Requested-With', 'XMLHttpRequest');
  }

  doGetConfig() {
    this.http.get('http://localhost/proxy.config.json').map(this.extractData).subscribe();
  }

  extractData(res: Response) {
    let body = res.json();
    console.log(body);
    return body || {};
  }

  doGet(url: string, token: string) {
    if (token == null) {
      return this.http.get(this.gateway + url, {
        headers: this.headers
      });
    }
    return this.http.get(this.gateway + url, {
      headers: this.headers.set('cf-Authorization', token)
    });
  }


  doPost(url: string, body: any, token: string) {
    return this.http.post(this.gateway + url, body, {
      headers: this.headers.set('cf-Authorization', token)
    });
  }
  
  doCommonPost(url: string, body: any) {
    return this.http.post(this.gateway + url, body, {
      headers: this.headers
    });
  }

  doPut(url: string, body: any, token: string) {
    return this.http.put(this.gateway + url, body, {
      headers: this.headers.set('cf-Authorization', token)
    });
  }

  doDelete(url: string, params: any, token: string) {
    return this.http.delete(this.gateway + url, {
      params: params,
      headers: this.headers.set('cf-Authorization', token)
    });
  }

  doDeleteNoParams(url: string, token: string) {
    return this.http.delete(this.gateway + url, {
      headers: this.headers.set('cf-Authorization', token)
    });
  }

  signOut() {
    this.removeItems();
    window.sessionStorage.clear();
  }

  private removeItems() {
    window.sessionStorage.removeItem('cf_token_type');
    window.sessionStorage.removeItem('cf_token');
    window.sessionStorage.removeItem('cf_refresh_token');
    window.sessionStorage.removeItem('cf_scope');
    window.sessionStorage.removeItem('cf_user_guid');
    window.sessionStorage.removeItem('cf_user_id');
    window.sessionStorage.removeItem('cf_user_email');
    window.sessionStorage.removeItem('login_type');
    window.sessionStorage.removeItem('user_id');
    window.sessionStorage.removeItem('user_name');
    window.sessionStorage.removeItem('status');
    window.sessionStorage.removeItem('tell_phone');
    window.sessionStorage.removeItem('zip_code');
    window.sessionStorage.removeItem('address');
    window.sessionStorage.removeItem('admin_yn');
    window.sessionStorage.removeItem('img_path');
    window.sessionStorage.removeItem('expires_in');


  }

  public saveToken(token_type: any, token: any, refresh_token: any, expires_in: any, scope: any, login_type: any) {

    window.sessionStorage.setItem('cf_token_type', token_type);
    window.sessionStorage.setItem('cf_token', token);
    window.sessionStorage.setItem('cf_refresh_token', refresh_token);
    window.sessionStorage.setItem('cf_scope', scope);
    window.sessionStorage.setItem('login_type', login_type);
    window.sessionStorage.setItem('expires_in', expires_in);

    let token_time = new Date();
    /*
     * expires_in은 몇 초 후 만료를 뜻함
     * 그래서 분으로 바꾸고 분에서 2분 전에 토큰 리플레쉬 하게, -2 을 해줌
     */
    token_time.setMinutes(token_time.getMinutes() + (expires_in / 60 - 2));
    this.log.debug('Token Expire Time :' + token_time.getHours() + ":" + token_time.getMinutes() + ":" + token_time.getSeconds());
    window.sessionStorage.setItem('expire_date', token_time.getTime().toString());


    /*
     * Session Time
     */
    let sessionTime = new Date();
    sessionTime.setMinutes(sessionTime.getMinutes() + AppConfig.sessionTimeout);
    this.log.debug('Session Expire Time : ' + sessionTime.getHours() + ":" + sessionTime.getMinutes() + ":" + sessionTime.getSeconds());
    window.sessionStorage.setItem('sessionTimeout', sessionTime.getTime().toString());
  }

  public refreshSession(){
    /*
     * Session Time
     */
    let sessionTime = new Date();
    sessionTime.setMinutes(sessionTime.getMinutes() + AppConfig.sessionTimeout);
    this.log.debug('Session Expire Time : ' + sessionTime.getHours() + ":" + sessionTime.getMinutes() + ":" + sessionTime.getSeconds());
    window.sessionStorage.setItem('sessionTimeout', sessionTime.getTime().toString());
  }


  public saveCfUserInfo(cf_user_guid: string, cf_user_id: string, cf_user_name: string, cf_given_name: string, cf_family_name: string,
                        cf_user_email: string, cf_phone_number: string, cf_expires: string, cf_previous_logon_time: string) {
    let now = new Date();
    window.sessionStorage.setItem('cf_user_guid', cf_user_guid);
    window.sessionStorage.setItem('cf_user_id', cf_user_id);
    window.sessionStorage.setItem('cf_username', cf_user_name);
    window.sessionStorage.setItem('cf_given_name', cf_given_name);
    window.sessionStorage.setItem('cf_family_name', cf_family_name);
    window.sessionStorage.setItem('cf_user_email', cf_user_email);
    window.sessionStorage.setItem('cf_phone_number', cf_phone_number);
    window.sessionStorage.setItem('cf_previous_logon_time', cf_previous_logon_time);

  }

  public saveUserInfo(user_id: string, user_name: string, status: string, tell_phone: string, zip_code: string,
                      address: string, admin_yn: string, img_path: string) {

    window.sessionStorage.setItem('cf_user_id', user_id);
    window.sessionStorage.setItem('user_name', user_name);
    window.sessionStorage.setItem('status', status);
    window.sessionStorage.setItem('tell_phone', tell_phone);
    window.sessionStorage.setItem('zip_code', zip_code);
    window.sessionStorage.setItem('address', address);
    window.sessionStorage.setItem('admin_yn', admin_yn);
    window.sessionStorage.setItem('img_path', img_path);

  }

  public getSessionTime(): string {
    return sessionStorage.getItem('sessionTimeout');
  }

  public getUserGuid(): string {
    return sessionStorage.getItem('cf_user_guid');
  }

  public getUserid(): string {
    return sessionStorage.getItem('cf_user_id');
  }

  public getUserName(): string {
    return sessionStorage.getItem('user_name');
  }

  public getUserEmail(): string {
    return sessionStorage.getItem('cf_user_email');
  }

  public getTokenType(): string {
    return sessionStorage.getItem('cf_token_type');
  }

  public getToken(): string {
    const cf_expires = sessionStorage.getItem('expire_date');
    const cf_token = this.getTokenWithoutRefresh();

    let now = new Date();
    if (cf_token !== null && cf_expires <= now.getTime().toString()) {
      if (this.getLoginType() === 'API') {
        this.doTokenRefreshAPI();
      } else {
        this.doTokenRefreshOauth();
      }
    }

    return sessionStorage.getItem('cf_token');
  }

  private getTokenWithoutRefresh(): string {
    return sessionStorage.getItem('cf_token');
  }
  public getRefreshToken(): string {
    return sessionStorage.getItem('cf_refresh_token');
  }

  public getExpiresin(): string {
    return sessionStorage.getItem('expires_in');
  }

  public getScope(): string {
    return sessionStorage.getItem('cf_scope');
  }

  public getLoginType(): string {
    return sessionStorage.getItem('login_type');
  }


  private map: Param;


  setUrl(url: string) {

    if (url.indexOf('?') < 0) {
      return url;
    }
    let paramStr = url.split('?');
    return paramStr[0];
  }

  setParams(url: string) {
    this.map = {};
    if (url.indexOf('?') < 0) {
      return this.map;
    }
    let paramStr = url.split('?')
    if (paramStr.length > 0) {
      paramStr = paramStr[1].split('&');
      paramStr.forEach(value => {
        let data = value.split('=');
        if (data.length > 0) {
          this.map[data[0].toString()] = data[1];
        }
      });
    }
    return this.map;
  }


  /*
   * 토큰은 재생성 하는 과정 - > OAUTH 로그인용
   */
  doTokenRefreshOauth() {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded');

    let refreshUrl = AppConfig.accessUrl +
      '?response_type=refresh_token' +
      '&client_id=' + AppConfig.clientId +
      '&client_secret=' + AppConfig.clientSecret +
      '&redirect_uri=' + AppConfig.redirectUri +
      '&grant_type=refresh_token' +
      '&code=' + AppConfig.code +
      '&refresh_token=' + this.getRefreshToken();

    return this.http.post(refreshUrl, null, {
      headers: headers
    }).retryWhen(error => {
      return error.flatMap((error: any) => {
        return Observable.of(error.status).delay(1000);
      }).take(3).concat(Observable.throw({error: 'Sorry, there was an error (after 3 retries)'}));
    }).subscribe(data => {
      this.saveToken(data['token_type'], data['access_token'], data['refresh_token'], data['expires_in'], data['scope'], 'OAUTH');
      return true;
    }, error => {
      this.removeItems();
      return false;
    });
  }


  /*
   * 토큰은 재생성 하는 과정 - > OAUTH 로그인용
   */
  doTokenRefreshAPI() {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded');

    let param = {'token': sessionStorage.getItem('cf_token'), 'refresh_token': this.getRefreshToken()};
    return this.doPost('/portalapi/token/refresh', param, sessionStorage.getItem('cf_token')).retryWhen(error => {
      return error.flatMap((error: any) => {
        return Observable.of(error.status).delay(1000);
      }).take(3).concat(Observable.throw({error: 'Sorry, there was an error (after 3 retries)'}));
    }).subscribe(data => {
      this.saveToken(data['token_type'], data['access_token'], data['refresh_token'], data['expires_in'], data['scope'], 'API');
      return true;
    }, error => {
      this.removeItems();
      return false;
    });
  }

}
