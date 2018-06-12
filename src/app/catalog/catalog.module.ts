import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CatalogService} from "./main/catalog.service";
import {CatalogNavComponent} from "./catalog-layout/catalog-nav/catalog-nav.component";
import {CatalogComponent} from "./main/catalog.component";
import {FormsModule} from "@angular/forms";
import {CatalogDetailComponent} from "./catalog-detail/catalog-detail.component";
import {RoutingModule} from "../app.routing";
import { CatalogDevelopmentComponent } from './catalog-development/catalog-development.component';
import { CatalogServiceComponent } from './catalog-service/catalog-service.component';
import {DashModule} from "../dash/dash.module";

import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RoutingModule,
    SharedModule,    // included TranslateModule
  ],
  declarations: [
    CatalogNavComponent,
    CatalogComponent,
    CatalogDetailComponent,
    CatalogDevelopmentComponent,
    CatalogServiceComponent,
  ],
  providers: [CatalogService],
  exports: [SharedModule]
})
export class CatalogModule { }
