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

  viewStarterPack(){
    this.router.navigate(['catalog']);
    this.catalogService.viewPacks(true, false, false);
  }

  viewBuildPack(value){
    this.router.navigate(['catalog']);
    
    this.catalogService.viewPacks(false, true, false);
    if(!isUndefined(value)) {
      this.catalogService.buildPackFilter(value);
    }
  }

  viewServicePack(value){
    this.router.navigate(['catalog']);
    
    this.catalogService.viewPacks(false, false, true);
    if(!isUndefined(value)) {
    this.catalogService.servicePackFilter(value);
  }}
}
