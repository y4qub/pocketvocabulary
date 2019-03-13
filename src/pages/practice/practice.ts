import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ViewChild } from '@angular/core';
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
  templateUrl: 'practice.html',
  animations: [
    trigger('visibility', [
      state('visible', style({
        opacity: 1
      })),
      state('invisible', style({
        opacity: 0
      })),
      transition('visible <=> invisible', animate('.3s')),
    ])
  ]
})
export class PracticePage {

  @ViewChild('toolbar') toolbar: Toolbar
  practiceOptions: PracticeOptions
  user: User

  showOptions = true
  showInput = false
  showSelect = false
  showYesNo = false

  constructor(public translate: TranslateService, public date: DateProvider, public platform: Platform, public languageProvider: LanguageProvider, public storage: Storage, public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase, public auth: AngularFireAuth, public menu: MenuController, public modalCtrl: ModalController) {
  }

  ionViewDidEnter() {
    this.switchView('options')
  }

  start(practiceOptions: PracticeOptions) {
    this.practiceOptions = practiceOptions
    this.nextExercise()
  }

  nextExercise() {
    const randomIndex = Math.floor(Math.random() * this.practiceOptions.types.length)
    if (this.practiceOptions.types[randomIndex] == 'input') {
      this.switchView(this.practiceOptions.types[randomIndex])
    } else if (this.practiceOptions.types[randomIndex] == 'select') {
      this.switchView(this.practiceOptions.types[randomIndex])
    } else if (this.practiceOptions.types[randomIndex] == 'yesno') {
      this.switchView(this.practiceOptions.types[randomIndex])
    }
    // FIX TODO
    // let optionsArray = Object.values(this.practiceOptions.types)
    // while (true) {
    //   const randomIndex = Math.floor(Math.random() * optionsArray.length)
    //   if (randomIndex == 0 && optionsArray[randomIndex]) {
    //     this.switchView('input')
    //     break
    //   } else if (randomIndex == 1 && optionsArray[randomIndex]) {
    //     this.switchView('select')
    //     break
    //   } else if (randomIndex == 2 && optionsArray[randomIndex]) {
    //     this.switchView('yesno')
    //     break
    //   }
    // }
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
    console.log(correct)
    this.nextExercise()
  }

}