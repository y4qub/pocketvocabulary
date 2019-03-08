import { Component } from '@angular/core'
import { ModalController, MenuController, AlertController, IonicPage } from 'ionic-angular'
import { AngularFireDatabase } from 'angularfire2/database'
import { AngularFireAuth } from 'angularfire2/auth'
import { NavParams } from 'ionic-angular/navigation/nav-params'
import { Storage } from '@ionic/storage'
import { BackendProvider } from '../../providers/backend/backend'
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { User } from 'firebase'
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-vocabulary',
  templateUrl: 'vocabulary.html'
})
export class VocabularyPage {
  words1: Array<string>
  words2: Array<string>
  language: string
  speedOfSpeech: any
  user: User
  constructor(public translate: TranslateService, public menuCtrl: MenuController, public textToSpeech: TextToSpeech, public backendProvider: BackendProvider, public storage: Storage, public menu: MenuController, public modalCtrl: ModalController, public db: AngularFireDatabase, public auth: AngularFireAuth, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.auth.authState.subscribe((auth: User) => {
      this.user = auth
      // Get Language
      if (Object.keys(this.navParams.data).length) {
        this.language = this.navParams.data
        this.reloadDatabase()
      }
    })
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true)
    this.storage.get('speedOfSpeech').then(value => this.speedOfSpeech = value)
  }

  tts(word: string) {
    if (!this.menu.isAnimating())
      this.textToSpeech.speak({ text: word, locale: this.language, rate: this.speedOfSpeech })
  }

  openAddWord() {
    let modal = this.modalCtrl.create('AddWordPage', { language: this.language })
    modal.onDidDismiss(saved => {
      if (saved)
        this.reloadDatabase()
    })
    modal.present()
  }

  deleteWord(key: string) {
    if (!this.user) return
    this.db.database.ref(`users/${this.user.uid}/languages/${this.language}/vocabulary/${key}`).remove().then(() => {
      // Reload the vocabulary list
      this.reloadDatabase()
    })
  }

  reloadDatabase() {
    this.backendProvider.fetchWords(this.language, (words1, words2) => {
      this.words1 = words1
      this.words2 = words2
    })
  }

  contentTouch() {
    if (!this.language && !this.words1 && !this.menu.isAnimating()) {
      // No language
      this.menu.open()
    } else if (this.language && !this.words1 && !this.menu.isAnimating()) {
      // No words
      this.openAddWord()
    }
  }

}