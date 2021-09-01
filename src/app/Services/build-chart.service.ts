import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuildChartService {

  private chartData = new BehaviorSubject<any>([]);
  currnetChartData = this.chartData.asObservable();
  xy = {};
  arrXY: any[] = [];
  
  constructor(private http: HttpClient) {}

  get(URL: string, Time: string) {
    this.arrXY = [];
    this.http.get(URL).subscribe((res: any) => {
      let stockChartXValues: string[] = [];
      let stockChartOpenValues: string[] = [];
      let stockChartHighValues: string[] = [];
      let stockChartLowValues: string[] = [];
      let stockChartCloseValues: string[] = [];

      for (var key in res[Time]) {
        stockChartXValues.push(key); //? The dates
        stockChartOpenValues.push(res[Time][key]['1. open']); //? The open prices
        stockChartHighValues.push(res[Time][key]['2. high']); //? The high prices
        stockChartLowValues.push(res[Time][key]['3. low']); //? The low prices
        stockChartCloseValues.push(res[Time][key]['4. close']); //? The close prices
      }
      let i = 0;
      stockChartXValues.map((item) => {
        let temp = {
          x: stockChartXValues[i],
          y: [
            stockChartCloseValues[i],
            stockChartHighValues[i],
            stockChartLowValues[i],
            stockChartOpenValues[i],
          ],
        };
        this.arrXY.push(temp);
        i++;
      });
    });
    this.chartData.next(this.arrXY);
    console.log(this.arrXY);
    
  }
}
