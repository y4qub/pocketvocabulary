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
  constructor(public storage: Storage, public translate: TranslateService, public date: DateProvider, public platform: Platform, public viewCtrl: ViewController, public alertCtrl: AlertController, public auth: AngularFireAuth, public db: AngularFireDatabase) {
    this.storage.get('speedOfSpeech').then(value => {
      if (value) {
        this.speedOfSpeech = this.speedOfSpeechOriginal = value
      } else {
        this.speedOfSpeech = '1.3'
      }
    })
  }

  dismiss() {
    if (this.speedOfSpeech == this.speedOfSpeechOriginal) {
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
    if (this.speedOfSpeechOriginal != this.speedOfSpeech)
      this.storage.set('speedOfSpeech', parseFloat(this.speedOfSpeech))
    this.viewCtrl.dismiss()
  }

}