import { Component, ViewChild } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexYAxis,
  ApexXAxis,
  ApexTitleSubtitle,
} from 'ng-apexcharts';
import { GetDataService } from './Service/get-data.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  series: ApexAxisChartSeries;
  achart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  timestamp: any;
  close: any = {};
  high: any;
  low: any;
  open: any;
  volume: any;
  // dataa :[[]] = [[]];

  dataa : [{close: number, high: number, low: number, open: number}];

  constructor(private ChartData: GetDataService) {
    this.buildChart();
    
    
  }
   buildChart(){
    this.ChartData.getAll().subscribe((data) => {
        this.timestamp = data.chart.result[0].timestamp;
        this.close = data.chart.result[0].indicators.quote[0].close;
        this.high = data.chart.result[0].indicators.quote[0].high;
        this.low = data.chart.result[0].indicators.quote[0].low;
        this.open = data.chart.result[0].indicators.quote[0].open;
        this.volume = data.chart.result[0].indicators.quote[0].volume;
        this.dataa = [{close: this.close, high: this.high, low:  this.low, open: this.open}];
        console.log(this.dataa[0].close);

        
        this.series = [
      {
        name: 'candle',
        data: [
          {
            x: new Date(this.timestamp[0]),
            y: [this.close[0], this.high[0], this.low[0], this.open[0]],
          }
        ]
      }
    ];

    this.achart = {
      type: 'candlestick',
      height: 350,
    };
    this.title = {
      text: 'CandleStick Chart',
      align: 'left',
    };
    this.xaxis = {
      type: 'datetime',
    };
    this.yaxis = {
      tooltip: {
        enabled: true,
      },
    };
      });
    }

  

  // public generateDayWiseTimeSeries(baseval: any, count: any, yrange: any) {
  //   var i = 0;
  //   var series = [];
  //   while (i < count) {
  //     var y =
  //       Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

  //     series.push([baseval, y]);
  //     baseval += 86400000;
  //     i++;
  //   }
  //   return series;
  // }
}
