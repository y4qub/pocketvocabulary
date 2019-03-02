import { Component, ViewChild } from '@angular/core'
import { NavParams } from 'ionic-angular/navigation/nav-params'
import { AngularFireDatabase } from 'angularfire2/database'
import { AngularFireAuth } from 'angularfire2/auth'
import { TextInput, MenuController, ModalController, NavController, Tabs, Select, Platform, IonicPage, Toolbar } from 'ionic-angular'
import { Storage } from '@ionic/storage'
import { LanguageProvider } from '../../providers/language/language'
import { DateProvider } from '../../providers/date/date'
import { User } from 'firebase'
import { TranslateService } from '@ngx-translate/core';
import { trigger, state, style, transition, animate } from '@angular/animations'

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
    ]),
    trigger('green', [
      state('no', style({
        backgroundColor: '#323232' // gray
      })),
      state('yes', style({
        backgroundColor: '#32db64' // green
      }))
    ]),
    trigger('red', [
      state('no', style({
        backgroundColor: '#323232' // gray
      })),
      state('yes', style({
        backgroundColor: '#f53d3d' // red
      }))
    ]),
  ]
})
export class PracticePage {
  @ViewChild('input') input2: TextInput
  @ViewChild('toolbar') toolbar: Toolbar
  @ViewChild('sectionSelect') sectionSelect: Select
  language: string
  words1: Array<string>
  words2: Array<string>
  type = 'classic'
  currentLanguage: string
  checking = false
  translateTo: string
  user: User
  selectOptions = { cssClass: 'alertDark' }
  // Word Generation
  generatedWord1: string
  generatedWord2: string
  generatedNumbers = []
  // Rating
  answer: string
  attempts = 0
  score = 0
  rating: number
  // Time practice
  timeout
  paused = false
  time: number
  state: number
  delay: number
  // Options
  practiceOptions = {}
  // View
  options = true
  input = false
  select = false
  yesNo = false
  // Select View
  generatedWords = []
  randomNumbers = []
  visibility = 'visible'
  green = 'no'
  red1 = 'no'
  red2 = 'no'
  red3 = 'no'
  tapped: boolean
  // y/n
  isCorrect: boolean
  greenYes = 'no'
  greenNo = 'no'
  redYes = 'no'
  redNo = 'no'
  random: boolean // translation both
  infoRef: any
  constructor(public translate: TranslateService, public date: DateProvider, public platform: Platform, public languageProvider: LanguageProvider, public storage: Storage, public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase, public auth: AngularFireAuth, public menu: MenuController, public modalCtrl: ModalController) {
    this.languageProvider.getLanguageName(this.translate.currentLang).then((value: string) => this.currentLanguage = value)

    this.auth.authState.subscribe((auth: User) => {
      this.user = auth
    })
  }

  ionViewDidEnter() {
    if (!this.user) return
    this.showOptions()
    // Get Language
    if (Object.keys(this.navParams.data).length) {
      this.language = this.navParams.data
      this.reloadDatabase()
    }
    // Get Practice Options
    this.storage.get('practiceOptions').then(obj => {
      if (!obj) return
      this.practiceOptions = obj
    }).catch(console.error)
  }

  hideOptions() {
    this.options = false
  }

  showOptions() {
    this.options = true
    this.input = false; this.select = false; this.yesNo = false
  }

  toggleVisibility() {
    this.visibility = this.visibility == 'visible' ? 'invisible' : 'visible'
  }

  start() {
    this.hideOptions()
    this.generateExercise()
    this.storage.set('practiceOptions', this.practiceOptions)
  }

  generateExercise() {
    const randomIndex = Math.floor(Math.random() * this.practiceOptions['types'].length)
    if (this.practiceOptions['types'][randomIndex] == 0) {
      // Input
      this.viewExercise(this.practiceOptions['types'][randomIndex])
    } else if (this.practiceOptions['types'][randomIndex] == 1) {
      // Select
      this.viewExercise(this.practiceOptions['types'][randomIndex])
    } else if (this.practiceOptions['types'][randomIndex] == 2) {
      // Yes/No
      this.viewExercise(this.practiceOptions['types'][randomIndex])
    }
  }

  viewExercise(num) {
    this.resetColors()
    // Input
    if (num == 0) {
      this.input = true; this.select = false; this.yesNo = false
      this.generateWord()
      // Select
    } else if (num == 1) {
      this.input = false; this.select = true; this.yesNo = false
      this.generateOrder()
      this.generateWord()
      this.generateWords()
      // Yes/No
    } else if (num == 2) {
      this.input = false; this.select = false; this.yesNo = true
      this.generateWord()
      console.log(this.generatedWord1)
      this.isCorrect = true
      // NOT CORRECT MATCH
      if (Math.random() > 0.5) {
        // Index Generation
        var myIndex = Math.floor(Math.random() * this.words1.length)
        if (this.random) {
          while (this.words2.indexOf(this.generatedWord2) == myIndex) {
            myIndex = Math.floor(Math.random() * this.words1.length)
          }
        } else {
          while (this.words1.indexOf(this.generatedWord2) == myIndex) {
            myIndex = Math.floor(Math.random() * this.words1.length)
          }
        }
        // Setting the generatedWord1
        if (this.practiceOptions['translation'] == 0) {
          this.generatedWord2 = this.words2[myIndex]
        } else if (this.practiceOptions['translation'] == 1) {
          this.generatedWord2 = this.words1[myIndex]
        } else if (this.practiceOptions['translation'] == 2) {
          if (this.random) {
            this.generatedWord2 = this.words2[myIndex]
          } else {
            this.generatedWord2 = this.words1[myIndex]
          }
        }
        this.isCorrect = false
      }
    }
  }

  generateOrder() {
    for (let i = 0; i < 4; i++) {
      let randomIndex = Math.floor(Math.random() * 4)
      while (this.randomNumbers.indexOf(randomIndex) != -1) {
        randomIndex = Math.floor(Math.random() * 4)
      }
      this.randomNumbers.push(randomIndex)
    }
  }

  resetColors() {
    this.green = 'no'
    this.red1 = 'no'
    this.red2 = 'no'
    this.red3 = 'no'
    this.greenYes = 'no'
    this.greenNo = 'no'
    this.redYes = 'no'
    this.redNo = 'no'
  }

  checkSelect() {
    if (this.tapped) return
    this.tapped = true
    this.green = 'yes'
    setTimeout(() => {
      this.toggleVisibility()
      setTimeout(() => {
        this.attempts++
        this.generatedWords = []
        this.randomNumbers = []
        this.generateExercise()
        setTimeout(() => {
          this.toggleVisibility()
          this.tapped = false
        }, 300)
      }, 300)
    }, 500)
  }

  correct() {
    this.score++
    this.checkSelect()
  }

  wrong(num: number) {
    if (num == 1) {
      this.red1 = 'yes'
    } else if (num == 2) {
      this.red2 = 'yes'
    } else if (num == 3) {
      this.red3 = 'yes'
    }
    this.checkSelect()
  }

  reloadDatabase(cb?) {
    this.languageProvider.fetchWords(this.language, (words1, words2) => {
      if (!words1 || !words2) return
      this.words1 = words1
      this.words2 = words2
      if (cb) cb()
    })
  }

  checkYN(answer: string) {
    if (this.isCorrect) {
      this.greenYes = 'yes'
      if (answer == 'no') this.redNo = 'yes'
      this.correct()
    } else {
      this.greenNo = 'yes'
      if (answer == 'yes') this.redYes = 'yes'
      this.checkSelect()
    }
  }

  generateWord() {
    if (!this.words1 || !this.words2) return
    this.answer = ''
    // INDEX GENERATION
    let randomIndex = Math.floor(Math.random() * this.words1.length)
    if (this.words1.length != 1) {
      var currentIndex = randomIndex
      // Make sure the words don't repeat
      if (!this.practiceOptions['repeatWords']) {
        if (this.generatedNumbers.length == this.words1.length)
          this.generatedNumbers = []
        while (this.generatedNumbers.indexOf(currentIndex) != -1) {
          currentIndex = Math.floor(Math.random() * this.words1.length)
        }
        this.generatedNumbers.push(currentIndex)
      }
    } else {
      // Handle the situation for one word
      randomIndex = 0
    }

    // TRANSLATION WAY
    let words1
    let words2
    let placeholder
    if (this.practiceOptions['translation'] == 0) {
      this.languageProvider.getLanguageName(this.translate.currentLang).then((value: string) => {
        placeholder = value
      })
      words1 = this.words1
      words2 = this.words2
    } else if (this.practiceOptions['translation'] == 1) {
      placeholder = this.language
      words1 = this.words2
      words2 = this.words1
    } else if (this.practiceOptions['translation'] == 2) {
      this.random = Math.random() >= 0.5
      if (this.random) {
        words1 = this.words1
        words2 = this.words2
      } else {
        placeholder = this.language
        words1 = this.words2
        words2 = this.words1
      }
    }
    if (!words1 || !words2) return
    this.generatedWord1 = words1[currentIndex]
    this.generatedWord2 = words2[currentIndex]
    this.translateTo = placeholder
  }

  generateWords() {
    let words
    if (this.practiceOptions['translation'] == 0) {
      words = this.words2
    } else if (this.practiceOptions['translation'] == 1) {
      words = this.words1
    } else if (this.practiceOptions['translation'] == 2) {
      if (this.random) {
        words = this.words2
      } else {
        words = this.words1
      }
    }
    // generate the 3 words
    for (let i = 0; i < 3; i++) {
      let randomWord = words[Math.floor(Math.random() * words.length)]
      // make sure the words don't repeat
      while (this.generatedWords.indexOf(randomWord) != -1 || randomWord == this.generatedWord2)
        randomWord = words[Math.floor(Math.random() * words.length)]
      this.generatedWords.push(randomWord)
    }
  }

  check() {
    const generatedWord2Normalized = this.generatedWord2.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const answerNormalized = this.answer.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    this.attempts++
    if (generatedWord2Normalized == answerNormalized) {
      this.score++
      this.greenYes = 'yes'
    } else {
      this.redYes = 'yes'
    }
    setTimeout(() => {
      this.toggleVisibility()
      setTimeout(() => {
        this.generateExercise()
        setTimeout(() => {
          this.toggleVisibility()
        }, 300)
      }, 300)
    }, 500)
  }

  contentTouch() {
    const t: Tabs = this.navCtrl.parent
    if (!this.language && !this.words1 && !this.menu.isAnimating()) {
      // No language
      this.menu.open()
    } else if (this.language && !this.words1 && !this.menu.isAnimating()) {
      // No words
      t.select(0)
      this.modalCtrl.create('AddWordPage', { language: this.language }).present()
    } else if (this.words1.length < 4) {
      // Lack of words
      t.select(0)
    }
  }

}
