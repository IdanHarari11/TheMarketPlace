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
  getNews(): Observable<any>{
    return this.infoServ.get<any>(`https://finnhub.io/api/v1/company-news?symbol=${this.StockSymbol}&from=2021-03-01&to=2021-08-27&token=${this.APIkey}`);
  }
  
  getDeatils(): Observable<any>{
    return this.infoServ.get<any>(`https://finnhub.io/api/v1/stock/profile2?symbol=${this.StockSymbol}&token=${this.APIkey}`);
  }

  getPrices(): Observable<any>{
    return this.infoServ.get<any>(`https://finnhub.io/api/v1/quote?symbol=${this.StockSymbol}&token=${this.APIkey}`)
  } 
}
