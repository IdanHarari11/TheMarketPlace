import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {
  APIdata: any;
  temp: any;
  timestamp!: number[];
  correcttime: any = [];
  close!: number[];
  high!: number[];
  low!: number[];
  open!: number[];
  // volume!: number[];
  data = {timestamp: this.timestamp, close: this.close, high: this.high, low: this.low, open: this.open};

  constructor(private http: HttpClient) { }

  getData(){
    let headers = {
      'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
      'x-rapidapi-key': '50d5358e85msh4416386068d1a4fp1e99c9jsn0e4e4884323e',
    };
    
    // Get-profile?symbol
    this.http
      .get<any>(
        'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-profile?symbol=TSLA',
        { headers }
      )
      .subscribe((data) => {
        this.APIdata = data;
        // console.log(this.APIdata);
      });

    //  Get chart data for Tesla ------------------------------------------------------------------------------------------------------
    headers = {
      'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
      'x-rapidapi-key': '7b48f64282msh2b52ee894cd5c9ep18cb6ejsn525815f1ee0a',
    };
    // Get-profile?symbol
    this.http
      .get<any>(
        'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-chart?interval=1d&symbol=TSLA&range=3mo&region=US',
        { headers }
      )
      .subscribe((data) => {
        // console.log(data);

        // Any 'this.'var' get X(number) parameters from the API for the 'var' for the time
        this.timestamp = data.chart.result[0].timestamp;
        this.close = data.chart.result[0].indicators.quote[0].close;
        this.high = data.chart.result[0].indicators.quote[0].high;
        this.low = data.chart.result[0].indicators.quote[0].low;
        this.open = data.chart.result[0].indicators.quote[0].open;
        // this.volume = data.chart.result[0].indicators.quote[0].volume;
        this.data.timestamp = this.timestamp;
        this.data.close = this.close;
        this.data.high = this.high;
        this.data.low = this.low;
        this.data.open = this.open;
        console.log(this.data);
      });
  }
  getd() {
    this.getData()
    return this.data;
  }
}
