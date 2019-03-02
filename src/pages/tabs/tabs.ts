import { Component } from '@angular/core'
import { NavParams, IonicPage } from 'ionic-angular'

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  vocabularyPage = 'VocabularyPage'
  practicePage = 'PracticePage'
  profilePage = 'ProfilePage'
  language: string
  constructor(public navParams: NavParams) {
    this.language = this.navParams.get('language')
  }

}
