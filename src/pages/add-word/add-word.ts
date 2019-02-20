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

/**
 * Generated class for the AddWordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-word',
  templateUrl: 'add-word.html',
})
export class AddWordPage {
  @ViewChild('wordInput') wordInput: TextInput
  word: string
  translation: string
  timeout
  wordPlaceholder = this.translateService.instant('word')
  translationPlaceholder = this.translateService.instant('translation')
  languageCode: string
  translateTimeout: number = 1400
  autoTranslate: boolean
  user: User
  language: string
  constructor(public stoarge: Storage, public translateService: TranslateService, public platform: Platform, private toastCtrl: ToastController, public navParams: NavParams, public viewCtrl: ViewController, public auth: AngularFireAuth, public db: AngularFireDatabase, public languages: LanguageProvider) {
    this.auth.authState.subscribe((auth: User) => {
      this.user = auth
    })
    // Check Auto-Translate
    this.stoarge.get('auto_translate').then(value => {
      if (value) this.autoTranslate = true
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
    obj[this.word] = this.translation
    this.db.database.ref(`users/${this.user.uid}/languages/${this.language}/vocabulary`).update(obj)
    this.viewCtrl.dismiss(obj)
  }

  autoTranslateToggle() {
    if (this.word && !this.translation) this.wordChange()
    if (!this.word && this.translation) this.translationChange()
    if (this.word && this.translation && !this.autoTranslate) {
      this.translationPlaceholder = this.translateService.instant('translation')
      this.wordPlaceholder = this.translateService.instant('word')
    }
    // Remember
    this.stoarge.set('auto_translate', this.autoTranslate)
  }

  wordChange() {
    if (!this.autoTranslate) return
    if (this.word == '') {
      this.translation = ''
      // Change back the placeholder if there's no word for translation
      this.translationPlaceholder = this.translateService.instant('translation')
    } else {
      // Show the placeholder if currently translating
      this.translationPlaceholder = this.translateService.instant('translating')
    }
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      // Convert the language name to the proper language code
      this.translate(this.languageCode, this.translateService.currentLang, 'word').then((translation: string) => this.translation = translation).catch(console.error)
    }, this.translateTimeout)
  }

  translationChange() {
    if (!this.autoTranslate) return
    if (this.translation == '') {
      this.word = ''
      // Change back the placeholder if there's no word for translation
      this.wordPlaceholder = this.translateService.instant('word')
    } else {
      // Show the placeholder if currently translating
      this.wordPlaceholder = this.translateService.instant('translating')
    }
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      // Convert the language name to the proper language code
      this.translate(this.translateService.currentLang, this.languageCode, 'translation').then((translation: string) => this.word = translation).catch(console.error)
    }, this.translateTimeout)
  }

  translate(from, to, type) {
    return new Promise((resolve, reject) => {
      const word = type == 'word' ? this.word : this.translation
      if (!word || word == '') return reject('empty')
      // Old way: https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURI(type == 'word' ? this.word : this.translation)}
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