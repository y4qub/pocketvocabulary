import { Component } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from 'firebase';
import * as firebase from 'firebase/app';
import { AlertController, IonicPage, MenuController, ModalController, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { UserInfo } from '../../interfaces';
import { DateProvider } from '../../providers/date/date';

const googlePlusConfig = {
  'webClientId': '71486533817-atjgni37o6c0fb9b848gv5vs4n12dv4v.apps.googleusercontent.com',
  'offline': true,
  'scopes': 'profile email'
}

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user: User
  accepted: boolean = false
  defaultUserInfo: UserInfo
  constructor(public afAuth: AngularFireAuth, public googlePlus: GooglePlus, public alert: AlertController, public storage: Storage, public viewCtrl: ViewController, public nav: NavController, public dateProvider: DateProvider, public menuCtrl: MenuController, public modalCtrl: ModalController, public platform: Platform, public navParams: NavParams, public auth: AngularFireAuth, public db: AngularFireDatabase, private fb: Facebook) {
    this.defaultUserInfo = {
      streak: 0,
      practicedWords: 0,
      wordsToPractice: 5,
      lastActive: this.dateProvider.getToday(),
      practiceOptions: {
        repeatWords: false,
        translation: 0,
        types: ['input', 'select', 'yesno']
      }
    }
  }

  ionViewDidLoad() {
    this.auth.authState.subscribe((auth: User) => {
      this.user = auth
      if (auth) this.nav.setRoot('TabsPage').then(() => this.viewCtrl.dismiss())
    })
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(true)
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false)
  }

  signIn(email: string, password: string) {
    if (!email || !password) return
    this.auth.auth.signInWithEmailAndPassword(email, password).then(success => {
      // App Component automatically redirects to the Tabs View
    }).catch(console.error)
  }

  signUp(email: string, password: string) {
    if (!this.didAcceptPolicies()) return
    if (!email || !password) return
    this.auth.auth.createUserWithEmailAndPassword(email, password).then(user => {
      this.db.list(`/users/${user.uid}`).set('info', this.defaultUserInfo)
      this.storage.set('speed_of_speech', 'medium')
    }).catch(err => this.showError(err.message))
  }

  signInWithGoogle() {
    if (!this.didAcceptPolicies()) return
    this.googlePlus.login(googlePlusConfig).then(gPlusUser => {
      this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gPlusUser.idToken)).then(user => {
        this.db.list(`/users/${user.uid}`).set('info', this.defaultUserInfo)
      })
    }).catch(console.error)
  }

  signInWithFacebook() {
    if (!this.didAcceptPolicies()) return
    this.fb.login(['email', 'public_profile']).then(res => {
      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken)
      firebase.auth().signInWithCredential(facebookCredential)
    }).catch(console.error)
  }

  showError(err) {
    this.alert.create({
      title: 'Error',
      cssClass: 'alertDark',
      message: err,
      buttons: [
        { text: 'Close', role: 'cancel' }
      ]
    }).present()
  }

  didAcceptPolicies() {
    if (!this.accepted) {
      this.showError('You must first agree with the Privacy Policy and Terms of Service of this app in order to create an account.')
      return false
    } else {
      this.accepted = true
    }
  }

  forgotPassword() {
    this.modalCtrl.create('ForgotpasswordPage').present()
  }

  openPolicy(policyName: string) {
    this.modalCtrl.create('PoliciesPage', { policyName: policyName }).present()
  }

}
