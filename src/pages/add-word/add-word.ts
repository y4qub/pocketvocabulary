import { Component, ViewChild } from '@angular/core'
import { NavParams, TextInput, IonicPage, Platform } from 'ionic-angular'
import { ViewController } from 'ionic-angular/navigation/view-controller'
import { AngularFireDatabase } from 'angularfire2/database'
import { AngularFireAuth } from 'angularfire2/auth'
import { LanguageProvider } from '../../providers/language/language'
import { ToastController } from 'ionic-angular'
import { User } from 'firebase'
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage'

@IonicPage()
@Component({
  selector: 'page-add-word',
  templateUrl: 'add-word.html',
})
export class AddWordPage {
  @ViewChild('wordInput') wordInput: TextInput
  word: string
  translation: string
  wordPlaceholder
  translationPlaceholder
  languageCode: string
  translateTimeout: number = 1100
  user: User
  language: string
  constructor(public storage: Storage, public translateService: TranslateService, public platform: Platform, private toastCtrl: ToastController, public navParams: NavParams, public viewCtrl: ViewController, public auth: AngularFireAuth, public db: AngularFireDatabase, public languages: LanguageProvider) {
    this.auth.authState.subscribe((auth: User) => {
      this.user = auth
    })
    this.language = this.navParams.get('language')
    this.languages.getLanguageCode(this.language).then((languageCode: string) => this.languageCode = languageCode)
  }

  ionViewDidEnter() {
    setTimeout(() => {
      if (this.wordInput) this.wordInput.setFocus(), 150
    })
  }

  addWord() {
    if (!this.user) return
    let obj = {}
    this.word = this.word.toLowerCase()
    obj[this.word] = this.translation.toLowerCase()
    this.db.database.ref(`users/${this.user.uid}/languages/${this.language}/vocabulary`).update(obj)
    this.viewCtrl.dismiss(obj)
  }

  autoTranslate(type: string) {
    const language1 = this.translateService.currentLang
    const language2 = this.languageCode
    if (type == 'word') {
      this.translate(language1, language2, 'translation').then((result: string) => this.word = result.toLowerCase())
    } else {
      this.translate(language2, language1, 'word').then((result: string) => this.translation = result.toLowerCase())
    }
  }

  translate(from, to, type) {
    return new Promise((resolve, reject) => {
      const word = type == 'word' ? this.word : this.translation
      if (!word || word == '') return reject('empty')
      fetch(`https://translation.googleapis.com/language/translate/v2?key=AIzaSyCPYSlzENcbt-HGhNJBV-9KFE5PB8z1vYA&q=${encodeURI(type == 'word' ? this.word : this.translation)}&source${from}=&target=${to}&format=text`).then(resp => resp.json()).then(data => {
        resolve(data['data'].translations[0].translatedText)
      }).catch(console.error)
    })
  }

  showTooltip() {
    this.toastCtrl.create({
      message: 'After you enter the base word or translation, the second word will be automatically translated. Turn off if you prefer to enter your own translation.',
      duration: 7000,
      position: 'middle'
    }).present()
  }

}