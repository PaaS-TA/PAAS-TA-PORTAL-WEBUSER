import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CommonService} from "../common/common.service";

import {Observable} from "rxjs/Observable";


@Injectable()
export class UsermamtService {
  constructor(private http: HttpClient, private common: CommonService) {}

  userinfo(username: string) {
    return this.common.doGET('/commonapi/user/getUser/' + username, '').map((res: Response) => {
      return res['User'];
    });
  }

  usersave(userId: string, param) {
    return this.common.doPut('/commonapi/user/updateUser/' + userId, param ,'').map((res: Response) => {
      return res['result'];
    });
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
