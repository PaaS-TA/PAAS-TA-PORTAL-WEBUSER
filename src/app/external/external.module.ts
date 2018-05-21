import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreateComponent} from './create/create.component';
import {FormsModule} from "@angular/forms";
import {RoutingModule} from "../app.routing";
import {HttpClientModule} from "@angular/common/http";
import {ResetComponent} from './reset/reset.component';
import {ExternalcommonService} from "./common/externalcommon.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RoutingModule,
    HttpClientModule,
  ],
  declarations: [CreateComponent, ResetComponent],
  providers: [
    ExternalcommonService
  ]
})
export class ExternalModule {
}
