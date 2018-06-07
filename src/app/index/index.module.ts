import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ResetpasswdComponent} from './resetpasswd/resetpasswd.component';
import {CreateuserComponent} from "./createuser/createuser.component";
import {RoutingModule} from "../app.routing";
import {LoginComponent} from "./login/login.component";
import {LoginService} from "./login/login.service";
import {IndexComponent} from "./index.component";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {IndexCommonService} from "./userAccountMgmt/index-common.service";
import {CommonService} from "../common/common.service";
import {DashModule} from "../dash/dash.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RoutingModule,
    HttpClientModule,
    DashModule,
  ],
  declarations: [
    IndexComponent,
    LoginComponent,
    CreateuserComponent,
    ResetpasswdComponent
  ],
  providers: [LoginService, CommonService, IndexCommonService]
})
export class IndexModule {
}
