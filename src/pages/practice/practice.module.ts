import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PracticePage } from './practice';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../../app/app.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { InputComponent } from '../../components/input/input';
import { OptionsComponent } from '../../components/options/options';

@NgModule({
  declarations: [PracticePage, InputComponent, OptionsComponent],
  imports: [IonicPageModule.forChild(PracticePage), TranslateModule.forChild({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    }
  })
]
})
export class PracticePageModule { }