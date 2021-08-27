import { ApexAxisChartSeries, ApexChart, ApexTitleSubtitle, ApexXAxis, ApexYAxis } from "ng-apexcharts";

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  chartOptions: any;
}
