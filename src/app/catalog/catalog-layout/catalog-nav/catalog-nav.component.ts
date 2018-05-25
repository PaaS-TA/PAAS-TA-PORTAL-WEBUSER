import { Component, OnInit } from '@angular/core';
import {CatalogService} from "../../main/catalog.service";
import {Router} from "@angular/router";

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

  viewBuildPack(){
    this.router.navigate(['catalog']);
    this.catalogService.viewPacks(false, true, false);
  }

  viewServicePack(){
    this.router.navigate(['catalog']);
    this.catalogService.viewPacks(false, false, true);
  }



}
