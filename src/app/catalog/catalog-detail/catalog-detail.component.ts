import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CatalogService, Development, Service, Template} from "../main/catalog.service";
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-catalog-detail',
  templateUrl: './catalog-detail.component.html',
  styleUrls: ['./catalog-detail.component.css']
})
export class CatalogDetailComponent implements OnInit {

  development : Development;
  template : Template;
  service : Service;
  constructor(private route : ActivatedRoute, private catalogSerive : CatalogService) {
    this.catalogSerive.CatalogDetailInit(route.snapshot.params['id']).subscribe(data => {
      this.template = data['Starter'];
      this.service = data['Servicepack'];
    });
  }

  ngOnInit() {
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

}
