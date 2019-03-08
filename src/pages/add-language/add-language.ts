import { Component } from '@angular/core'
import { ViewController, IonicPage } from 'ionic-angular'
import { AngularFireDatabase } from 'angularfire2/database'
import { AngularFireAuth } from 'angularfire2/auth'
import { BackendProvider } from '../../providers/backend/backend'
import { DateProvider } from '../../providers/date/date'
import { User } from 'firebase'

/**
 * Generated class for the AddLanguagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-language',
  templateUrl: 'add-language.html',
})
export class AddLanguagePage {
  languages: Array<string> = []
  showCancel: boolean = false
  user: User
  constructor(public dateProvider: DateProvider, public viewCtrl: ViewController, public backendProvider: BackendProvider, public auth: AngularFireAuth, public db: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    this.auth.authState.subscribe((auth: User) => {
      this.user = auth
      this.setItems().then((items: Array<string>) => this.languages = items)
    })
  }

  setItems() {
    return new Promise((resolve, reject) => {
      let values: Array<string>
      this.languages = []
      // Set values to the basic language list
      values = this.backendProvider.getLanguageNames()
      if (!this.user) return
      // Remove all languages that are already being used
      this.db.database.ref(`users/${this.user.uid}`).once('value').then(data => {
        const snapshot = data.val()
        if (snapshot && snapshot['languages']) {
          this.showCancel = true
          Object.keys(snapshot['languages']).forEach(element => {
            values.splice(values.indexOf(element), 1)
          })
        }
        resolve(values)
      })
    })
  }

  filterItems(ev) {
    this.setItems().then((items: Array<string>) => {
      this.languages = items
      let val = ev.target.value // User input
      if (val && val.trim() !== '') {
        this.languages = this.languages.filter(item => {
          return item.toLowerCase().startsWith(val.toLowerCase())
        })
      }
    })
  }

  addLanguage(language: string) {
    if (!this.user || !language) return
    this.db.database.ref(`users/${this.user.uid}/languages/${language}/info`).update({ date: this.dateProvider.getToday() }).catch(console.error)
    this.viewCtrl.dismiss(language)
  }

}
