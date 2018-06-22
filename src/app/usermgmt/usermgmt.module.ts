import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import {RoutingModule} from "../app.routing";
import {FormsModule} from "@angular/forms";
import {UsermgmtComponent} from "./usermgmt.component";
import {UsermgmtService} from "./usermgmt.service";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RoutingModule,
    SharedModule,    // included TranslateModule
  ],
  declarations: [UsermgmtComponent],
  providers:[UsermgmtService],
  exports: [SharedModule]
})
export class UsermgmtModule { }
