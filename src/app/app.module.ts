import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {DomainComponent} from './domain/domain.component';
import {LogComponent} from './log/log.component';
import {MenuComponent} from './menu/menu.component';
import {ServiceComponent} from './service/service.component';
import {SpaceComponent} from './space/space.component';
import {UsageComponent} from './usage/usage.component';
import {UserComponent} from './user/user.component';
import {WebIdeUserComponent} from './web-ide-user/web-ide-user.component';
import {CfAppComponent} from './cf-app/cf-app.component';
import {IndexComponent} from './index/index.component';
import {RoutingModule} from './app.routing';
import {HttpClientModule} from '@angular/common/http';
import {TopComponent} from './layout/top/top.component';
import {NavComponent} from './layout/nav/nav.component';
import {BottonComponent} from './layout/botton/botton.component';
import {LeftComponent} from './layout/left/left.component';
import {FormsModule} from '@angular/forms';

import {UaaSecurityService} from './auth/uaa-security.service';
import {CallbackComponent} from './callback/callback.component';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {LogoutComponent} from './logout/logout.component';

import {DashboardService} from './dashboard/dashboard.service';
import {JsonpModule} from '@angular/http';
import {ANIMATION_TYPES, LoadingModule} from 'ngx-loading';
import {CommonService} from './common/common.service';

import {DashModule} from './dash/dash.module';
import {UsermgmtComponent} from './usermgmt/usermgmt.component';
import {UsermgmtService} from './usermgmt/usermgmt.service';
import {LoginComponent} from './login/login.component';
import {SpaceService} from './space/space.service';
import {LoginService} from './login/login.service';
import {AuthGuard} from './auth/auth.guard';
import { OrgModule } from './org/org.module';
import {CatalogModule} from "./catalog/catalog.module";

import {DashboardSpaceComponent} from './dashboard/dashboard-space/dashboard-space.component';
import {DashboardSapaceService} from './dashboard/dashboard-space/dashboard-sapace.service';

import {DashboardProduceComponent} from './dashboard/dashboard-produce/dashboard-produce.component';
import {DashboardProduceService} from './dashboard/dashboard-produce/dashboard-produce.service';
import {CatalogService} from "./catalog/main/catalog.service";

@NgModule({
  declarations: [
    AppComponent,
    CfAppComponent,
    DashboardComponent,
    DomainComponent,
    LogComponent,
    MenuComponent,
    ServiceComponent,
    SpaceComponent,
    UsageComponent,
    UserComponent,
    WebIdeUserComponent,
    IndexComponent,
    TopComponent,
    NavComponent,
    BottonComponent,
    LeftComponent,
    CallbackComponent,
    LogoutComponent,
    UsermgmtComponent,

    LoginComponent,
    DashboardSpaceComponent,
    DashboardProduceComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    FormsModule,
    RoutingModule,
    HttpClientModule,
    DashModule,
    OrgModule,
    CatalogModule,
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.chasingDots,
      backdropBackgroundColour: 'rgba(0,0,0,0.3)',
      backdropBorderRadius: '14px',
      fullScreenBackdrop: true,
      primaryColour: '#bf8cff',
      secondaryColour: '#46adbc',
      tertiaryColour: '#6ce6ff'
    }),
    LoggerModule.forRoot({
      serverLoggingUrl: '/ps/logs',
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR
    }), JsonpModule
  ],
  providers: [
    AuthGuard,
    CommonService,
    LoginService,
    UaaSecurityService,
    DashboardService,
    UsermgmtService,
    SpaceService,
    CatalogService,
    DashboardProduceService,
    DashboardSapaceService,
  ],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {
}
