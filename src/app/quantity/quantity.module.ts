import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuantityMainComponent } from './quantity-main/quantity-main.component';
import {DashModule} from "../dash/dash.module";
import {QuantityMainService} from "./quantity-main/quantity-main.service";
import {RoutingModule} from "../app.routing";
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RoutingModule,
    DashModule,
    SharedModule
  ],
  declarations: [QuantityMainComponent],
  providers: [
    QuantityMainService,
  ],
  exports: [SharedModule]
})
export class QuantityModule { }
