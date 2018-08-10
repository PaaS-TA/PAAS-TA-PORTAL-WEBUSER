import { Component, OnInit, Input } from '@angular/core';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {CommonService} from "../../common/common.service";

declare var $: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  @Input('cursorId') cursorId: string;

  quantity : boolean;
  translateEntities : any;
  allMenuCursorIds: string[] = [
    'cur_usermgmt_nav', 'cur_org_nav', 'cur_org2_nav', 'cur_quantity_nav', 'cur_login_nav'
  ];

  constructor(private translate: TranslateService, public common : CommonService) { }

  ngOnInit() {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.allMenuCursorIds.forEach(id => $('#' + id).removeClass('cur'));
      $('#' + this.cursorId).addClass('cur');
    })
  }

  ngDoCheck() {
    this.allMenuCursorIds.forEach(id => $('#' + id).removeClass('cur'));
    $('#' + this.cursorId).addClass('cur');
  }

}
