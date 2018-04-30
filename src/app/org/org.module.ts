import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingModule } from '../app.routing';
import { FormsModule } from '@angular/forms';
import { ANIMATION_TYPES, LoadingModule } from 'ngx-loading';

import { OrgMainComponent } from './org-main/org-main.component';
import { OrgInnerComponent } from './org-inner/org-inner.component';
import { OrgService } from './common/org.service';
import { OrgQuotaService } from './common/org-quota.service';
import { SpaceService } from '../space/space.service';

@NgModule({
  imports: [
    CommonModule,
    RoutingModule,
    FormsModule,
  ],
  declarations: [
    OrgMainComponent,
    OrgInnerComponent,
  ],
  providers: [
    OrgService,
    OrgQuotaService,
    SpaceService,
  ],
  bootstrap: [],
  exports: [],
})
export class OrgModule { }
