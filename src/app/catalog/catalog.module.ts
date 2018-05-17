import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CatalogService} from "./main/catalog.service";
import {CatalogHeaderComponent} from "./catalog-layout/catalog-header/catalog-header.component";
import {CatalogNavComponent} from "./catalog-layout/catalog-nav/catalog-nav.component";
import {CatalogComponent} from "./main/catalog.component";
import {FormsModule} from "@angular/forms";
import {CatalogDetailComponent} from "./catalog-detail/catalog-detail.component";
import {RoutingModule} from "../app.routing";
import { CatalogDevelopmentComponent } from './catalog-development/catalog-development.component';
import { CatalogServiceComponent } from './catalog-service/catalog-service.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RoutingModule,
  ],
  declarations: [
    CatalogHeaderComponent,
    CatalogNavComponent,
    CatalogComponent,
    CatalogDetailComponent,
    CatalogDevelopmentComponent,
    CatalogServiceComponent,
  ],
  providers: [CatalogService],
})
export class CatalogModule { }
