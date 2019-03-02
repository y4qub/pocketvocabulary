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
  savedWords = 0
  user: User
  constructor(public alertCtrl: AlertController, public translate: TranslateService, public platform: Platform, public auth: AngularFireAuth, public navParams: NavParams, public db: AngularFireDatabase, public modalCtrl: ModalController, public menuCtrl: MenuController) {
    this.auth.authState.subscribe((auth: User) => {
      this.user = auth
    })
  }

  ionViewDidLoad() {
    if (!this.user) return
    this.db.database.ref(`users/${this.user.uid}`).once('value').then(data => {
      const snapshot = data.val()
      if (snapshot['languages']) var languages = snapshot['languages']
      this.savedWords = 0
      Object.keys(languages).forEach(element => {
        if (!languages[element]['vocabulary']) return
        this.savedWords += Object.keys(languages[element]['vocabulary']).length
      })
    }).catch(console.error)
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false)
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(true)
  }

  logout() {
    this.alertCtrl.create({
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

  getOrEditData() {
    this.modalCtrl.create('DataRequestPage').present()
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
            this.db.database.ref(`users/${this.user.uid}`).remove().then(() => this.auth.auth.currentUser.delete()).then(() => this.auth.auth.signOut()).catch(console.error)
          }
        }
      ]
    }).present()
  }

}
