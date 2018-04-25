import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {reject} from 'q';
import {logger} from 'codelyzer/util/logger';
import {NGXLogger} from 'ngx-logger';
import {UaaSecurityService} from '../auth/uaa-security.service';


const COOKIE_NAMES = {
  'cf_user_guid': 'cf_user_guid',
  'cf_user_id': 'cf_user_id',
  'cf_user_email': 'cf_user_email',
  'cf_token_type': 'cf_token_type',
  'cf_token': 'cf_token',
  'cf_refresh_token': 'cf_refresh_token',
  'cf_expires': 'cf_expires',
  'cf_scope': 'cf_scope'
};


@Injectable()
export class CommonService {
  isLoginBtn = false;
  isLogin = false;
  headers: HttpHeaders;
  private gateway = '';

  constructor(private http: HttpClient, private log: NGXLogger) {
    this.headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Basic YWRtaW46b3BlbnBhYXN0YQ==')
      .set('X-Broker-Api-Version', '2.4')
      .set('X-Requested-With', 'XMLHttpRequest');



  }

  doGetConfig(){
    this.http.get('http://localhost/proxy.config.json').map(this.extractData).subscribe();
  }

  extractData(res: Response) {
    let body = res.json();
    console.log(body);
    return body || {};
  }

  doGET(url, token: string) {
    if(token == null) {
      return this.http.get(this.gateway + url, {
        headers: this.headers});
    }return this.http.get(this.gateway + url, {
      headers: this.headers.set('cf-Authorization', token)
    });
  }


  doPost(url: string, body: any, token: string) {
    return this.http.post(this.gateway + url, body, {
      headers: this.headers.set('cf-Authorization', token)
    });
  }

  doPut(url: string, body: any, token: string) {
    return this.http.put(this.gateway + url, body, {
      headers: this.headers.set('cf-Authorization', token)
    });
  }

  doDelete(url: string, body: any, token: string) {
    return this.http.delete(this.gateway + url, {
      headers: this.headers.set('cf-Authorization', token)
    });
  }


  signOut() {
    this.removeItems();
    window.sessionStorage.clear();
  }

  private removeItems() {
    window.sessionStorage.removeItem(COOKIE_NAMES['cf_token_type']);
    window.sessionStorage.removeItem(COOKIE_NAMES['cf_token']);
    window.sessionStorage.removeItem(COOKIE_NAMES['cf_refresh_token']);
    window.sessionStorage.removeItem(COOKIE_NAMES['cf_expires_in']);
    window.sessionStorage.removeItem(COOKIE_NAMES['cf_scope']);
    window.sessionStorage.removeItem(COOKIE_NAMES['cf_user_guid']);
    window.sessionStorage.removeItem(COOKIE_NAMES['cf_user_id']);
    window.sessionStorage.removeItem(COOKIE_NAMES['cf_user_email']);
  }

  public saveToken(token_type: string, token: string, refresh_token: string, expires_in: string, scope: string) {
    window.sessionStorage.setItem(COOKIE_NAMES['cf_token_type'], token_type);
    window.sessionStorage.setItem(COOKIE_NAMES['cf_token'], token);
    window.sessionStorage.setItem(COOKIE_NAMES['cf_refresh_token'], refresh_token);
    window.sessionStorage.setItem(COOKIE_NAMES['cf_scope'], scope);
  }


  public saveUserInfo(cf_user_guid: string, cf_user_id: string, cf_user_email: string, cf_expires: string) {
    window.sessionStorage.setItem(COOKIE_NAMES['cf_user_guid'], cf_user_guid);
    window.sessionStorage.setItem(COOKIE_NAMES['cf_user_id'], cf_user_id);
    window.sessionStorage.setItem(COOKIE_NAMES['cf_user_email'], cf_user_email);
    window.sessionStorage.setItem(COOKIE_NAMES['cf_expires'], cf_expires);
  }


  public getUserGuid(): string {
    return sessionStorage.getItem(COOKIE_NAMES['cf_user_guid']);
  }

  public getUserid(): string {
    return sessionStorage.getItem(COOKIE_NAMES['cf_user_id']);
  }

  public getUserEmail(): string {
    return sessionStorage.getItem(COOKIE_NAMES['cf_user_email']);
  }

  public getTokenType(): string {
    return sessionStorage.getItem(COOKIE_NAMES['cf_token_type']);
  }

  public getToken(): string {
    let cf_expires = sessionStorage.getItem(COOKIE_NAMES['cf_expires']);
    let now = new Date();
    // if (cf_expires < now.getTime()) {
    // this.uaa.doTokenRefresh();
    // }
    return sessionStorage.getItem(COOKIE_NAMES['cf_token']);
  }

  public getRefreshToken(): string {
    return sessionStorage.getItem(COOKIE_NAMES['cf_refresh_token']);
  }

  public getExpiresin(): string {
    return sessionStorage.getItem(COOKIE_NAMES['cf_expires_in']);
  }

  public getScope(): string {
    return sessionStorage.getItem(COOKIE_NAMES['cf_scope']);
  }

}
