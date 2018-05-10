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
    if(catalogService.templates.length === 0){
      this.router.navigate(['catalog']);
    }
  }

  ngOnInit() {
  }

  goMain() {
    this.router.navigate(['catalog']);
  }

  goAppTemplate() {
    this.router.navigate(['catalogdetail', this.catalogService.templates[0].no]);
  }

}
