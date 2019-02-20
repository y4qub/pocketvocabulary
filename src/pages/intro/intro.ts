import { Component } from '@angular/core'
import { ModalController, MenuController, IonicPage, Slides, App } from 'ionic-angular'
import { Storage } from '@ionic/storage'
import { NavController } from 'ionic-angular/navigation/nav-controller'

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {
  activeSlideId: number
  constructor(public menuCtrl: MenuController, public modalCtrl: ModalController, public storage: Storage, public nav: NavController, public app: App) { }

  ionViewDidEnter() {
    this.menuCtrl.enable(false)
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(true)
  }

  onTabChange(ev: Slides) {
    if (ev) this.activeSlideId = ev.getActiveIndex() == 3 ? 2 : ev.getActiveIndex()
  }

  openLoginPage() {
    this.modalCtrl.create('LoginPage').present().then(() => this.nav.setRoot('TabsPage'))
    this.storage.set('intro', true)
  }

}
