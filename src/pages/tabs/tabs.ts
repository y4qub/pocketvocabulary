import { Component, OnInit } from '@angular/core'
import { NavParams, IonicPage } from 'ionic-angular'

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit {
  vocabularyPage = 'VocabularyPage'
  practicePage = 'PracticePage'
  profilePage = 'ProfilePage'
  language: string
  constructor(public navParams: NavParams) {
    
  }

  ngOnInit() {
    this.language = this.navParams.get('language')
  }

}
