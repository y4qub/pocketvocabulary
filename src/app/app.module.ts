import { NgModule, ErrorHandler, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AngularFireModule } from 'angularfire2'
import { HttpModule } from '@angular/http';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LanguageProvider } from '../providers/language/language';
import { ScreenOrientation } from '@ionic-native/screen-orientation'
import { IonicStorageModule } from '@ionic/storage';
import { Globalization } from '@ionic-native/globalization'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DateProvider } from '../providers/date/date';
import { StreakProvider } from '../providers/streak/streak';
import { Clipboard } from '@ionic-native/clipboard'
import { FileTransfer } from '@ionic-native/file-transfer'
import { GooglePlus } from '@ionic-native/google-plus'

const firebaseConfig = {
  apiKey: "AIzaSyBjxUNBy7DvTlaxQtOzTahAJOX2mAj16vI",
  authDomain: "vocabulaire-1f3c2.firebaseapp.com",
  databaseURL: "https://vocabulaire-1f3c2.firebaseio.com",
  projectId: "vocabulaire-1f3c2",
  storageBucket: "vocabulaire-1f3c2.appspot.com",
  messagingSenderId: "71486533817"
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false,
      preloadModules: true
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    HttpModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ScreenOrientation,
    LanguageProvider,
    Globalization,
    DateProvider,
    StreakProvider,
    Clipboard,
    FileTransfer,
    GooglePlus
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
