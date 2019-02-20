import { Component, ViewChild } from '@angular/core'
import { Platform, NavController, MenuController, AlertController, ActionSheetController } from 'ionic-angular'
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { ScreenOrientation } from '@ionic-native/screen-orientation'
import { AngularFireAuth } from "angularfire2/auth"
import { AngularFireDatabase } from 'angularfire2/database'
import { ModalController } from 'ionic-angular/components/modal/modal-controller'
import { FormGroup, FormBuilder } from '@angular/forms'
import { Storage } from '@ionic/storage'
import { LanguageProvider } from '../providers/language/language'
import { Globalization } from '@ionic-native/globalization'
import { TranslateService } from '@ngx-translate/core'
import { DateProvider } from '../providers/date/date';
import { User } from 'firebase'
import { StreakProvider } from '../providers/streak/streak';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  languages: Array<string>
  editMode = false
  myForm: FormGroup
  selectedLanguage: string
  @ViewChild('nav') nav: NavController
  user: User
  infoObj = { info: { streak: 0, practicedWords: 0, wordsToPractice: 5, lastActive: this.date.getToday(), timedPracticeInterval: 5 } }
  constructor(public actionSheetCtrl: ActionSheetController, public streak: StreakProvider, public date: DateProvider, public translate: TranslateService, public globalization: Globalization, public language: LanguageProvider, public storage: Storage, public screenOrientation: ScreenOrientation, public modalCtrl: ModalController, public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public auth: AngularFireAuth, public db: AngularFireDatabase, public menuCtrl: MenuController, private alertCtrl: AlertController, private fb: FormBuilder) {
    this.auth.authState.subscribe((auth: User) => {
      this.user = auth
      this.redirect()
    })
    this.initTranslate()
    this.myForm = this.fb.group({
      listOptions: ['']
    })
    platform.resume.subscribe(() => {
      this.streak.checkStreak()
    })
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (platform.is('cordova')) {
        statusBar.styleLightContent()
        splashScreen.hide()
      }
    })
  }

  redirect() {
    // For new Google and Facebook Redirect Sign-In
    this.auth.auth.getRedirectResult().then(data => {
      if (!data || !data.user) return
      if (data.additionalUserInfo.isNewUser) {
        this.db.list('/users').set(data.user.uid, this.infoObj)
        this.storage.set('speedOfSpeech', 1.3)
      }
    })
    // Redirect based on the auth state
    if (this.user) {
      this.generateLanguages(() => {
        this.storage.get('selectedLanguage').then((language: string) => {
          if (language) {
            this.nav.setRoot('TabsPage', { language: language })
            this.selectedLanguage = language // Visual select
          } else {
            this.nav.setRoot('TabsPage')
          }
        })
      })
      // Enable rotation
      if (this.platform.is('cordova'))
        this.screenOrientation.unlock()
      this.streak.checkStreak()
    } else {
      // Go to intro if haven't seen already -> NO INTRO SO FAR
      // this.storage.get('intro').then(value => {
      //   if (value) {
      //     this.nav.setRoot('LoginPage')
      //   } else {
      //     this.nav.setRoot('IntroPage')
      //   }
      // })
      this.nav.setRoot('LoginPage')
      // Disable rotation
      if (this.platform.is('cordova'))
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT)
    }
  }

  initTranslate() {
    // Fallback
    this.translate.setDefaultLang('en')
    this.translate.use('en')
    // AZ TAM BUDE LANGUAGE SWITCH ZPATKY (GIT)
  }

  selectLanguage(language: string, reload?: boolean) {
    // EVERYTIME RELOAD NOW DUE TO A BUG WHEN DELETES AND CREATES A LANGUGE IMMEDIATELY (GIT)
    this.selectedLanguage = language // Visual select
    this.nav.setRoot('TabsPage', { language: language })
    this.storage.set('selectedLanguage', language)
    this.menuCtrl.close()
  }

  restoreLastLanguage() {
    this.storage.get('selectedLanguage').then((language: string) => {
      if (language && this.languages.indexOf(language) != -1)
        this.selectLanguage(language, true)
    })
  }

  addList() {
    let modal = this.modalCtrl.create('AddLanguagePage')
    modal.present()
    // Select the new added language
    modal.onDidDismiss(language => {
      if (language)
        this.generateLanguages(() => {
          this.selectLanguage(language)
        })
    })
  }

  generateLanguages(cb?) {
    this.language.fetchLanguages((languages: Array<string>) => {
      if (languages) {
        this.languages = languages
        // Automatically choose the language if it's the only one
        if (languages.length == 1)
          this.selectLanguage(languages[0])
        if (cb) cb()
      } else {
        this.languages = []
        this.addList()
      }
    })
  }

  deleteLanguage(language: string) {
    if (!this.editMode || this.menuCtrl.isAnimating()) return
    // Prompt for deleting the language
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
          handler: () => {
            // Delete the language
            if (!this.user) return
            this.db.list(`users/${this.user.uid}/languages`).remove(language).then(() => this.generateLanguages())
            this.nav.setRoot('TabsPage')
          }
        }
      ]
    }).present()
  }

  switchEditMode() {
    this.editMode = !this.editMode
    if (!this.editMode) this.generateLanguages(() => this.restoreLastLanguage())
    this.myForm.controls.listOptions.reset()
  }

}