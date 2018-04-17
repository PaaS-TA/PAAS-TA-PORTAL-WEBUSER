import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppMainService} from './app-main.service';
import {Observable} from 'rxjs/Observable';

declare var $: any; declare var jQuery: any;

@Component({
  selector: 'app-app-main',
  templateUrl: './app-main.component.html',
  styleUrls: ['./app-main.component.css']
})
export class AppMainComponent implements OnInit {

  public appSummaryEntities: Observable<any[]>;
  private isLoading: boolean = false;

  private appSummaryName: string;
  private appSummaryState: String;

  constructor(private route: ActivatedRoute, private router: Router, private appMainService: AppMainService) { }

  ngOnInit() {
    $(document).ready(() => {
      //TODO 임시로...
      $.getScript( "../../assets/resources/js/common2.js" )
        .done(function( script, textStatus ) {
          //console.log( textStatus );
        })
        .fail(function( jqxhr, settings, exception ) {
          console.log( exception );
        });
    });

    this.route.queryParams.subscribe(params => {
      if (params != null) {
        this.getAppSummary(params['name'], params['guid']);
      } else {
        this.router.navigate(['dashMain']);
      }
    });
  }

  getAppSummary(name: string, guid: string) {
    this.isLoading = true;
    this.appMainService.getAppSummary(name, guid).subscribe(data => {
      this.appSummaryEntities = data;
      this.isLoading = false;

      this.appSummaryName = data.name;
      this.appSummaryState = data.state;
      console.log(data);
    });
  }

}
