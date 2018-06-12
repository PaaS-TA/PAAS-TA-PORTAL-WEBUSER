import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
// import { HttpClientModule, HttpClient} from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppMainComponent } from './app-main/app-main.component';
import { DashMainComponent } from './dash-main/dash-main.component';
import { AppTopComponent } from '../layout/app-top/app-top.component';
import { AppNavComponent } from '../layout/app-nav/app-nav.component';
import { RoutingModule } from '../app.routing';
import { AppMainService } from './app-main/app-main.service';
import { TailLogsComponent } from './tail-logs/tail-logs.component';
import { TailLogsService } from './tail-logs/tail-logs.service';
import { WebsocketService } from './tail-logs/websocket.service';

import { SharedModule } from '../shared/shared.module';

// export function createTranslateLoader(http: HttpClient) {
//   return new TranslateHttpLoader(http, '../../assets/i18n/', '.json');
// }

@NgModule({
  imports: [
    RoutingModule,
    FormsModule,
    SharedModule,
    CommonModule
  ],
  declarations: [
    AppMainComponent,
    DashMainComponent,
    AppNavComponent,
    TailLogsComponent
  ],
  providers: [AppMainService, TailLogsService, WebsocketService],
  exports: [ SharedModule]
})
export class DashModule { }
