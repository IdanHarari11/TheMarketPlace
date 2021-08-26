import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {

  temp: any;
  timestamp!: any[];
  correcttime: any = [];
  close!: any[];
  high!: any[];
  low!: any[];
  open!: any[];
  volume!: any[];
  APIdata: any;
  // data = {close: this.close, high: this.high, low: this.low, open: this.open};
  dataa = [[]]

  constructor(private http: HttpClient) { }

    getAll(): Observable<any>{
      let headers = {
      'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
      'x-rapidapi-key': '7b48f64282msh2b52ee894cd5c9ep18cb6ejsn525815f1ee0a'
    };

    return this.http.get<any>('https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-chart?interval=1d&symbol=TSLA&range=3mo&region=US', { headers });

    // get-profile?symbol

    // this.http.get<any>('https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-profile?symbol=TSLA', { headers })
    //   .subscribe((data) => {this.APIdata = data});

    //  get chart data for Tesla ------------------------------------------------------------------------------------------------------
    
    }
}
