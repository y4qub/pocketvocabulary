import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../app/app.module';
import { HttpClient } from '@angular/common/http';
import { DataRequestPage } from './data-request';

@NgModule({
  declarations: [DataRequestPage],
  imports: [IonicPageModule.forChild(DataRequestPage), TranslateModule.forChild({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    }
  })],
  providers: []
})
export class DataRequestPageModule { }