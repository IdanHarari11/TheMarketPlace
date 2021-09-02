import { ApexTitleSubtitle } from 'ng-apexcharts';
import { ApexYAxis } from 'ng-apexcharts';
import { ApexXAxis } from 'ng-apexcharts';
import { ApexChart } from 'ng-apexcharts';
import { Component, ViewChild } from '@angular/core';
import { ApexAxisChartSeries, ChartComponent } from 'ng-apexcharts';
import { ChartOptions } from 'src/app/Interfaces/chart-options';
import { GetApiInfoService } from 'src/app/Services/get-api-info.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { StockDetails } from 'src/app/models/stock-details';
import { StockSearch } from 'src/app/models/stock-search';
import { News } from 'src/app/models/news';
import { UpdateStock } from 'src/app/models/update-stock';

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
  
  stockDetails: StockDetails;
  myDetails2: StockDetails[] = [];
  stockSearch: StockSearch[] = [];
  priceCurrentStock: number;
  priceStock1: number;
  priceStock2: number;
  priceStock3: number;
  priceStock4: number;
  newsLimit: number = 3;
  myNews: News[] = [];
  prices: any;
  searchForm: FormGroup;
  updateStock: UpdateStock;

  
  constructor(private API_Info: GetApiInfoService, private formBuilder: FormBuilder) {
    // The first buildup
    this.APIcall = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${this.StockSymbol}&outputsize=compact&interval=60min&apikey=${this.APIkey}`;
    this.init();
  }

  init(){
    this.fetchStock(this.APIcall, 'Time Series (Daily)');
    this.getDetails();
    this.getStockNews();
    this.getStockPrices();
    this.searchForm = this.formBuilder.group({
      searchInput: '',
    });
    this.getCorrectPrice();
  }

  getCorrectPrice(){
    let comp = this;
    const socket = new WebSocket('wss://ws.finnhub.io?token=c4lv5h2ad3icjh0e8bmg');

    // Connection opened -> Subscribe
    socket.addEventListener('open', function (event) {
        socket.send(JSON.stringify({'type':'subscribe', 'symbol': comp.StockSymbol}))
        socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'GOOG'}))
        socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'TSLA'}))
        socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'SPY'}))
        socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'BINANCE:BTCUSDT'}))
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
      comp.updateStock = JSON.parse(event.data);
      if(comp.updateStock.data)
      {
        comp.updateStock.data.forEach((element: any) => {
          element.s == comp.StockSymbol ? comp.priceCurrentStock = element.p : null;
          element.s == 'GOOG' ? comp.priceStock1 = element.p : null;
          element.s == 'TSLA' ? comp.priceStock2 = element.p : null;
          element.s == 'SPY' ? comp.priceStock3 = element.p : null;
          element.s == 'BINANCE:BTCUSDT' ? comp.priceStock4 = element.p : null;
        });
      }
    });

    // Unsubscribe
    var unsubscribe = function(symbol: string) {
        socket.send(JSON.stringify({'type':'unsubscribe','symbol': symbol}))
    }
  }
  
  search(){ //Get ${data}
    if (this.searchForm.valid) {

    fetch(`https://finnhub.io/api/v1/search?q=${this.searchForm.controls['searchInput'].value}&token=c4lv5h2ad3icjh0e8bmg`)
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
    this.hideAllNews();
    this.stockDetails.name = this.searchForm.controls['searchInput'].value;
  }
 
  showChartOfSearchStock(stock: string){
    this.StockSymbolFromServ.splice(0, 1);
    this.StockSymbolFromServ.push(stock);
    this.StockSymbol = this.StockSymbolFromServ[0];
    this.APIcall = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${this.StockSymbol}&outputsize=compact&interval=60min&apikey=${this.APIkey}`;
    this.fetchStock(this.APIcall, 'Time Series (Daily)');
    this.getDetails();
    this.getStockNews();
    this.getStockPrices();
    this.getCorrectPrice();
  }

  getDetails(){ // Get details from API2 and save it to ${stockDetails} - symbol, name, logo, url
    this.API_Info.getDetails().subscribe((res) => {
      this.stockDetails = res; // Get company details
    })
  }
  
  getStockPrices(){ 
    this.API_Info.getStockPrices().subscribe(res => {
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

          for (var i = 0; i < stockChartXValues.length; i++){
            comp.xy = {x: stockChartXValues[i], y: [stockChartCloseValues[i], stockChartHighValues[i], stockChartLowValues[i], stockChartOpenValues[i],]}
            comp.arrXY.push(comp.xy);
          }
          return comp.arrXY;
        }
        ).then( () => {

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

  setChartTime(Time: string){ // Change the time of chart range
    let tempAPI: string;

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

  getStockNews(){
    this.API_Info.getStockNews().subscribe((res) => {
     let i = 1;
     this.myNews = [];
      res.forEach((element: News) => {
        i <= this.newsLimit ? this.myNews.push(element) : '';
        i++;
      });
   })
  }

  getMoreNews(){
   this.newsLimit = this.newsLimit + 5;
    this.getStockNews();
  }

  hideNews(){
    this.newsLimit != 5 ? this.newsLimit = this.newsLimit - 5 : '';
    this.getStockNews();
  }

  hideAllNews(){
    this.newsLimit = 3;
    this.getStockNews();
  }
  
}
