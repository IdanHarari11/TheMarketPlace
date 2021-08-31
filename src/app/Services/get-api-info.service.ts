import { StockDetailsTwo } from '../models/stock-details-two';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GetApiInfoService {
  StockSymbol: string[] = ['MSFT'];
  APIkey: string = 'c4lv5h2ad3icjh0e8bmg';
  APIcall: string = `https://finnhub.io/api/v1/company-news?symbol=${this.StockSymbol}&from=2021-03-01&to=2021-03-09&token=${this.APIkey}`;
  
  constructor(private infoServ: HttpClient) {   }
  getStockNews(): Observable<any>{
    return this.infoServ.get<any>(`https://finnhub.io/api/v1/company-news?symbol=${this.StockSymbol}&from=2021-03-01&to=2021-08-27&token=${this.APIkey}`);
  }
  
  getDeatils(): Observable<any>{
    return this.infoServ.get<any>(`https://finnhub.io/api/v1/stock/profile2?symbol=${this.StockSymbol}&token=${this.APIkey}`);
  }

  getDeatils2(symbol: string): Observable<StockDetailsTwo>{
    return this.infoServ.get<StockDetailsTwo>(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${this.APIkey}`);
  }

  // getDeatils2(symbol: string): Promise<StockDetailsTwo>{
  //   return new Promise((resolve, reject)=>{
  //     this.infoServ.get<StockDetailsTwo>(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${this.APIkey}`).subscribe(res=>{
  //       resolve(res);
  //     },
  //     err=>{
  //       reject(err);
  //     });
  //   });
  // }

  getStockPrices(): Observable<any>{
    return this.infoServ.get<any>(`https://finnhub.io/api/v1/quote?symbol=${this.StockSymbol}&token=${this.APIkey}`)
  } 
}

//export class 