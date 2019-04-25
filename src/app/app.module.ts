import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {DomainComponent} from './domain/domain.component';
import {LogComponent} from './log/log.component';
import {MenuComponent} from './menu/menu.component';
import {ServiceComponent} from './service/service.component';
import {UsageComponent} from './usage/usage.component';
import {UserComponent} from './user/user.component';
import {CfAppComponent} from './cf-app/cf-app.component';
import {RoutingModule} from './app.routing';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TopComponent} from './layout/top/top.component';
import {BottonComponent} from './layout/botton/botton.component';
import {LeftComponent} from './layout/left/left.component';
import {FormsModule} from '@angular/forms';
import {SecurityService} from './auth/security.service';
import {CallbackComponent} from './callback/callback.component';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {LogoutComponent} from './logout/logout.component';
import {DashboardService} from './dashboard/dashboard.service';
import {JsonpModule} from '@angular/http';
import {ANIMATION_TYPES, LoadingModule} from 'ngx-loading';
import {CommonService} from './common/common.service';
import {DashModule} from './dash/dash.module';
import {AuthGuard} from './auth/auth.guard';
import {OrgModule} from './org/org.module';
import {CatalogModule} from "./catalog/catalog.module";
import {CatalogService} from "./catalog/main/catalog.service";
import {ErrorComponent} from './error/error.component';
import {IndexModule} from "./index/index.module";
import {ExternalModule} from "./external/external.module";
import {SharedModule} from './shared/shared.module';
import {UsermgmtModule} from "./usermgmt/usermgmt.module";
import {UsermgmtService} from "./usermgmt/usermgmt.service";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    CfAppComponent,
    DashboardComponent,
    DomainComponent,
    LogComponent,
    MenuComponent,
    ServiceComponent,
    UsageComponent,
    UserComponent,
    TopComponent,
    BottonComponent,
    LeftComponent,
    CallbackComponent,
    LogoutComponent,
    ErrorComponent,
  ],
  imports: [
    IndexModule,
    DashModule,
    OrgModule,
    CatalogModule,
    UsermgmtModule,
    FormsModule,
    RoutingModule,
    HttpClientModule,
    ExternalModule,
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.chasingDots,
      backdropBackgroundColour: 'rgba(0,0,0,0.3)',
      backdropBorderRadius: '14px',
      fullScreenBackdrop: true,
      primaryColour: '#bf8cff',
      secondaryColour: '#46adbc',
      tertiaryColour: '#6ce6ff'
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    SharedModule.forRoot(),
    LoggerModule.forRoot({
      //serverLoggingUrl: '/ps/logs',
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR
    }), JsonpModule
  ],
  providers: [
    AuthGuard,
    CommonService,
    SecurityService,
    DashboardService,
    UsermgmtService,
    CatalogService,
  ],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {
}
