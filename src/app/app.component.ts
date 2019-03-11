import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Globalization } from '@ionic-native/globalization';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from 'firebase';
import { ActionSheetController, AlertController, MenuController, NavController, Platform } from 'ionic-angular';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { UserInfo } from '../interfaces';
import { BackendProvider } from '../providers/backend/backend';
import { DateProvider } from '../providers/date/date';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  languages: Array<string>
  editMode: boolean = false
  myForm: FormGroup
  selectedLanguage: string
  user: User
  defaultUserInfo: UserInfo
  @ViewChild('nav') nav: NavController
  constructor(public actionSheetCtrl: ActionSheetController, public date: DateProvider, public translate: TranslateService, public globalization: Globalization, public backendProvider: BackendProvider, public storage: Storage, public screenOrientation: ScreenOrientation, public modalCtrl: ModalController, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public auth: AngularFireAuth, public db: AngularFireDatabase, public menuCtrl: MenuController, private alertCtrl: AlertController, private fb: FormBuilder) {
    this.defaultUserInfo = {
      streak: 0,
      practicedWords: 0,
      wordsToPractice: 5,
      lastActive: this.date.getToday()
    }
  }

  ngOnInit() {
    this.auth.authState.subscribe((auth: User) => {
      this.user = auth
      this.redirect()
    })
    this.initTranslate()
    this.myForm = this.fb.group({
      listOptions: ['']
    })
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (this.platform.is('cordova')) {
        this.statusBar.styleLightContent()
        this.splashScreen.hide()
      }
    })
  }

  async redirect() {
    await this.backendProvider.initUser()
    if (this.user) {
      await this.generateLanguages()
      const language = await this.storage.get('selectedLanguage')
      if (language) this.selectLanguage(language)
      this.nav.setRoot('TabsPage')
      this.setRotation(true)
    } else {
      const intro = await this.storage.get('intro')
      if (intro) {
        this.nav.setRoot('LoginPage')
      } else {
        this.nav.setRoot('IntroPage')
      }
      this.setRotation(false)
    }
  }

  async initTranslate() {
    this.translate.setDefaultLang('en') // Fallback
    const appLanguage = await this.storage.get('appLanguage')
    if (appLanguage) {
      this.translate.use(appLanguage)
    } else {
      if (this.translate.getBrowserLang() !== undefined) {
        this.translate.use(this.translate.getBrowserLang())
      } else {
        this.translate.use('en')
      }
    }
  }

  selectLanguage(language: string) {
    this.selectedLanguage = language // Visual select
    this.backendProvider.setLanguage(language)
    this.storage.set('selectedLanguage', language)
    if (this.menuCtrl.isOpen)
      this.menuCtrl.close()
  }

  async restoreLastLanguage() {
    const selectedLanguage = await this.storage.get('selectedLanguage')
    if (selectedLanguage && this.languages.indexOf(selectedLanguage) != -1)
      this.selectLanguage(selectedLanguage)
  }

  async openAddLanguage() {
    const modal = this.modalCtrl.create('AddLanguagePage')
    modal.present()
    // Select the new added language
    modal.onDidDismiss(language => {
      if (language)
        this.generateLanguages().then(() => {
          this.selectLanguage(language)
        })
    })
  }

  async generateLanguages() {
    return new Promise((resolve, reject) => {
      this.backendProvider.fetchLanguages().then((languages: Array<string>) => {
        if (languages) {
          this.languages = languages
          // Automatically choose the language if it's the only one
          if (languages.length == 1) this.selectLanguage(languages[0])
        } else {
          this.languages = []
          this.openAddLanguage()
        }
        resolve()
      }).catch(reject)
    })
  }

  openDeleteLanguage(language: string) {
    if (!this.editMode || this.menuCtrl.isAnimating()) return
    this.alertCtrl.create({
      title: `${this.translate.instant('do_you_really_want_to_delete')} ${language}?`,
      cssClass: 'alertDark',
      buttons: [
        {
          text: this.translate.instant('cancel'),
          role: 'cancel',
          cssClass: this.platform.is('ios') ? 'ios-cancel-btn' : null,
        },
        {
          text: this.translate.instant('delete'),
          cssClass: this.platform.is('ios') ? 'ios-delete-btn' : null,
          handler: () => this.deleteLanguage(language)
        }
      ]
    }).present()
  }

  deleteLanguage(language: string) {
    if (!this.user) return
    this.db.list(`users/${this.user.uid}/languages`).remove(language).then(() => {
      this.generateLanguages()
      if (this.languages.length > 0) this.selectLanguage(this.languages[1])
    })
  }

  async switchEditMode() {
    this.editMode = !this.editMode
    if (!this.editMode) {
      await this.generateLanguages()
      this.restoreLastLanguage()
    }
    this.myForm.controls.listOptions.reset()
  }

  setRotation(state: boolean) {
    if (state) {
      if (this.platform.is('cordova'))
        this.screenOrientation.unlock()
    } else {
      if (this.platform.is('cordova'))
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT)
    }
  }

}