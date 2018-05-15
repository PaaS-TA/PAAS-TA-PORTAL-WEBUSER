import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { AppMainComponent } from './app-main/app-main.component';
import { DashMainComponent } from './dash-main/dash-main.component';
import { AppTopComponent } from '../layout/app-top/app-top.component';
import { AppNavComponent } from '../layout/app-nav/app-nav.component';
import { RoutingModule } from '../app.routing';
import { AppMainService } from './app-main/app-main.service';
import { TailLogsComponent } from './tail-logs/tail-logs.component';
import { TailLogsService } from './tail-logs/tail-logs.service';
import { WebsocketService } from './tail-logs/websocket.service';

@NgModule({
  imports: [
    RoutingModule,
    FormsModule,
    CommonModule
  ],
  declarations: [
    AppMainComponent,
    DashMainComponent,
    AppTopComponent,
    AppNavComponent,
    TailLogsComponent
  ],
  providers: [AppMainService, TailLogsService, WebsocketService],
})
export class DashModule { }
