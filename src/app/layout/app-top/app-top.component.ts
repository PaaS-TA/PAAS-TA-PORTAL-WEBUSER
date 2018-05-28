import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-app-top',
  templateUrl: './app-top.component.html',
  styleUrls: ['./app-top.component.css']
})
export class AppTopComponent implements OnInit {

  constructor(private translate: TranslateService) { }

  ngOnInit() {
  }

  changeLangClick(lang: string) {
    this.translate.use(lang);

    $("li[id^='lang_']").removeClass("cur");
    $("#lang_"+lang+"").addClass("cur");
  }

}
