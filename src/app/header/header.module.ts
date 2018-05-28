import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CommonHeaderComponent} from "./header.component";
import {CommonService} from "../common/common.service";
import {RoutingModule} from "../app.routing";

@NgModule({
  imports: [
    CommonModule,
    RoutingModule,
  ],
  declarations: [
    CommonHeaderComponent,
  ],
  providers: [],
  exports: [
    CommonHeaderComponent,
  ],
})
export class HeaderModule { }
