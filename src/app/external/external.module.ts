import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreateComponent} from './create/create.component';
import {ExpiredComponent} from './expired/expired.component';
import {FormsModule} from "@angular/forms";
import {RoutingModule} from "../app.routing";
import {HttpClientModule} from "@angular/common/http";
import {CreateService} from "./create/create.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RoutingModule,
    HttpClientModule,
  ],
  declarations: [CreateComponent, ExpiredComponent],
  providers: [
    CreateService
  ]
})
export class ExternalModule {
}
