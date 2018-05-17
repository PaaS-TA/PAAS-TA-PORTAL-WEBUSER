import { Component, OnInit } from '@angular/core';
import {CatalogService} from "../../main/catalog.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-catalog-header',
  templateUrl: './catalog-header.component.html',
  styleUrls: ['./catalog-header.component.css']
})
export class CatalogHeaderComponent implements OnInit {

  constructor(private catalogService: CatalogService, private router: Router) { }

  ngOnInit() {
  }

  goAppMain(){
    this.router.navigate(['appMain']);
  }

  goCatalog(){
    this.router.navigate(['catalog']);
  }

  goUser(){
    this.router.navigate(['usermgmt']);
  }

  goOrgs(){
    this.router.navigate(['org']);
  }

  goLogout(){
    this.router.navigate(['logout']);
  }


}
