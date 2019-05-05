import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Storage } from '@ionic/storage';
import { PracticeOptions } from '../../interfaces';
import { BackendProvider } from '../../providers/backend/backend';
import { LanguageProvider } from '../../providers/language/language';
import { PracticeProvider } from '../../providers/practice/practice';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'practice-options',
  templateUrl: 'practice-options.html'
})
export class PracticeOptionsComponent implements OnInit {

  selectOptions = { cssClass: 'alertDark' }
  practiceOptions: PracticeOptions
  language: string
  currentLanguage: string
  @Output('start') onStart: EventEmitter<any> = new EventEmitter()
  observable

  constructor(public auth: AngularFireAuth, public db: AngularFireDatabase, public storage: Storage, public backendProvider: BackendProvider, public languageProvider: LanguageProvider, public practiceProvider: PracticeProvider) {

    this.languageProvider.getLanguage().subscribe(language => {
      this.language = language
    })

    this.setCurrentLanguage()

  }

  async ngOnInit() {

    this.practiceOptions = await this.practiceProvider.getPracticeOptions()

  }

  ngOnDestroy() {
    this.observable.unsubscribe()
  }

  async start() {

    //this.practiceProvider.setPracticeOptions(this.practiceOptions)
    this.onStart.emit(this.practiceOptions)

  }

  async setCurrentLanguage() {

    this.auth.authState.subscribe(user => {

      if (!user) return

      this.observable = this.backendProvider.getAppLanguage().subscribe((languageCode: string) => {
        this.languageProvider.getLanguageName(languageCode).then(name => {
          this.currentLanguage = name
        })
      })

    })

  }

}
