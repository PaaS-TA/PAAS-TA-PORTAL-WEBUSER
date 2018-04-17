import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMainComponent } from './app-main/app-main.component';
import { DashMainComponent } from './dash-main/dash-main.component';
import { AppTopComponent } from '../layout/app-top/app-top.component';
import { AppNavComponent } from '../layout/app-nav/app-nav.component';

import {AppMainService} from './app-main/app-main.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AppMainComponent,
    DashMainComponent,
    AppTopComponent,
    AppNavComponent
  ],
  providers: [AppMainService],
})
export class DashModule { }
