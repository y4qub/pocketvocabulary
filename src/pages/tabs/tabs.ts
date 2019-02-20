import { Component, ViewChild } from '@angular/core'
import { NavParams, Platform, Tabs, IonicPage } from 'ionic-angular'
import { Storage } from '@ionic/storage'

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  vocabularyPage = 'VocabularyPage'
  practicePage = 'PracticePage'
  profilePage = 'ProfilePage'
  language: string
  @ViewChild('tabs') tabs: Tabs
  constructor(public platform: Platform, public navParams: NavParams, public storage: Storage) {
    this.language = this.navParams.get('language')
  }

}
