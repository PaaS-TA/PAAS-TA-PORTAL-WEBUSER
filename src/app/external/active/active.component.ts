import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../common/common.service';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.css']
})
export class ActiveComponent implements OnInit {

  public translateEntities: any = [];

  constructor(private commonService: CommonService, private translate: TranslateService) {
    this.translate.get('external').subscribe((res: string) => {
      this.translateEntities = res;
    });

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateEntities = event.translations.external;
    });
   }

  ngOnInit() {
  }

}
