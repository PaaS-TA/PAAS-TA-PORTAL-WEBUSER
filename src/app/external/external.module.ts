import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreateComponent} from './create/create.component';
import {FormsModule} from "@angular/forms";
import {RoutingModule} from "../app.routing";
import {HttpClientModule} from "@angular/common/http";
import {ResetComponent} from './reset/reset.component';
import {ExternalcommonService} from "./common/externalcommon.service";
import { InviteOrgComponent } from './invite-org/invite-org.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RoutingModule,
    HttpClientModule,
  ],
  declarations: [CreateComponent, ResetComponent, InviteOrgComponent],
  providers: [
    ExternalcommonService
  ]
})
export class ExternalModule {
}
