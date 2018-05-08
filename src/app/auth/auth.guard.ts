import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
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

    if (this.common.getToken() != null) {
      return true;
    }

    this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
    return false;
  }
}
