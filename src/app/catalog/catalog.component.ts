import {Component, OnInit} from '@angular/core';
import {CatalogService,} from "./catalog.service";
import {NGXLogger} from 'ngx-logger';
declare var $: any; declare var jQuery: any;
@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {

  searchKeyword : string='';

  constructor(private catalogService: CatalogService, private logger: NGXLogger) {

  }

  ngOnInit() {
    this.catalogService.developInit();
  }

  Search()  {
    this.catalogService.Search(this.searchKeyword);
  }

  KeywordClear()  {
    this.searchKeyword = '';
  }
}


