import { Injectable } from '@angular/core';
import {CommonService} from "../../common/common.service";

@Injectable()
export class QuantityMainService {
  constructor(private common: CommonService) { }

  private QuantityURL = '/v2/quantity/';

  private getToken() {
    return this.common.getToken();
  }

  getQuantityData(orgId: string, spaceId?: string): Array<Object> {
    let url = this.QuantityURL + orgId;
    if (spaceId != null && spaceId.trim() !== '') {
      url += ('?spaceId=' + spaceId);
    }

    /*
    let chartData = {};
    this.common.doGet(url, this.getToken()).subscribe(data => {
      chartData = data;
    });
    */

    // TODO implement to get quantity data
    let chartData = this.getSampleData();

    return chartData;
  }

  drawChart() {

  }

  getSampleData(): Array<Object> {
    return [
      // chart 1
      {
        data: {
          labels: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
          datasets: [{
            label: "사용량(GB)",
            backgroundColor: 'rgba(78, 174, 197, 0.5)',
            //borderColor: 'rgb(78, 174, 197)',
            borderWidth: 0,
            data: [4.3, 2.5, 10, 2, 15.5, 5, 10, 22, 7, 25, 13, 1.1],
          }]
        },

        // Configuration options go here
        options: {
          /* title:{
               display:true,   //title 표시 설정
               text:"월별 매입 매출 비교"  //title 명칭
          },*/
          scales: { yAxes: [{ ticks: { beginAtZero:true } }]
          }   // 데이터값 시작을 0부터시작
        }
      },
      {
        data: {
          labels: ["앱 이름1", "앱 이름2", "앱 이름3", "앱 이름4", "앱 이름5", "앱 이름6", "앱 이름7", "앱 이름8" ,"","","",""],
          datasets: [{
            label: "사용량(GB)",
            backgroundColor: 'rgba(127, 205, 188, 0.5)',
            //borderColor: 'rgb(78, 174, 197)',
            borderWidth: 0,
            data: [3.00, 1.50, 4, 3, 3.50, 4.50, 4.75, 4],
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: { beginAtZero:true },
              fontColor : "#3366ff",
            }]
          }   // 데이터값 시작을 0부터시작
        }
      }
    ];
  }
}
