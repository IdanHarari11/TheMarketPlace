import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MainComponent } from './Components/main/main.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GetApiInfoService } from './Services/get-api-info.service';

@NgModule({
  declarations: [AppComponent, MainComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgApexchartsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [GetApiInfoService],
  bootstrap: [AppComponent],
})
export class AppModule {}
