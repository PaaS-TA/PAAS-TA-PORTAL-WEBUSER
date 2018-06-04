import { Component, OnInit } from '@angular/core';
import {CatalogService} from "../../main/catalog.service";
import {Router} from "@angular/router";
import {isUndefined} from "util";

@Component({
  selector: 'app-catalog-nav',
  templateUrl: './catalog-nav.component.html',
  styleUrls: ['./catalog-nav.component.css']
})
export class CatalogNavComponent implements OnInit {

  constructor(private catalogService: CatalogService, private router: Router) {
  }

  ngOnInit() {
  }

  viewMain() {
    this.router.navigate(['catalog']);
    this.catalogService.viewPacks(true, true, true);
  }

  viewStarterPack(value){
    console.log(value);
    this.router.navigate(['catalog']);
    this.catalogService.viewPacks(true, false, false);
  }

  viewBuildPack(value){
    this.router.navigate(['catalog']);

    this.catalogService.viewPacks(false, true, false);
    if(!isUndefined(value)) {
      this.catalogService.buildPackfilter = value;
      this.catalogService.buildPackFilter();
    }
    else {
      this.catalogService.buildPackfilter = '';
    }
  }

  viewServicePack(value){
    this.router.navigate(['catalog']);

    this.catalogService.viewPacks(false, false, true);
    if(!isUndefined(value)) {
      this.catalogService.servicePackfilter = value;
    this.catalogService.servicePackFilter();
  }
    else{
      this.catalogService.servicePackfilter = '';
    }
  }

}
