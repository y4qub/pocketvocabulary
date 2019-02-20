import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddLanguagePage } from './add-language';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../app/app.module';
import { HttpClient } from '@angular/common/http';

@NgModule({
    declarations: [AddLanguagePage],
    imports: [IonicPageModule.forChild(AddLanguagePage), TranslateModule.forChild({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })],
})
export class AddLanguagePageModule { }