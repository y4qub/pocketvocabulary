import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VocabularyPage } from './vocabulary';
import { TextToSpeech } from '@ionic-native/text-to-speech'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../../app/app.module';

@NgModule({
  declarations: [VocabularyPage],
  imports: [IonicPageModule.forChild(VocabularyPage), TranslateModule.forChild({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    }
  })
],
  providers: [TextToSpeech]
})
export class VocabularyPageModule { }