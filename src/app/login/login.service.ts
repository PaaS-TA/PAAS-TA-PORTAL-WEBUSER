import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {CommonService} from '../common/common.service';
import {UaaSecurityService} from '../auth/uaa-security.service';

@Injectable()
export class LoginService {

  constructor(private common: CommonService, private log: NGXLogger) {
  }


  test(username: string) {
    return this.common.doGET('/commonapi/user/getUser/' + username, '').map((res: Response) => {
      return res['User'];
    }).do(console.log);
  }

}

export class User {
  address: string;
  addressDetail: string;
  adminYn: boolean;
  authAccessCnt: string;
  authAccessTime: string;
  imgPath: string;
  refreshToken: string;
  status: string;
  tellPhone: string;
  userId: string;
  zipCode: string;
  userName: string;
}
