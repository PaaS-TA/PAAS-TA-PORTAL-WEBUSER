import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { TranslateModule } from '@ngx-translate/core';
import { AppTopComponent } from '../layout/app-top/app-top.component';
import { NavComponent } from '../layout/nav/nav.component';
import { RoutingModule } from "../app.routing";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    RoutingModule
  ],
  declarations: [
    AppTopComponent,
    NavComponent
  ],
  exports: [
    CommonModule,
    TranslateModule,
    AppTopComponent,
    NavComponent
  ]
})
export class SharedModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
      ]
    };
  }
}
