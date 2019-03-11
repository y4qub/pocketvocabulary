import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from 'firebase';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserInfo, Words } from '../../interfaces';
import { DateProvider } from '../date/date';

@Injectable()
export class BackendProvider {

  private user: User
  private language: BehaviorSubject<string>
  private defaultUserInfo: UserInfo

  constructor(private dateProvider: DateProvider, private auth: AngularFireAuth, private db: AngularFireDatabase, private storage: Storage) {
    this.auth.authState.subscribe((auth: User) => {
      this.user = auth
    })
    this.language = new BehaviorSubject<string>(null)
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

  setLanguage(language: string) {
    this.language.next(language)
  }

  getLanguage() {
    return this.language.asObservable()
  }

  fetchVocabulary() {
    return new Promise((resolve, reject) => {
      this.db.database.ref(`users/${this.user.uid}/languages/${this.language.getValue()}`).once('value').then(snapshot => {
        resolve(snapshot.val()['vocabulary'])
      }).catch(reject)
    })
  }

  fetchWords(language: string): Promise<Words> {
    return new Promise((resolve, reject) => {
      let words1 = null
      let words2 = null
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
        const words: Words = { words1: words1, words2: words2 }
        resolve(words)
      }).catch(reject)
    })
  }

  fetchLanguages(): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      let languages: Array<string>
      this.db.database.ref(`users/${this.user.uid}`).once('value').then(snapshot => {
        // Check if the selected user has any lanaguages
        if (snapshot && snapshot.val() && snapshot.val()['languages'])
          languages = Object.keys(snapshot.val()['languages'])
        resolve(languages)
      }).catch(reject)
    })
  }

  // For new Google and Facebook Redirect Sign Up
  initUser() {
    return new Promise((resolve, reject) => {
      this.auth.auth.getRedirectResult().then(data => {
        if (!data || !data.user) resolve('No redirect result') // Not a new user
        if (data.additionalUserInfo.isNewUser) {
          this.db.list(`/users/${data.user.uid}`).set('info', this.defaultUserInfo).then(() => resolve())
          this.storage.set('speedOfSpeech', 1.3)
        }
      }).catch(reject)
    })
  }

}