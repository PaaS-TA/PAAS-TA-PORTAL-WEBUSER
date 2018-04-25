import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {NGXLogger} from 'ngx-logger';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {CommonService} from '../common/common.service';
import {appendChild} from '@angular/core/src/render3/node_manipulation';
import {toBase64String} from '@angular/compiler/src/output/source_map';

export const authConfig = {
  clientId: 'localportalclient',
  clientSecret: 'clientsecret',
  redirectUri: window.location.origin + '/callback',
  scope: 'openid cloud_controller_service_permissions.read cloud_controller.read cloud_controller.write',
  authUrl: 'https://uaa.115.68.46.187.xip.io/oauth/authorize',
  checkUrl: 'https://uaa.115.68.46.187.xip.io/check_token',
  accessUrl: 'https://uaa.115.68.46.187.xip.io/oauth/token',
  infoUrl: 'https://uaa.115.68.46.187.xip.io/userinfo',
  logoutUrl: 'https://uaa.115.68.46.187.xip.io/logout',
  code: ''
};


@Injectable()
export class UaaSecurityService {
  url: string;

  constructor(private commonService: CommonService, private http: HttpClient, private router: Router, private log: NGXLogger) {
  }

  doAuthorization() {
    const params = {
      'response_type': 'code',
      'client_id': authConfig.clientId,
      'scope': authConfig.scope,
      'redirect_uri': authConfig.redirectUri
    };

    this.router.navigate(['/login']).then(result => {
      window.location.href = authConfig.authUrl +
        '?response_type=' + authConfig.code +
        '&client_id=' + authConfig.clientId +
        '&redirect_uri=' + authConfig.redirectUri +
        '&scope=' + authConfig.scope +
        '&state=';
    });

  }


  doToken() {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded');

    let accessUrl = authConfig.accessUrl +
      '?response_type=token' +
      '&client_id=' + authConfig.clientId +
      '&client_secret=' + authConfig.clientSecret +
      '&redirect_uri=' + authConfig.redirectUri + '' +
      '&grant_type=authorization_code' +
      '&code=' + authConfig.code;

    this.http.post(accessUrl, null, {
      headers: headers
    }).retryWhen(error => {
      return error.flatMap((error: any) => {
        this.log.debug('Error :: ' + error.status);
        return Observable.of(error.status).delay(1000);
      }).take(3).concat(Observable.throw({error: 'Sorry, there was an error (after 3 retries)'}));
    }).subscribe(data => {
      this.commonService.saveToken(data['token_type'], data['access_token'], data['refresh_token'], data['expires_in'], data['scope']);
      this.doCheckToken();
    });
  }


  doCheckToken() {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic ' + btoa(authConfig.clientId + ':' + authConfig.clientSecret))
      .append('Content-Type', 'application/x-www-form-urlencoded');

    let checkUrl = authConfig.checkUrl + '?token=' + this.commonService.getToken();

    this.http.post(checkUrl, null, {
      headers: headers
    }).retryWhen(error => {
      return error.flatMap((error: any) => {
        this.log.debug('Error :: ' + error.status);
        return Observable.of(error.status).delay(1000);
      }).take(3).concat(Observable.throw({error: 'Sorry, there was an error (after 3 retries)'}));
    }).subscribe(data => {

      this.commonService.saveUserInfo(data['user_id'], data['user_name'], data['email'], data['exp']);
      this.router.navigate(['dashboard']);
    });
  }

  doTokenRefresh() {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded');

    let refreshUrl = authConfig.accessUrl +
      '?response_type=refresh_token' +
      '&client_id=' + authConfig.clientId +
      '&client_secret=' + authConfig.clientSecret +
      '&redirect_uri=' + authConfig.redirectUri +
      '&grant_type=refresh_token' +
      '&code=' + authConfig.code +
      '&refresh_token=' + this.commonService.getRefreshToken();

    this.http.post(refreshUrl, null, {
      headers: headers
    }).retryWhen(error => {
      return error.flatMap((error: any) => {
        this.log.debug('Error :: ' + error.status);
        return Observable.of(error.status).delay(1000);
      }).take(3).concat(Observable.throw({error: 'Sorry, there was an error (after 3 retries)'}));
    }).subscribe(data => {
      this.commonService.saveToken(data['token_type'], data['access_token'], data['refresh_token'], data['expires_in'], data['scope']);
      this.doCheckToken();
    });
  }

}
