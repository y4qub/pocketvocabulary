import { Component } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from 'firebase';
import { IonicPage, MenuController, ModalController } from 'ionic-angular';
import { BackendProvider } from '../../providers/backend/backend';
import { LanguageProvider } from '../../providers/language/language';

@IonicPage()
@Component({
  selector: 'page-vocabulary',
  templateUrl: 'vocabulary.html'
})
export class VocabularyPage {

  words1: Array<string>
  words2: Array<string>
  language: string
  user: User

  constructor(public languageProvider: LanguageProvider, public menuCtrl: MenuController, public textToSpeech: TextToSpeech, public backendProvider: BackendProvider, public storage: Storage, public modalCtrl: ModalController, public db: AngularFireDatabase, public auth: AngularFireAuth) {
  }

  async ionViewDidLoad() {
    this.menuCtrl.enable(true)
    this.auth.authState.subscribe((auth: User) => {
      this.user = auth
      this.languageProvider.getLanguage().subscribe(language => {
        this.language = language
        this.reloadDatabase()
      })
    })
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true)
  }

  async tts(word: string) {
    if (!this.menuCtrl.isAnimating()) {
      const speedOfSpeech = await this.storage.get('speedOfSpeech')
      this.textToSpeech.speak({ text: word, locale: this.language, rate: speedOfSpeech })
    }
  }

  openAddWord() {
    const modal = this.modalCtrl.create('AddWordPage')
    modal.onDidDismiss(saved => {
      if (saved) this.reloadDatabase()
    })
    modal.present()
  }

  async deleteWord(key: string) {
    await this.db.database.ref(`users/${this.user.uid}/languages/${this.language}/vocabulary/${key}`).remove()
    this.reloadDatabase()
  }

  async reloadDatabase() {
    const words = await this.backendProvider.fetchVocabulary()
    if (!words) return
    this.words1 = words.words1
    this.words2 = words.words2
  }

  contentTouch() {
    if (this.language && !this.words1 && !this.menuCtrl.isAnimating()) {
      this.openAddWord()
    }
  }

}