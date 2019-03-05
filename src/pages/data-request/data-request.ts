import { Component } from '@angular/core'
import { IonicPage, ViewController } from 'ionic-angular'
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";
import { Clipboard } from "@ionic-native/clipboard";
import { FileTransfer } from "@ionic-native/file-transfer";

@IonicPage()
@Component({
  selector: 'page-data-request',
  templateUrl: 'data-request.html'
})

export class DataRequestPage {
  data: JSON
  constructor(public viewCtrl: ViewController, public db: AngularFireDatabase, public auth: AngularFireAuth, public clipboard: Clipboard, public fileTransfer: FileTransfer) { }

  ionViewDidLoad() {
    this.auth.authState.subscribe(user => {
      if (!user) return
      this.db.database.ref(`users/${user.uid}`).once('value').then(data => {
        this.data = data.val()
      })
    })
  }

  copy() {
    this.clipboard.copy(JSON.stringify(this.data))
  }

  download() {
    this.fileTransfer.create().download('https://ionicframework.com/docs/native/file-transfer/', './file.html').catch(console.error)
  }

}