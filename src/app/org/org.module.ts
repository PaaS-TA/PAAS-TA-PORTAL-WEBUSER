import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgMainComponent } from './org-main/org-main.component';
import {FormsModule} from "@angular/forms";
import { OrgProduceComponent } from './org-produce/org-produce.component';
import { OrgMainService } from './org-main/org-main.service';
import { OrgProduceService } from './org-produce/org-produce.service';
import { SharedModule } from '../shared/shared.module';
import {RouterModule} from "@angular/router";
import { OrgTempComponent } from './org-temp/org-temp.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule
  ],
  declarations: [OrgMainComponent, OrgProduceComponent, OrgTempComponent],
  entryComponents: [OrgTempComponent],
  providers: [OrgMainService, OrgProduceService],
  exports: [SharedModule]
})
export class OrgModule { }
