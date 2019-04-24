import { Component, EventEmitter, Output, state, style, trigger } from '@angular/core';
import { BackendProvider } from '../../providers/backend/backend';
import { PracticeProvider } from '../../providers/practice/practice';

@Component({
  selector: 'practice-select',
  templateUrl: 'practice-select.html',
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
export class PracticeSelectComponent {

  generatedWord1: string
  generatedWord2: string
  generatedWords: Array<string> = []

  randomNumbers: Array<number> = []

  color: string
  color1: string
  color2: string
  color3: string

  @Output('result') result: EventEmitter<boolean> = new EventEmitter

  constructor(public backendProvider: BackendProvider, public practiceProvider: PracticeProvider) {

    this.generateOrder()
    this.generateWords()

    this.practiceProvider.generateWord().then(word => {
      this.generatedWord1 = word
      this.generatedWord2 = this.practiceProvider.getSecondWord()
    })

    console.log(this.generatedWord2)

  }

  correct() {

    this.color = 'green'
    this.result.emit(true)

  }

  wrong(number: number) {

    switch (number) {

      case 1:

        this.color1 = 'red'
        break

      case 2:

        this.color2 = 'red'
        break

      case 3:

        this.color3 = 'red'
        break

    }

    this.result.emit(false)

  }

  generateOrder() {

    for (let i = 0; i < 4; i++) {

      let randomIndex = Math.floor(Math.random() * 4)

      while (this.randomNumbers.indexOf(randomIndex) != -1)
        randomIndex = Math.floor(Math.random() * 4)

      this.randomNumbers.push(randomIndex)

    }

  }

  async generateWords() {

    const words = (await this.backendProvider.fetchVocabulary()).words1

    for (let i = 0; i < 3; i++) {

      let randomWord = words[Math.floor(Math.random() * words.length)]

      while (this.generatedWords.indexOf(randomWord) != -1 || randomWord == this.generatedWord2)
        randomWord = words[Math.floor(Math.random() * words.length)]

      this.generatedWords.push(randomWord)

    }

  }

}