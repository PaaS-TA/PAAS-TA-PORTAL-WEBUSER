
import { CommonService } from '../common/common.service';
import { OrgURLConstant, OrgMappingKeyConstant } from './org.constant';
import { OrgService } from './org.service';
import { NgModule } from '@angular/core';
import { OrgInnerComponent } from './org-inner/org-inner.component';
@NgModule({
  declarations: [OrgInnerComponent],
  imports: [],
  providers: [CommonService, OrgService],
  bootstrap: [],
  exports: []
})
export class OrgModule {
}
