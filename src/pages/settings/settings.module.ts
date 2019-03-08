import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { HttpLoaderFactory } from '../../app/app.module';
import { SettingsPage } from './settings';

@NgModule({
  declarations: [SettingsPage],
  imports: [IonicPageModule.forChild(SettingsPage), TranslateModule.forChild({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    }
  })],
  providers: []
})
export class SettingsPageModule { }