import { Component, EventEmitter, OnInit, Output, state, style, trigger } from '@angular/core';
import { PracticeProvider } from '../../providers/practice/practice';

@Component({
  selector: 'practice-input',
  templateUrl: 'practice-input.html',
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
export class PracticeInputComponent implements OnInit {

  color: string
  answer: string
  word: string
  @Output('result') result: EventEmitter<boolean>

  constructor(public practiceProvider: PracticeProvider) {
    this.result = new EventEmitter
  }

  async ngOnInit() {
    this.word = await this.practiceProvider.generateWord()
  }

  async check() {

    if (await this.practiceProvider.matches(this.answer)) {
      this.color = 'green'
    } else {
      this.color = 'red'
    }

    this.result.emit(await this.practiceProvider.matches(this.answer))

  }

}
