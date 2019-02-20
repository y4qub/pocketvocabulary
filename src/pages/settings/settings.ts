import { Component } from '@angular/core'
import { ViewController, AlertController, IonicPage, Platform, ModalController } from 'ionic-angular'
import { AngularFireDatabase } from 'angularfire2/database'
import { AngularFireAuth } from 'angularfire2/auth'
import { User } from 'firebase'
import { DateProvider } from '../../providers/date/date';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage'

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})

export class SettingsPage {
  wordsToPractice: number
  wordsToPracticeOriginal: number
  timedPracticeInterval: number
  timedPracticeIntervalOriginal: number
  app_language: string
  speedOfSpeech: string
  speedOfSpeechOriginal: string
  selectOptions = { cssClass: 'alertDark' }
  languages = [{ "code": "cs", "name": "Czech", "nativeName": "česky, čeština" }, { "code": "en", "name": "English", "nativeName": "English" }]
  user: User
  constructor(public modalCtrl: ModalController, public storage: Storage, public translate: TranslateService, public date: DateProvider, public platform: Platform, public viewCtrl: ViewController, public alertCtrl: AlertController, public auth: AngularFireAuth, public db: AngularFireDatabase) {
    this.storage.get('speedOfSpeech').then(value => {
      if (value) {
        this.speedOfSpeech = this.speedOfSpeechOriginal = value
      } else {
        this.speedOfSpeech = '1.3'
      }
    })
    this.app_language = this.translate.currentLang
    this.auth.authState.subscribe((auth: User) => {
      this.user = auth
      if (!this.user) return
      this.db.database.ref(`users/${auth.uid}/info`).once('value').then(data => {
        const snapshot = data.val()
        if (!snapshot) return
        if (snapshot['wordsToPractice']) this.wordsToPractice = this.wordsToPracticeOriginal = snapshot['wordsToPractice']
        if (snapshot['timedPracticeInterval']) this.timedPracticeInterval = this.timedPracticeIntervalOriginal = snapshot['timedPracticeInterval']
      })
    })
  }
  
  dismiss() {
    if (this.wordsToPracticeOriginal == this.wordsToPractice && this.timedPracticeIntervalOriginal == this.timedPracticeInterval && this.translate.currentLang == this.app_language && this.speedOfSpeech == this.speedOfSpeechOriginal) {
      this.viewCtrl.dismiss()
    } else {
      this.alertCtrl.create({
        title: this.translate.instant('do_you_want_to_discard_any_changes'),
        cssClass: 'alertDark',
        buttons: [
          {
            text: this.translate.instant('discard'),
            cssClass: this.platform.is('ios') ? 'ios-delete-btn' : null,
            handler: () => {
              this.viewCtrl.dismiss()
            }
          },
          {
            text: this.translate.instant('keep_editing'),
            role: 'cancel',
            cssClass: this.platform.is('ios') ? 'ios-cancel-btn' : null
          }
        ]
      }).present()
    }
  }

  done() {
    if (!this.user) return
    this.db.database.ref(`users/${this.user.uid}/info`).update({ wordsToPractice: this.wordsToPractice, timedPracticeInterval: this.timedPracticeInterval }).catch(console.error)
    // Language Change
    if (this.app_language != this.translate.currentLang) {
      this.translate.use(this.app_language)
      this.translate.setDefaultLang(this.app_language)
      this.storage.set('app_language', this.app_language)
    }
    // Speed of Speech Change
    if (this.speedOfSpeechOriginal != this.speedOfSpeech) {
      this.storage.set('speedOfSpeech', parseFloat(this.speedOfSpeech))
    }
    this.viewCtrl.dismiss()
  }

  openDeleteAlert() {
    this.alertCtrl.create({
      title: this.translate.instant('are_you_sure_you_want_to_delete_your_account'),
      subTitle: this.translate.instant('this_will_irreversibly_erase_all_of_your_data'),
      cssClass: 'alertDark',
      buttons: [
        {
          text: this.translate.instant('no'),
          role: 'cancel',
          cssClass: this.platform.is('ios') ? 'ios-cancel-btn' : null,
        },
        {
          text: this.translate.instant('yes'),
          cssClass: this.platform.is('ios') ? 'ios-delete-btn' : null,
          handler: () => {
            if (!this.user) return
            this.db.database.ref(`users/${this.user.uid}`).remove().then(() => this.auth.auth.currentUser.delete()).then(() => this.auth.auth.signOut())
          }
        }
      ]
    }).present()
  }

  getOrEditData() {
      this.modalCtrl.create('DataRequestPage').present().catch(console.error)
  }

}