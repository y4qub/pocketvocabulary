import { Injectable, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from 'firebase'
import { Storage } from '@ionic/storage';
import { UserInfo } from '../../user';
import * as languageList from  './supportedLanguages.json'

/*
  Generated class for the LanguagesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class BackendProvider implements OnInit {
  user: User
  defaultUserInfo: UserInfo
  constructor(public auth: AngularFireAuth, public db: AngularFireDatabase, public storage: Storage) {

  }

  ngOnInit() {
    this.auth.authState.subscribe((auth: User) => {
      this.user = auth
    })
  }

  // For new Google and Facebook Redirect Sign Up
  initUser() {
    return new Promise((resolve, reject) => {
      this.auth.auth.getRedirectResult().then(data => {
        if (!data || !data.user) reject('Not Authenticated')
        if (data.additionalUserInfo.isNewUser) {
          this.db.list(`/users/${data.user.uid}`).set('info', this.defaultUserInfo).then(() => resolve())
          this.storage.set('speedOfSpeech', 1.3)
        }
      }).catch(err => reject(err))
    })
  }

  getLanguageList() {
    return languageList
  }

  getLanguageNames() {
    return languageList.map(item => {
      // Simplify the name
      let name = item.name
      if (item.name.includes(','))
        name = item.name.split(',')[0]
      if (item.name.includes(';'))
        name = item.name.split(';')[0]
      return name
    })
  }

  getLanguageName(code: string) {
    return new Promise((resolve, reject) => {
      languageList.forEach(element => {
        if (element.code == code) resolve(element.name)
      })
      reject('No match')
    })
  }

  getLanguageCode(name: string) {
    return new Promise((resolve, reject) => {
      languageList.forEach(element => {
        if (element.name.includes(name)) resolve(element.code)
      })
      reject('No match')
    })
  }

  fetchWords(language: string, cb) {
    let words1 = null
    let words2 = null
    if (!this.user || !language || typeof language !== 'string') return
    this.db.database.ref(`users/${this.user.uid}/languages/${language}`).once('value').then(snapshot => {
      const value = snapshot.val()
      // Check if the selected language has vocabulary
      if (value && Object.keys(value).indexOf('vocabulary') != -1) {
        words1 = Object.keys(value['vocabulary'])
        words2 = []
        words1.forEach(element => {
          words2.push(value['vocabulary'][element])
        })
      }
      cb(words1, words2)
    })
  }

  fetchLanguages(cb) {
    let languages
    if (!this.user) return
    this.db.database.ref(`users/${this.user.uid}`).once('value').then(snapshot => {
      // Check if the selected user has any lanaguages
      if (snapshot && snapshot.val() && snapshot.val()['languages'])
        languages = Object.keys(snapshot.val()['languages'])
      cb(languages)
    })
  }

}