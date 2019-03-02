import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ModalController, Platform, ViewController, AlertController } from 'ionic-angular';
import { DateProvider } from '../../providers/date/date';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Facebook } from '@ionic-native/facebook';
import * as firebase from 'firebase/app'
import { User } from 'firebase'
import { Storage } from '@ionic/storage'
import { GooglePlus } from '@ionic-native/google-plus';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user: User
  accepted: boolean = false
  constructor(public afAuth: AngularFireAuth, public googlePlus: GooglePlus, public alert: AlertController, public storage: Storage, public viewCtrl: ViewController, public nav: NavController, public dateProvider: DateProvider, public menuCtrl: MenuController, public modalCtrl: ModalController, public platform: Platform, public navParams: NavParams, public auth: AngularFireAuth, public db: AngularFireDatabase, private fb: Facebook) {
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
    if (!email || !password) return
    if (!this.accepted) {
      this.showError('You must first agree with the Privacy Policy and Terms of Service of this app in order to create an account.')
      return
    }
    this.auth.auth.createUserWithEmailAndPassword(email, password).then(user => {
      this.db.list('/users').set(user.uid, this.getInitialDbObject())
      this.storage.set('speed_of_speech', 'medium')
    }).catch(err => this.showError(err.message))
  }

  signInWithGoogle() {
    if (!this.accepted) {
      this.showError('You must first agree with the Privacy Policy and Terms of Service of this app in order to create an account.')
      return
    }
    if (this.platform.is('cordova')) {
      this.googlePlus.login({
        'webClientId': '71486533817-atjgni37o6c0fb9b848gv5vs4n12dv4v.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      }).then(gPlusUser => {
        this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gPlusUser.idToken))
      }).catch(console.error)
    } else {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(provider).then(() => {
        return firebase.auth().getRedirectResult()
      }).catch(console.error)
    }
  }

  signInWithFacebook() {
    if (!this.accepted) {
      this.showError('You must first agree with the Privacy Policy and Terms of Service of this app in order to create an account.')
      return
    }
    this.fb.login(['email', 'public_profile']).then(res => {
      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken)
      firebase.auth().signInWithCredential(facebookCredential).then(user => {
        this.db.database.ref(`/users`).once('value').then(snapshot => {
          if (!snapshot) return
          if (!snapshot.val()[user.uid])
            this.db.list('/users').set(user.uid, this.getInitialDbObject())
        })
      })
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

  forgotPassword() {
    this.modalCtrl.create('ForgotpasswordPage').present()
  }
  getInitialDbObject() {
    return {
      info: {
        streak: 0,
        practicedWords: 0,
        wordsToPractice: 5,
        lastActive: this.dateProvider.getToday()
      }
    }
  }

  openPolicy(policyName: string) {
    this.modalCtrl.create('PoliciesPage', {policyName: policyName}).present()
  }

}
