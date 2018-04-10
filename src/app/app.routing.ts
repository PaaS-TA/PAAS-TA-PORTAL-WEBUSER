import {IndexComponent} from './index/index.component';
import {LoginComponent} from './login/login.component';
import {RouterModule, Routes} from '@angular/router';
import {CfAppComponent} from './cf-app/cf-app.component';
import {CatalogComponent} from './catalog/catalog.component';
import {DomainComponent} from './domain/domain.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {WebIdeUserComponent} from './web-ide-user/web-ide-user.component';
import {UserComponent} from './user/user.component';
import {UsageComponent} from './usage/usage.component';
import {SpaceComponent} from './space/space.component';
import {ServiceComponent} from './service/service.component';
import {OrgComponent} from './org/org.component';
import {MenuComponent} from './menu/menu.component';
import {LogComponent} from './log/log.component';
import {ModuleWithProviders} from '@angular/core';
import {CallbackComponent} from './callback/callback.component';
import {LogoutComponent} from './logout/logout.component';

/*
* Route 모듈 설정
*/

const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'login', component: LoginComponent},
  {path: 'app', component: CfAppComponent},
  {path: 'catalog', component: CatalogComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'domain', component: DomainComponent},
  {path: 'log', component: LogComponent},
  {path: 'menu', component: MenuComponent},
  {path: 'org', component: OrgComponent},
  {path: 'service', component: ServiceComponent},
  {path: 'space', component: SpaceComponent},
  {path: 'usage', component: UsageComponent},
  {path: 'user', component: UserComponent},
  {path: 'webideuser', component: WebIdeUserComponent},
  {path: 'callback', component: CallbackComponent},
  {path: 'logout', component: LogoutComponent}

];

export const RoutingModule: ModuleWithProviders = RouterModule.forRoot(routes);



