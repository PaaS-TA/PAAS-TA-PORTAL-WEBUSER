import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CommonService} from "../common/common.service";


@Injectable()
export class UsermamtService {
  constructor(private http: HttpClient, private common: CommonService) {}

  userinfo(username: string) {
    return this.common.doGET('/commonapi/user/getUser/' + username, '').map((res: Response) => {
      return res['User'];
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
