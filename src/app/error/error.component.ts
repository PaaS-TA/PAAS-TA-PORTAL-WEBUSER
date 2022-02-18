import { Component, OnInit } from '@angular/core';
import {TranslateService, LangChangeEvent} from '@ngx-translate/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  public translateEntities: any = [];

  constructor(private translate: TranslateService) {
    this.translate.get('error').subscribe((res: string) => {
      this.translateEntities = res;
    });

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.translateEntities = event.translations.error;
    });
   }

  ngOnInit() {
  }

}
