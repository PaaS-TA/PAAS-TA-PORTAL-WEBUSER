import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-org-main-nav',
  templateUrl: './org-main-nav.component.html'
})
export class OrgMainNavComponent implements OnInit {
  constructor() { }
  ngOnInit() { }

  @Output() reloadEvent = new EventEmitter<boolean>();

  public alertMsg(msg: string) {
    alert(msg);
  }
}
