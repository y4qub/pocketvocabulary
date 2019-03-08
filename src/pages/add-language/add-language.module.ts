import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { HttpLoaderFactory } from '../../app/app.module';
import { AddLanguagePage } from './add-language';

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