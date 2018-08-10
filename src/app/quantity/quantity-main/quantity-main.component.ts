import {AfterContentChecked, Component, OnInit} from '@angular/core';
import {QuantityMainService} from "./quantity-main.service";
import {Router} from "@angular/router";
import {NGXLogger} from "ngx-logger";
import {RoutingModule} from "../../app.routing";
import {CommonService} from "../../common/common.service";

declare var jQuery;
declare var $;
declare var Chart;

@Component({
  selector: 'app-quantity-main',
  templateUrl: './quantity-main.component.html',
  styleUrls: ['./quantity-main.component.css']
})
export class QuantityMainComponent implements OnInit, AfterContentChecked {
  public charts: Array<QuantityChart> = [];
  private isLoadingChart: Boolean = null;
  constructor(private common: CommonService, private quantityService: QuantityMainService,
              private logger: NGXLogger) { }

  ngOnInit() {
    this.getCharts();
  }

  ngAfterContentChecked() {
    this.drawCharts();
  }

  alertMsg(msg) {
    window.alert(msg);
  }

  getQuantity() {
    this.alertMsg('준비 중입니다.');
  }

  getCharts() {
    const data: Array<Object> = this.quantityService.getQuantityData('', '');
    for (let i = 0; i < data.length; i++) {
      const chart = new QuantityChart(data[i]);
      this.charts.push(chart);
    }
    this.isLoadingChart = true;
  }

  drawCharts() {
    //const data = await this.quantityService.getQuantityData('', '');
    if (this.isLoadingChart) {
      const elements = $('canvas[name=chartCanvas]');
      if (elements.length > 0 && elements.length === this.charts.length) {
        for (let i = 0; i < this.charts.length; i++) {
          const context = elements[i].getContext('2d');
          this.charts[i].createChart(context);
        }
        // organizations_wrap maT30  + 맨 마지막 차트에 last 추가
        const lastElement = elements[this.charts.length - 1];
        const styleClassForLast = lastElement.getAttribute('class') + ' last';
        lastElement.setAttribute('class', styleClassForLast);

        // attach event
        this.attachEvent();

        this.isLoadingChart = false;
      }
    }
  }

  attachEvent() {
    if (this.isLoadingChart) {
      const scriptURL = '/assets/resources/js/common.js';
      const selfCom = this;
      const logger = this.logger;
      let retryCount = 0;

      let isSuccess = false;
      while (retryCount < 3 && isSuccess === false) {
        $.ajaxSetup({async: false});
        $.getScript(scriptURL).fail(function (jqxhr, settings, exception) {
          logger.error('Occured error :', exception);
        }).done(
          function (script, textStatus) {
            isSuccess = true;
            logger.debug('Success to attach common2.js...', textStatus);
          });
        $.ajaxSetup({async: true});  // rollback
        retryCount++;
      }
    }
  }
}

class QuantityChart {
  public _chart;
  private _data;

  constructor(data) {
    this.setChartData(data);
  }

  get chart() {
    return this._chart;
  }

  get chartData() {
    return this._data;
  }

  private setChartData(extData) {
    this._data = {
      type: 'bar',
      showLines : 'false',
      data: extData['data'],
      options: extData['options'],
    };
  }

  createChart(context) {
    this._chart = new Chart(context, this.chartData);
  }
}
