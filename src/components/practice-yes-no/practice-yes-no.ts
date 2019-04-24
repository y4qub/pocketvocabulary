import { Component, EventEmitter, OnInit, Output, state, style, trigger } from '@angular/core';
import { PracticeOptions } from '../../interfaces';
import { BackendProvider } from '../../providers/backend/backend';
import { PracticeProvider } from '../../providers/practice/practice';

@Component({
  selector: 'practice-yes-no',
  templateUrl: 'practice-yes-no.html',
  animations: [
    trigger('color', [
      state('red', style({
        backgroundColor: '#f53d3d'
      })),
      state('green', style({
        backgroundColor: '#32db64'
      }))
    ])
  ]
})
export class PracticeYesNoComponent implements OnInit {

  practiceOptions: PracticeOptions
  isCorrect: boolean
  tapped: boolean
  word1: string
  word2: string
  colorYes: string
  colorNo: string
  correct: number
  @Output('result') result: EventEmitter<boolean>

  constructor(public practiceProvider: PracticeProvider, public backendProvider: BackendProvider) {
    this.result = new EventEmitter
  }

  async ngOnInit() {
    this.word1 = await this.practiceProvider.generateWord()
    this.correct = Math.round(Math.random())
    if (this.correct) {
      this.word2 = this.practiceProvider.getSecondWord()
    } else {
      this.word2 = 'bs' // TODO nahradit realnym slovem
    }
  }

  async generateRandomWord() {
    const { words2 } = await this.backendProvider.fetchVocabulary()
    words2
  }

  async check(answer: string) {
    if (answer == 'yes') {
      if (this.correct) {
        this.result.emit(true)
        this.colorYes = 'green'
      } else {
        this.result.emit(false)
        this.colorNo = 'green'
        this.colorYes = 'red'
      }
    } else if (answer == 'no') {
      if (this.correct) {
        this.result.emit(false)
        this.colorYes = 'green'
        this.colorNo = 'red'
      } else {
        this.result.emit(true)
        this.colorNo = 'green'
      }
    }
  }

}
