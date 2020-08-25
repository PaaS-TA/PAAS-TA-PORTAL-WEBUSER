import {IndexComponent} from './index/index.component';
import {RouterModule, Routes} from '@angular/router';
import {CfAppComponent} from './cf-app/cf-app.component';
import {CatalogComponent} from './catalog/main/catalog.component';
import {DomainComponent} from './domain/domain.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {UserComponent} from './user/user.component';
import {UsageComponent} from './usage/usage.component';
import {ServiceComponent} from './service/service.component';
import {OrgMainComponent} from './org/org-main/org-main.component';
import {MenuComponent} from './menu/menu.component';
import {LogComponent} from './log/log.component';
import {ModuleWithProviders} from '@angular/core';
import {CallbackComponent} from './callback/callback.component';
import {LogoutComponent} from './logout/logout.component';
import {DashMainComponent} from './dash/dash-main/dash-main.component';
import {AppMainComponent} from './dash/app-main/app-main.component';
import {TailLogsComponent} from './dash/tail-logs/tail-logs.component';
import {UsermgmtComponent} from './usermgmt/usermgmt.component';
import {LoginComponent} from './index/login/login.component';
import {AuthGuard} from './auth/auth.guard';
import {CatalogDetailComponent} from "./catalog/catalog-detail/catalog-detail.component";
import {ErrorComponent} from "./error/error.component";
import {CreateuserComponent} from "./index/createuser/createuser.component";
import {ResetpasswdComponent} from "./index/resetpasswd/resetpasswd.component";
import {CatalogDevelopmentComponent} from "./catalog/catalog-development/catalog-development.component";
import {CatalogServiceComponent} from "./catalog/catalog-service/catalog-service.component";
import {CreateComponent} from "./external/create/create.component";
import {ResetComponent} from "./external/reset/reset.component";
import {InviteOrgComponent} from "./external/invite-org/invite-org.component";
import {QuantityMainComponent} from "./quantity/quantity-main/quantity-main.component";
import {OrgProduceComponent} from "./org/org-produce/org-produce.component";

/*
* Route 모듈 설정
*/

const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'login', component: LoginComponent},
  {path: 'callback', component: CallbackComponent},
  {path: 'app', component: CfAppComponent, canActivate: [AuthGuard]},
  {path: 'catalog', component: CatalogComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'domain', component: DomainComponent, canActivate: [AuthGuard]},
  {path: 'log', component: LogComponent, canActivate: [AuthGuard]},
  {path: 'menu', component: MenuComponent, canActivate: [AuthGuard]},
  {path: 'org', component: OrgMainComponent, canActivate: [AuthGuard]},
  {path: 'orgproduce', component: OrgProduceComponent, canActivate: [AuthGuard]},
  {path: 'service', component: ServiceComponent, canActivate: [AuthGuard]},
  {path: 'usage', component: UsageComponent, canActivate: [AuthGuard]},
  {path: 'user', component: UserComponent, canActivate: [AuthGuard]},
  {path: 'usermgmt', component: UsermgmtComponent, canActivate: [AuthGuard]},
  {path: 'catalogdetail', component: CatalogDetailComponent, canActivate: [AuthGuard]},
  {path: 'catalogdevelopment', component: CatalogDevelopmentComponent, canActivate: [AuthGuard]},
  {path: 'catalogservice', component: CatalogServiceComponent, canActivate: [AuthGuard]},
  {path: 'logout', component: LogoutComponent},
  {path: 'dashMain', component: DashMainComponent, canActivate: [AuthGuard]},
  {path: 'appMain', component: AppMainComponent, canActivate: [AuthGuard]},
  {path: 'tailLogs', component: TailLogsComponent, canActivate: [AuthGuard]},
  {path: 'quantity', component: QuantityMainComponent, canActivate: [AuthGuard]},
  {path: 'createuser', component: CreateuserComponent},
  {path: 'resetpasswd', component: ResetpasswdComponent},
  {path: 'authcreate', component: CreateComponent},
  {path: 'authreset', component: ResetComponent},
  {path: 'inviteorg', component: InviteOrgComponent},
  {path: 'error', component: ErrorComponent},
  {path: '**', component: ErrorComponent }
];

export const RoutingModule: ModuleWithProviders = RouterModule.forRoot(routes);



