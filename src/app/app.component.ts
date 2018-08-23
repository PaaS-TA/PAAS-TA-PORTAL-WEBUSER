import {Component, DoCheck} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CommonService} from './common/common.service';


declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements DoCheck {
  isLoading: boolean = false;
  constructor(public common: CommonService, public translate: TranslateService) {
    this.translate.setDefaultLang(this.common.defaultLang);
    this.translate.use(this.common.useLang);

    $("li[id^='lang_']").removeClass("cur");
    $("#lang_"+this.common.useLang+"").addClass("cur");
  }

  ngDoCheck() {
    if (this.isLoading != this.common.isLoading)
      this.isLoading = this.common.isLoading;
  }

}

