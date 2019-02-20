import { Component } from '@angular/core'
import { NavController, ModalController, MenuController, AlertController, IonicPage, ItemSliding } from 'ionic-angular'
import { AngularFireDatabase } from 'angularfire2/database'
import { AngularFireAuth } from 'angularfire2/auth'
import { NavParams } from 'ionic-angular/navigation/nav-params'
import { Storage } from '@ionic/storage'
import { LanguageProvider } from '../../providers/language/language';
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
  constructor(public translate: TranslateService, public menuCtrl: MenuController, public textToSpeech: TextToSpeech, public languageProvider: LanguageProvider, public storage: Storage, public menu: MenuController, public modalCtrl: ModalController, public navCtrl: NavController, public db: AngularFireDatabase, public auth: AngularFireAuth, public navParams: NavParams, public alertCtrl: AlertController) {
    this.auth.authState.subscribe((auth: User) => {
      this.user = auth
    })
  }

  ionViewDidLoad() {
    // Get Language
    if (Object.keys(this.navParams.data).length) {
      this.language = this.navParams.data
      this.reloadDatabase()
    }
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
    this.languageProvider.fetchWords(this.language, (words1, words2) => {
      this.words1 = words1
      this.words2 = words2
    })
  }

  reset() {
    this.words1 = null
    this.words2 = null
  }

  editWord(key: string, oldValue: string, item: ItemSliding) {
    this.alertCtrl.create({
      title: `${this.translate.instant('edit')} ${key.bold()}`,
      cssClass: 'alertDark',
      inputs: [
        {
          name: 'word',
          value: oldValue,
          id: 'alert-input'
        }
      ],
      buttons: [
        {
          text: this.translate.instant('cancel'),
          role: 'cancel'
        },
        {
          text: this.translate.instant('edit'),
          handler: data => {
            if (!this.user || !data.word) return
            var newObj = {}
            newObj[key] = data.word
            this.db.database.ref(`users/${this.user.uid}/languages/${this.language}/vocabulary`).update(newObj).then(() => {
              // Reload the vocabulary list
              this.reloadDatabase()
            })
          }
        }
      ]
    }).present().then(() => {
      // Focus
      const firstInput: any = document.querySelector('ion-alert input')
      firstInput.focus()
      item.close()
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
