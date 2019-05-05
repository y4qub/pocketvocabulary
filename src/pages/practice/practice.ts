import { Component, ViewChild, Input, EventEmitter } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from 'firebase';
import { IonicPage, MenuController, ModalController, NavController, Platform, Toolbar } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { PracticeOptions } from '../../interfaces';
import { DateProvider } from '../../providers/date/date';
import { LanguageProvider } from '../../providers/language/language';

@IonicPage()
@Component({
  selector: 'page-practice',
  templateUrl: 'practice.html'
})
export class PracticePage {

  @ViewChild('toolbar') toolbar: Toolbar
  practiceOptions: PracticeOptions
  user: User

  showOptions = true
  showInput = false
  showSelect = false
  showYesNo = false

  leave: boolean

  constructor(public translate: TranslateService, public date: DateProvider, public platform: Platform, public languageProvider: LanguageProvider, public storage: Storage, public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase, public auth: AngularFireAuth, public menu: MenuController, public modalCtrl: ModalController) {
  }

  ionViewDidEnter() {

    this.switchView('options')

  }

  ionViewDidLeave() {
    this.leave = true
  }

  start(practiceOptions: PracticeOptions) {

    this.practiceOptions = practiceOptions
    this.nextExercise()

  }

  nextExercise() {
    const randomIndex = Math.floor(Math.random() * this.practiceOptions.types.length)
    // TODO spravit, takhle to nebude fungovat spravne

    switch (this.practiceOptions.types[randomIndex]) {

      case 'input':

        this.switchView(this.practiceOptions.types[randomIndex])
        break

      case 'select':

        this.switchView(this.practiceOptions.types[randomIndex])
        break

      case 'yesno':

        this.switchView(this.practiceOptions.types[randomIndex])
        break

    }
  }

  switchView(type: string) {

    if (type == 'input') {
      this.showInput = true; this.showSelect = false; this.showYesNo = false; this.showOptions = false;
    } else if (type == 'select') {
      this.showInput = false; this.showSelect = true; this.showYesNo = false; this.showOptions = false;
    } else if (type == 'yesno') {
      this.showInput = false; this.showSelect = false; this.showYesNo = true; this.showOptions = false;
    } else if (type == 'options') {
      this.showInput = false; this.showSelect = false; this.showYesNo = false; this.showOptions = true;
    }

  }

  proceedResult(correct: boolean) {

    // TODO tohle je workaround, pridat prechod
    setTimeout(() => {
      this.showInput = false; this.showSelect = false; this.showYesNo = false; this.showOptions = false;
      setTimeout(() => this.nextExercise())
    }, 400)

  }

}