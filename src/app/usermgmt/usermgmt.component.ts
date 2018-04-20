import {Component, OnInit} from '@angular/core';
import {CommonService} from "../common/common.service";
import {User, UsermamtService} from "./usermamt.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";


declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-usermgmt',
  templateUrl: './usermgmt.component.html',
  styleUrls: ['./usermgmt.component.css']
})
export class UsermgmtComponent implements OnInit {

  public user: Observable<User>;


  // 이 부분은 Angular가 아닌 자바스크립트에서 실행 :: VO
  constructor(private httpClient: HttpClient, private userMgmtService: UsermamtService) {
    this.user = new Observable<User>();
    // this.user['userName'] = "sjchoi"
    // this.user['tellPhone'] = "1004"
    this.userInfo();
    //this.usersave();
  }


  userInfo() {
    this.userMgmtService.userinfo('sjchoi').subscribe(data => {
      this.user = data;
      return data;
    });
  }

  usersave(){
    let params = {userName: this.user['userName'],
                  tellPhone: this.user['tellPhone']};
    this.userMgmtService.usersave('sjchoi',params).subscribe(data => {
      if(data == 1){
        console.log('success');
      }else{
        console.log('User does not exist');
      }
      console.log(data);
      return data;
    });
  }

  // Angular에서 필요에 맞게 호출
  ngOnInit() {
    console.log('ngOnInit fired');

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
  }//[E]

}
