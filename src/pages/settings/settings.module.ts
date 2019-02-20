import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsPage } from './settings';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../app/app.module';
import { HttpClient } from '@angular/common/http';
import { LanguageProvider } from '../../providers/language/language';

@NgModule({
  declarations: [SettingsPage],
  imports: [IonicPageModule.forChild(SettingsPage), TranslateModule.forChild({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    }
  })],
  providers: [LanguageProvider]
})
export class SettingsPageModule { }