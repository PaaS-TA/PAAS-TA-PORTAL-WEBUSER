import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingModule } from '../app.routing';
import { FormsModule } from '@angular/forms';

import { OrgMainComponent } from './org-main/org-main.component';
import { OrgInnerComponent } from './org-inner/org-inner.component';
import { OrgService } from './common/org.service';
import { OrgQuotaService } from './common/org-quota.service';
import { SpaceService } from '../space/space.service';
import { OrgMainNavComponent } from './org-main-nav/org-main-nav.component';
import { DomainService } from "../domain/domain.service";
import { OrgUserRoleService } from "./common/org-userrole.service";
import {DashModule} from "../dash/dash.module";

@NgModule({
  imports: [
    CommonModule,
    RoutingModule,
    FormsModule,
    DashModule,
  ],
  declarations: [
    OrgMainComponent,
    OrgInnerComponent,
    OrgMainNavComponent,
  ],
  providers: [
    OrgService,
    OrgQuotaService,
    SpaceService,
    DomainService,
    OrgUserRoleService,
  ],
  bootstrap: [],
  exports: [],
})
export class OrgModule { }
