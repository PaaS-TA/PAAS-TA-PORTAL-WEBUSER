import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Org2MainComponent } from './org2-main/org2-main.component';
import {FormsModule} from "@angular/forms";
import { Org2ProduceComponent } from './org2-produce/org2-produce.component';
import { Org2MainService } from './org2-main/org2-main.service';
import { Org2ProduceService } from './org2-produce/org2-produce.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  declarations: [Org2MainComponent, Org2ProduceComponent],
  providers: [Org2MainService, Org2ProduceService],
  exports: [SharedModule]
})
export class Org2Module { }
