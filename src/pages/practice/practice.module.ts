import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { HttpLoaderFactory } from '../../app/app.module';
import { ComponentsModule } from '../../components/components.module';
import { PracticePage } from './practice';

@NgModule({
  declarations: [PracticePage],
  imports: [IonicPageModule.forChild(PracticePage), TranslateModule.forChild({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    }
  }),
    ComponentsModule
  ]
})
export class PracticePageModule { }