import { Component } from '@angular/core'
import { ModalController, MenuController, AlertController, Platform, IonicPage } from 'ionic-angular'
import { AngularFireAuth } from 'angularfire2/auth'
import { NavParams } from 'ionic-angular/navigation/nav-params'
import { AngularFireDatabase } from 'angularfire2/database'
import { TranslateService } from '@ngx-translate/core'
import { User } from 'firebase'

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  error: string
  streak: number = 0
  savedWords = 0
  practicedWords: number
  wordsToPractice: number
  user: User
  constructor(public translate: TranslateService, public platform: Platform, public auth: AngularFireAuth, public navParams: NavParams, public db: AngularFireDatabase, public modalCtrl: ModalController, public menu: MenuController, public alert: AlertController) {
    this.auth.authState.subscribe((auth: User) => {
      this.user = auth
    })
  }

  ionViewDidLoad() {
    if (!this.user) return
    this.db.database.ref(`users/${this.user.uid}`).once('value').then(data => {
      const snapshot = data.val()
      if (snapshot['info']) var info = snapshot['info']
      if (snapshot['languages']) var languages = snapshot['languages']
      this.streak = info['streak']
      this.practicedWords = info['practicedWords']
      if (info['wordsToPractice']) this.wordsToPractice = info['wordsToPractice']
      this.savedWords = 0
      Object.keys(languages).forEach(element => {
        if (!languages[element]['vocabulary']) return
        this.savedWords += Object.keys(languages[element]['vocabulary']).length
      })
    }).catch(console.error)
  }

  ionViewDidEnter() {
    this.menu.enable(false)
  }

  ionViewDidLeave() {
    this.menu.enable(true)
  }

  logout() {
    this.alert.create({
      title: this.translate.instant('do_you_really_want_to_log_out'),
      cssClass: 'alertDark',
      buttons: [
        {
          text: this.translate.instant('cancel'),
          role: 'cancel',
          cssClass: this.platform.is('ios') ? 'ios-cancel-btn' : null,
        },
        {
          text: this.translate.instant('log_out'),
          cssClass: this.platform.is('ios') ? 'ios-delete-btn' : null,
          handler: () => {
            this.auth.auth.signOut()
          }
        },
      ]
    }).present()
  }

  openSettings() {
    this.modalCtrl.create('SettingsPage').present()
  }
}
