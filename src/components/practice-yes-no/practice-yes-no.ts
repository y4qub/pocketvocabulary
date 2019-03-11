import { Component, OnInit, state, style, trigger } from '@angular/core';
import { PracticeOptions } from '../../interfaces';
import { PracticeProvider } from '../../providers/practice/practice';

@Component({
  selector: 'practice-yes-no',
  templateUrl: 'practice-yes-no.html',
  animations: [
    trigger('green', [
      state('no', style({
        backgroundColor: '#323232' // Gray
      })),
      state('yes', style({
        backgroundColor: '#32db64' // Green
      }))
    ]),
    trigger('red', [
      state('no', style({
        backgroundColor: '#323232' // Gray
      })),
      state('yes', style({
        backgroundColor: '#f53d3d' // Red
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

  constructor(public practiceProvider: PracticeProvider) {
  }

  async ngOnInit() {
    this.word1 = await this.practiceProvider.generateWord()
  }

  generateSecondWord() {

  }

}
