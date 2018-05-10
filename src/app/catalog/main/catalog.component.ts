import {Component, OnInit} from '@angular/core';
import {BuildPack, CatalogService, Service, StarterPack} from "./catalog.service";
import {NGXLogger} from 'ngx-logger';
import {Router} from "@angular/router";
import {Organization} from "../../model/organization";
import {FormGroup} from "@angular/forms";
import {CATALOGURLConstant} from "../common/catalog.constant";
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {

  searchKeyword : string='';

  userid : string;
  constructor(private catalogService: CatalogService, private logger: NGXLogger,private router: Router) {
    this.userid = catalogService.getUserid();
  }


  ngOnInit() {
    //this.catalogService.developInit();

    this.catalogService.getStarterPacks(CATALOGURLConstant.GETSTARTERPACKS).subscribe(data => {
      this.StarterInit(data['list']);
    });
    this.catalogService.getBuildPacks(CATALOGURLConstant.GETBUILDPACKS).subscribe(data => {
      this.BuildInit(data['list']);
    });
    this.catalogService.getServicePacks(CATALOGURLConstant.GETSERVICEPACKS).subscribe(data => {
      this.ServiceInit(data['list']);
    });
    this.catalogService.getRecentPacks(CATALOGURLConstant.GETRECENTPACKS+this.userid+'?searchKeyword=').subscribe(data => {
      this.RecentInit(data);
    });

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
    this.catalogService.getSearchPack(CATALOGURLConstant.GETSEARCH+'?searchKeyword='+this.searchKeyword).subscribe(data => {
      this.StarterInit(data['TemplateList']);
      this.BuildInit(data['BuildPackList']);
    });
    this.catalogService.getSearchPack(CATALOGURLConstant.GETRECENTPACKS+this.userid+'?searchKeyword='+this.searchKeyword).subscribe(data => {
      this.RecentInit(data);
    });
  }

  goAppTemplate(starter : StarterPack) {
    this.router.navigate(['catalogdetail', starter.no]);
  }

  goAppDevelopMent(build : BuildPack) {
    this.router.navigate(['catalogdevelopment', build.no]);
  }

  RecentInit(data : any) {
    this.catalogService.recentpacks = new Array<any>();
    let lenght = data['list'].length;
    for (let i = 0; i < lenght; i++) {
      let dev = data['list'][i];
      this.catalogService.recentpacks[i] = dev;
    }
  }


  StarterInit(data : any) {
    this.catalogService.starterpacks = new Array<StarterPack>();
    for(let i = 0 ; i < data.length ; i++) {
      this.catalogService.starterpacks[i] = data[i];
    }
  }

  BuildInit(data : any) {
    this.catalogService.buildpacks = new Array<BuildPack>();
    for(let i = 0 ; i < data.length ; i++) {
      this.catalogService.buildpacks[i] = data[i];
    }
  }

  ServiceInit(data : any) {
    this.catalogService.servicepacks = new Array<Service>();
    for(let i = 0 ; i < data.length ; i++) {
      this.catalogService.servicepacks[i] = data[i];
    }
  }
}


