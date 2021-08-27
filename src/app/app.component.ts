import { ChartOptions } from './Interfaces/chart-options';
import { Component, ViewChild } from '@angular/core';

import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexYAxis, ApexXAxis, ApexTitleSubtitle } from 'ng-apexcharts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  stockChartXValues: string[] = [];
  stockChartOpenValues: string[] = [];
  stockChartCloseValues: string[] = [];
  stockChartLowValues: string[] = [];
  stockChartHighValues: string[] = [];

  @ViewChild('chart') chart: ChartComponent;
  chartOptions: Partial<ChartOptions>;
  series: ApexAxisChartSeries;
  achart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  index: number = 1;
  xy: any;
  arrXY?: any = [] ;

  constructor() {
    this.fetchStock();
  }
  

  fetchStock() { 
    const APIkey: string = 'AMSISRLGQ1YC8Q6V';
    let StockSymbol: string = 'TSLA'
    let APIcall: string = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${StockSymbol}&interval=5min&apikey=${APIkey}`;
    var comp = this;

    fetch(APIcall)
      .then(
        (response) => {
          return response.json();
        }
      ).then(
        (data) => {
          for (var key in data['Time Series (Daily)']){ //! (Daily) The chart range
            comp.stockChartXValues.push(key); //? The dates
            comp.stockChartOpenValues.push(data['Time Series (Daily)'][key]["1. open"]); //? The open prices
            comp.stockChartHighValues.push(data['Time Series (Daily)'][key]["2. high"]); //? The high prices
            comp.stockChartLowValues.push(data['Time Series (Daily)'][key]["3. low"]); //? The low prices
            comp.stockChartCloseValues.push(data['Time Series (Daily)'][key]["4. close"]); //? The close prices
          }
          for (var i = 0; i < 100; i++){
            comp.xy = {x: comp.stockChartXValues[i], y: [comp.stockChartCloseValues[i], comp.stockChartHighValues[i], comp.stockChartLowValues[i], comp.stockChartOpenValues[i],]}
            // console.log(comp.xy);
            
            comp.arrXY.push(comp.xy);
            // console.log(comp.arrXY);  
          }
          return comp.arrXY;
        }
        ).then( () => {
        console.log(comp.arrXY);
        
        comp.series = [
                          {
                            name: 'candle',
                            data: comp.arrXY
                          }
                        ];
                        comp.achart = {
                          type: 'candlestick',
                          height: 350,
                        };
                        comp.title = {
                          text: StockSymbol ,
                          align: 'left',
                        };
                        comp.xaxis = {
                          type: 'datetime',
                        };
                        comp.yaxis = {
                          tooltip: {
                            enabled: true,
                          },
                        };
        
        });
        
  }

}
