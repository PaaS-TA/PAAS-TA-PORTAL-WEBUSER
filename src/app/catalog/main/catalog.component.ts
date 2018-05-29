import {Component, OnInit} from '@angular/core';
import {BuildPack, CatalogService, ServicePack, StarterPack} from "./catalog.service";
import {NGXLogger} from 'ngx-logger';
import {Router} from "@angular/router";
import {Organization} from "../../model/organization";
import {FormGroup} from "@angular/forms";
import {CATALOGURLConstant} from "../common/catalog.constant";
import {forEach} from "@angular/router/src/utils/collection";
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
  recentpacks : Array<any> = Array<any>();
  constructor(private catalogService: CatalogService, private logger: NGXLogger,private router: Router) {
    this.userid = catalogService.getUserid();
  }


  ngOnInit() {
    this.catalogService.getStarterPacks(CATALOGURLConstant.GETSTARTERPACKS).subscribe(data => {
      this.StarterInit(data['list']);
    });
    this.catalogService.getBuildPacks(CATALOGURLConstant.GETBUILDPACKS).subscribe(data => {
      this.BuildInit(data['list']);
    });
    this.catalogService.getServicePacks(CATALOGURLConstant.GETSERVICEPACKS).subscribe(data => {
      this.ServiceInit(data['list']);
    });
    this.catalogService.getRecentPacks(CATALOGURLConstant.GETRECENTPACKS+this.userid).subscribe(data => {
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
    this.SearchStarterPack();
    this.SearchBuildPack();
    this.SearchServicePack();
  }

  goStarter(starter : StarterPack) {
    this.router.navigate(['catalogdetail', starter.no]);
  }

  goDevelopMent(build : BuildPack) {
    this.router.navigate(['catalogdevelopment', build.no]);
  }

  goService(service : ServicePack) {
    this.router.navigate(['catalogservice', service.no]);
  }

  goHistory(any : any){
    const classification = any['classification'];
    if(classification.includes("starter_")){
      this.router.navigate(['catalogdetail', any['no']]);
    }
    else if(classification.includes("buildpack_")){
      this.router.navigate(['catalogdevelopment', any['no']]);
    }
    else if(classification.includes("service_")){
      this.router.navigate(['catalogservice', any['no']]);
    }
  }


  RecentInit(data : any) {
    this.recentpacks = [];
    this.recentpacks = data['list'];
  }


  StarterInit(data : any) {
    this.catalogService.starterpacks = new Array<StarterPack>();
    this.catalogService.starterpacks = data;
    this.catalogService.viewstarterpacks = this.catalogService.starterpacks;
  }

  BuildInit(data : any) {
    this.catalogService.buildpacks = new Array<BuildPack>();
    this.catalogService.buildpacks = data;
    this.catalogService.viewbuildpacks = this.catalogService.buildpacks;
  }

  ServiceInit(data : any) {
    this.catalogService.servicepacks = new Array<ServicePack>();
    this.catalogService.servicepacks = data;
    this.catalogService.viewservicepacks = this.catalogService.servicepacks;
  }

  SearchStarterPack() {
    this.catalogService.viewstarterpacks = new Array<StarterPack>();
    const keyword = this.searchKeyword.toLocaleLowerCase();
    this.catalogService.starterpacks.forEach(function (starterpack) {
      if ((starterpack.description.toLocaleLowerCase().indexOf(keyword) != -1) || (starterpack.summary.toLocaleLowerCase().indexOf(keyword) != -1) || (starterpack.name.toLocaleLowerCase().indexOf(keyword) != -1)) {
        this.catalogService.viewstarterpacks.push(starterpack);
      }
    });
  }

    SearchBuildPack() {
      this.catalogService.viewbuildpacks = new Array<BuildPack>();
    const keyword = this.searchKeyword.toLocaleLowerCase();
    this.catalogService.buildpacks.forEach(function (buildpack) {
      if((buildpack.description.toLocaleLowerCase().indexOf(keyword) != -1) || (buildpack.summary.toLocaleLowerCase().indexOf(keyword) != -1) || (buildpack.name.toLocaleLowerCase().indexOf(keyword) != -1)) {
        this.catalogService.viewbuildpacks.push(buildpack);
      }});
  }

  SearchServicePack() {
    this.catalogService.viewservicepacks = new Array<ServicePack>();
    const keyword = this.searchKeyword.toLocaleLowerCase();
    this.catalogService.servicepacks.forEach(function (servicepack) {
      if((servicepack.description.toLocaleLowerCase().indexOf(keyword) != -1) || (servicepack.summary.toLocaleLowerCase().indexOf(keyword) != -1) || (servicepack.name.toLocaleLowerCase().indexOf(keyword) != -1)) {
        this.catalogService.viewservicepacks.push(servicepack);
      }});
  }
}


