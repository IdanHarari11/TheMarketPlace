import { ApexTitleSubtitle } from 'ng-apexcharts';
import { ApexYAxis } from 'ng-apexcharts';
import { ApexXAxis } from 'ng-apexcharts';
import { ApexChart } from 'ng-apexcharts';
import { Component, ViewChild } from '@angular/core';
import { ApexAxisChartSeries, ChartComponent } from 'ng-apexcharts';
import { ChartOptions } from 'src/app/Interfaces/chart-options';
import { GetApiInfoService } from 'src/app/Services/get-api-info.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  //? To draw the main chart
  @ViewChild('chart') chart: ChartComponent;
  chartOptions: Partial<ChartOptions>;
  series: ApexAxisChartSeries;
  achart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  annotations: ApexChart
  index: number = 1;
  xy: any;
  arrXY?: any = [] ;

  //? To get stock symbol from service and control there the API StockSymbol 
  StockSymbolFromServ = this.API_Info.StockSymbol;
  StockSymbol = this.StockSymbolFromServ[0];

  //? API key and URL
  APIkey: string = 'AMSISRLGQ1YC8Q6V';
  APIcall: string = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${this.StockSymbol}&outputsize=compact&interval=60min&apikey=${this.APIkey}`;
  
  active: string = 'D'; //? Control the css of the dates (Day, Week, Month) on the chart
  
  myDeatils: any;
  stockSearch: any = [];
  newsLimit: number = 3;
  myNews: any = [];
  prices: any;

  
  constructor(private API_Info: GetApiInfoService) {
    // The first buildup
    this.APIcall = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${this.StockSymbol}&outputsize=compact&interval=60min&apikey=${this.APIkey}`;
    this.fetchStock(this.APIcall, 'Time Series (Daily)');
    this.getDeatils();
    this.getNews();
    this.getPrices();
  }
  
  search(data: string){ //Get ${data}
    fetch(`https://finnhub.io/api/v1/search?q=${data}&token=c4lv5h2ad3icjh0e8bmg`)
    .then(
      (response) => {
        return response.json();
      }).then(
        (res) => {
          this.stockSearch = [];
          for (let i = 0; i <= 5; i++) {
            this.stockSearch.push(res.result[i])
          }
        }
      )
  }
 
  getSearchStock(stock: string){
    this.StockSymbolFromServ.splice(0, 1);
    this.StockSymbolFromServ.push(stock);
    this.StockSymbol = this.StockSymbolFromServ[0];
    this.APIcall = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${this.StockSymbol}&outputsize=compact&interval=60min&apikey=${this.APIkey}`;
    this.fetchStock(this.APIcall, 'Time Series (Daily)');
    this.getDeatils();
    this.getNews();
    this.getPrices();
  }

  getDeatils(){ // Get deatils from API2 and save it to ${myDeatils}
    this.API_Info.getDeatils().subscribe((res) => {
      this.myDeatils = res; // Get company deatils
    })
  }

  getPrices(){ //^GSPC , ^NDX , ^DJI , ^OEX
    this.API_Info.getPrices().subscribe(res => {
      this.prices = res;
    })
  }

  fetchStock(URL: string, Time: string) {  // Get ${StockSymbol} and get data from API1
    var comp = this;
    
  
    fetch(URL)
      .then(
        (response) => {
          return response.json();
        }
      ).then(
        (data) => {
          console.log(data);

          let stockChartXValues: string[] = [];
          let stockChartOpenValues: string[] = [];
          let stockChartHighValues: string[] = [];
          let stockChartLowValues: string[] = [];
          let stockChartCloseValues: string[] = [];
          comp.xy = {}
          comp.arrXY = []            

          for (var key in data[Time]){ //! (Daily) The chart range
            stockChartXValues.push(key); //? The dates
            stockChartOpenValues.push(data[Time][key]["1. open"]); //? The open prices
            stockChartHighValues.push(data[Time][key]["2. high"]); //? The high prices
            stockChartLowValues.push(data[Time][key]["3. low"]); //? The low prices
            stockChartCloseValues.push(data[Time][key]["4. close"]); //? The close prices
          }
          // console.log(stockChartXValues);

          for (var i = 0; i < stockChartXValues.length; i++){
            comp.xy = {x: stockChartXValues[i], y: [stockChartCloseValues[i], stockChartHighValues[i], stockChartLowValues[i], stockChartOpenValues[i],]}
            comp.arrXY.push(comp.xy);
          }
          return comp.arrXY;
        }
        ).then( () => {
        // console.log(comp.arrXY);
        
        comp.series = [
                          {
                            name: 'candle',
                            data: comp.arrXY
                          }
                        ],
                        comp.title = {
                          align: 'left',
                        },
                        comp.xaxis = {
                          labels: {
                            style: {
                                colors: ['white', 'white','white','white','white','white','white','white','white','white','white'],
                                },
                              },
                          type: 'datetime',
                        },
                        comp.yaxis = {
                          labels: {
                            style: {
                                colors: ['white'],
                                },
                              },
                          tooltip: {
                            enabled: true,
                          },
                        },
                        comp.achart = {
                          type: 'candlestick',
                          height: 350,
                          animations: {
                            enabled: true,
                            easing: 'linear',
                            speed: 1,
                            animateGradually: {
                                enabled: true,
                                delay: 0
                            },
                            dynamicAnimation: {
                                enabled: true,
                                speed: 1
                            }
                        }}
        });
  }

  setTime(Time: string){ // Change the time of chart range
    let tempAPI: string;
        console.log(Time);

    switch (Time) {
      case 'Day':
        this.active = 'D';
        tempAPI = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${this.StockSymbol}&outputsize=compact&apikey=${this.APIkey}`;
        this.fetchStock(this.APIcall, 'Time Series (Daily)');
        break;
        case 'Week':
        this.active = 'W';
        tempAPI = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${this.StockSymbol}&apikey=${this.APIkey}`;
        this.fetchStock(tempAPI, 'Weekly Adjusted Time Series');
        break;
        case 'Month':
        this.active = 'M';
        tempAPI = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${this.StockSymbol}&outputsize=full&apikey=${this.APIkey}`;
        this.fetchStock(tempAPI, 'Monthly Adjusted Time Series');
        break;
    
      default:
        tempAPI = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${this.StockSymbol}&outputsize=compact&apikey=${this.APIkey}`;
        this.fetchStock(this.APIcall, 'Time Series (Daily)');
        break;
    }
  }

  getNews(){
    this.API_Info.getNews().subscribe((res) => {
     let i = 1;
     this.myNews = [];
      res.forEach((element: any) => {
        i <= this.newsLimit ? this.myNews.push(element) : '';
        i++;
      });
   })
  }

  getMoreNews(){
   this.newsLimit = this.newsLimit + 5;
    this.getNews();
  }

  hideNews(){
    this.newsLimit != 3 ? this.newsLimit = this.newsLimit - 3 : '';
    this.getNews();
  }

  hideAllNews(){
   this.newsLimit = 3;
    this.getNews();
  }
}
