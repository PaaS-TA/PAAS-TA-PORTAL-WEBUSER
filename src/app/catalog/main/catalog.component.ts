import {Component, OnInit} from '@angular/core';
import {CatalogService, Template,} from "./catalog.service";
import {NGXLogger} from 'ngx-logger';
import {Router} from "@angular/router";
import {Organization} from "../../model/organization";
import {FormGroup} from "@angular/forms";
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {

  searchKeyword : string='';
  file : File;
  form: FormGroup;
  constructor(private catalogService: CatalogService, private logger: NGXLogger,private router: Router) {

  }
  filechange(event){
    // let fileList: FileList = event.target.files;
    // this.file = fileList[0];
    // let formData = new FormData();
    //
    // console.log(this.file);
    //
    // formData.append('file', this.file, this.file.name);
    //
    // console.log(formData);
    // console.log(this.file);
    console.log(this.file);

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


