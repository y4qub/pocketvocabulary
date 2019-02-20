import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, IonicPage } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
})
export class ForgotpasswordPage {
  email: string
  constructor(public translate: TranslateService, public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, public auth: AngularFireAuth) {
  }

  sendReset() {
    if (this.email)
      this.auth.auth.sendPasswordResetEmail(this.email).then(() => {
        this.alertCtrl.create({
          title: this.translate.instant('send_reset_link'),
          cssClass: 'alertDark',
          message: this.translate.instant('we_send_you_an_email'),
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.navCtrl.pop()
              }
            }
          ]
        }).present()
      })
  }

}
