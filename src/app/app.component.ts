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
    if($.cookie("useLang") != null && $.cookie("useLang") != "") {
      this.translate.setDefaultLang($.cookie("useLang"));
      this.common.useLang = $.cookie("useLang");
    } else {
      this.translate.setDefaultLang(this.common.defaultLang);
    }

    this.translate.use(this.common.useLang);

    $("li[id^='lang_']").removeClass("cur");
    $("#lang_"+this.common.useLang+"").addClass("cur");
  }

  ngDoCheck() {
    if (this.isLoading != this.common.isLoading)
      this.isLoading = this.common.isLoading;
  }

}

