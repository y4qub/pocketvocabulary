import { Component } from '@angular/core'
import { ViewController, AlertController, IonicPage, Platform } from 'ionic-angular'
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
  speedOfSpeech: string
  speedOfSpeechOriginal: string
  selectOptions = { cssClass: 'alertDark' }
  user: User
  appLanguage: string
  languages = [{ "code": "cs", "name": "Czech", "nativeName": "česky, čeština" }, { "code": "en", "name": "English", "nativeName": "English" }]
  constructor(public storage: Storage, public translate: TranslateService, public date: DateProvider, public platform: Platform, public viewCtrl: ViewController, public alertCtrl: AlertController, public auth: AngularFireAuth, public db: AngularFireDatabase) {

  }

  ionViewDidLoad() {
    this.appLanguage = this.translate.currentLang
    this.storage.get('speedOfSpeech').then(value => {
      if (value) {
        this.speedOfSpeech = this.speedOfSpeechOriginal = value
      } else {
        this.speedOfSpeech = '1.3'
      }
    })
  }

  dismiss() {
    if (this.speedOfSpeech == this.speedOfSpeechOriginal && this.translate.currentLang == this.appLanguage) {
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
    // Language Change
    if (this.appLanguage != this.translate.currentLang) {
      this.translate.use(this.appLanguage)
      this.translate.setDefaultLang(this.appLanguage)
      //this.storage.set('appLanguage', this.appLanguage)
      this.auth.authState.subscribe(user => {
        if (!user) return
        this.db.object(`users/${user.uid}/info`).update({appLanguage: this.appLanguage})
      })
    }
    if (this.speedOfSpeechOriginal != this.speedOfSpeech)
      this.storage.set('speedOfSpeech', parseFloat(this.speedOfSpeech))
    this.viewCtrl.dismiss()
  }

}