import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForgotpasswordPage } from './forgotpassword';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../app/app.module';
import { HttpClient } from '@angular/common/http';

@NgModule({
    declarations: [ForgotpasswordPage],
    imports: [IonicPageModule.forChild(ForgotpasswordPage), TranslateModule.forChild({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })],
})
export class ForgotpasswordPageModule { }