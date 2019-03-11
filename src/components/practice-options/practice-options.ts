import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Storage } from '@ionic/storage';
import { PracticeOptions } from '../../interfaces';
import { BackendProvider } from '../../providers/backend/backend';
import { LanguageProvider } from '../../providers/language/language';
import { PracticeProvider } from '../../providers/practice/practice';

@Component({
  selector: 'practice-options',
  templateUrl: 'practice-options.html'
})
export class PracticeOptionsComponent implements OnInit {

  selectOptions = { cssClass: 'alertDark' }
  practiceOptions: PracticeOptions
  language: string
  currentLanguage: string
  @Output('start') onStart: EventEmitter<any>

  constructor(public storage: Storage, public backendProvider: BackendProvider, public languageProvider: LanguageProvider, public practiceProvider: PracticeProvider) {
    this.onStart = new EventEmitter()
    this.backendProvider.getLanguage().subscribe(language => this.language = language)
    this.setCurrentLanguage()
  }

  async ngOnInit() {
    this.practiceOptions = await this.practiceProvider.getPracticeOptions()
  }

  async start() {
    //this.practiceProvider.setPracticeOptions(this.practiceOptions)
    this.onStart.emit(this.practiceOptions)
  }

  async setCurrentLanguage() {
    const languageCode = await this.storage.get('appLanguage')
    this.currentLanguage = await this.languageProvider.getLanguageName(languageCode)
  }

}
