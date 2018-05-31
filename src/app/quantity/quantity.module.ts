import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuantityMainComponent } from './quantity-main/quantity-main.component';
import { QuantityNavComponent } from './quantity-nav/quantity-nav.component';
import {DashModule} from "../dash/dash.module";
import {QuantityMainService} from "./quantity-main/quantity-main.service";
import {RoutingModule} from "../app.routing";

@NgModule({
  imports: [
    CommonModule,
    RoutingModule,
    DashModule,
  ],
  declarations: [QuantityMainComponent, QuantityNavComponent],
  providers: [
    QuantityMainService,
  ]
})
export class QuantityModule { }
