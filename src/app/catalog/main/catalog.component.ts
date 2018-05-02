import {Component, OnInit} from '@angular/core';
import {CatalogService, Template,} from "./catalog.service";
import {NGXLogger} from 'ngx-logger';
import {Router} from "@angular/router";
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {

  searchKeyword : string='';

  constructor(private catalogService: CatalogService, private logger: NGXLogger,private router: Router) {

  }

  ngOnInit() {
    this.catalogService.developInit();
    $(document).ready(() => {
      //TODO 임시로...
      $.getScript("../../assets/resources/js/common2.js")
        .done(function (script, textStatus) {
          //console.log( textStatus );
        })
        .fail(function (jqxhr, settings, exception) {
          console.log(exception);
        });
    });
  }

  Search()  {
    this.catalogService.Search(this.searchKeyword);
  }

  goAppTemplate(tem : Template) {
    this.router.navigate(['catalogdetail', tem.no]);
  }
}


