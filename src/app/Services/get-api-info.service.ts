import { News } from './../models/news';
import { StockDetails } from '../models/stock-details';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GetApiInfoService {
  StockSymbol: string[] = ['MSFT'];
  APIkey: string = 'c4lv5h2ad3icjh0e8bmg';
  
  constructor(private infoServ: HttpClient) {   }
  getStockNews(): Observable<News[]>{
    return this.infoServ.get<News[]>(`https://finnhub.io/api/v1/company-news?symbol=${this.StockSymbol}&from=2021-03-01&to=2021-08-27&token=${this.APIkey}`);
  }
  
  getDetails(): Observable<StockDetails>{
    return this.infoServ.get<StockDetails>(`https://finnhub.io/api/v1/stock/profile2?symbol=${this.StockSymbol}&token=${this.APIkey}`);
  }

  getDetails2(symbol: string): Observable<StockDetails>{
    return this.infoServ.get<StockDetails>(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${this.APIkey}`);
  }

  // getDetails2(symbol: string): Promise<StockDetailsTwo>{
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