import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-org-main-nav',
  templateUrl: './org-main-nav.component.html'
})
export class OrgMainNavComponent implements OnInit {
  constructor() { }
  ngOnInit() { }

  public alertMsg(msg: string) {
    alert(msg);
  }
}
