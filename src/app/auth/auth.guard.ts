import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {CommonService} from "../common/common.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private common: CommonService, private router: Router) {

  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {



    if (this.common.getSessionTime() == null || JSON.parse(this.common.getSessionTime()) < new Date().getTime()) {
      this.common.signOut();
    } else {
      this.common.refreshSession();
    }

    if (this.common.getSeq() == null || this.common.getSeq() === '') {
      this.router.navigate(['/']);
    } else {
      return true;
    }

    if (this.common.getToken() != null) {
      return true;
    } else {
      this.common.signOut();
    }

    if (this.common.getApiUri() != null) {
      return true;
    } else {
      this.common.signOut();
    }


    this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
    return false;
  }
}
