import { ApexTitleSubtitle } from 'ng-apexcharts';
import { ApexYAxis } from 'ng-apexcharts';
import { ApexXAxis } from 'ng-apexcharts';
import { ApexChart } from 'ng-apexcharts';
import { Component, ViewChild } from '@angular/core';
import { ApexAxisChartSeries, ChartComponent } from 'ng-apexcharts';
import { ChartOptions } from 'src/app/Interfaces/chart-options';
import { GetApiInfoService } from 'src/app/Services/get-api-info.service';
import { FormGroup, FormBuilder } from '@angular/forms';

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
  
  stockDeatils: any;
  myDeatils2: any = [];
  stockSearch: any = [];
  stock1:number;
  stock2:number;
  stock3:number;
  stock4:number;
  newsLimit: number = 3;
  myNews: any = [];
  prices: any;
  searchForm: FormGroup;
  updateStock: any;

  
  constructor(private API_Info: GetApiInfoService, private formBuilder: FormBuilder) {
    // The first buildup
    this.APIcall = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${this.StockSymbol}&outputsize=compact&interval=60min&apikey=${this.APIkey}`;
    this.fetchStock(this.APIcall, 'Time Series (Daily)');
    this.getDeatils();
    this.getDeatils2('TSLA','AAPL','GOOG','INTC');
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

        socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'AAPL'}))
        socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'TSLA'}))
        socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'GOOG'}))
        socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'INTC'}))
        // socket.send(JSON.stringify({'type':'subscribe', 'symbol': 'BINANCE:BTCUSDT'}))
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
      comp.updateStock = JSON.parse(event.data);
      comp.updateStock.data.forEach((element: any) => {
        element.s == 'GOOG' ? comp.stock1 = element.p : null;
        element.s == 'TSLA' ? comp.stock2 = element.p : null;
        element.s == 'AAPL' ? comp.stock3 = element.p : null;
        element.s == 'INTC' ? comp.stock4 = element.p : null;
      });
      console.log(comp.updateStock);

        // console.log('Message from server ', event.data);
    });

    // Unsubscribe
    var unsubscribe = function(symbol: any) {
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
     this.stockDeatils.name = this.searchForm.controls['searchInput'].value;
  }
 
  showChartOfSearchStock(stock: string){
    this.StockSymbolFromServ.splice(0, 1);
    this.StockSymbolFromServ.push(stock);
    this.StockSymbol = this.StockSymbolFromServ[0];
    this.APIcall = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${this.StockSymbol}&outputsize=compact&interval=60min&apikey=${this.APIkey}`;
    this.fetchStock(this.APIcall, 'Time Series (Daily)');
    this.getDeatils();
    this.getStockNews();
    this.getStockPrices();
  }

  getDeatils(){ // Get deatils from API2 and save it to ${stockDeatils}
    this.API_Info.getDeatils().subscribe((res) => {
      this.stockDeatils = res; // Get company deatils
    })
  }
  
  async getDeatils2(symbol: string,symbol1: string,symbol2: string, symbol3: string){ // Get deatils from API2 and save it to ${stockDeatils}
    await this.API_Info.getDeatils2(symbol).subscribe((res) => {
      this.myDeatils2.push(res); // Get company deatils
    })
    await this.API_Info.getDeatils2(symbol1).subscribe((res) => {
      this.myDeatils2.push(res); // Get company deatils
    })
    await this.API_Info.getDeatils2(symbol2).subscribe((res) => {
      this.myDeatils2.push(res); // Get company deatils
    })
    await this.API_Info.getDeatils2(symbol3).subscribe((res) => {
      this.myDeatils2.push(res); // Get company deatils
      console.log(this.myDeatils2);
      
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

  setChartTime(Time: string){ // Change the time of chart range
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

  getStockNews(){
    this.API_Info.getStockNews().subscribe((res) => {
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
    this.getStockNews();
  }

  hideNews(){
    this.newsLimit != 3 ? this.newsLimit = this.newsLimit - 3 : '';
    this.getStockNews();
  }

  hideAllNews(){
   this.newsLimit = 3;
    this.getStockNews();
  }
}
