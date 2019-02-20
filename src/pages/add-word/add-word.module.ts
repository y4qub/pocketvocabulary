import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddWordPage } from './add-word';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../app/app.module';
import { HttpClient } from '@angular/common/http';

@NgModule({
    declarations: [AddWordPage],
    imports: [IonicPageModule.forChild(AddWordPage), TranslateModule.forChild({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })],
})
export class AddWordPageModule { }