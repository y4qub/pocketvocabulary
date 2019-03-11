import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { PracticeOptions, Words } from '../../interfaces';
import { BackendProvider } from '../backend/backend';

@Injectable()
export class PracticeProvider {


  private practiceOptions: PracticeOptions = {
    repeatWords: false,
    types: ['input'],
    translation: 0
  }
  private generatedIndexes: Array<number> = []
  private language: string

  constructor(private backendProvider: BackendProvider, private storage: Storage) {
    this.backendProvider.getLanguage().subscribe(language => this.language = language)
  }

  getPracticeOptions() {
    return this.practiceOptions
  }

  setPracticeOptions(practiceOptions: PracticeOptions) {
    this.storage.set('practiceOptions', practiceOptions)
  }

  async matches(word: string, answer: string) {
    const words = await this.assignWords()
    if (words.words2.includes(answer) && words.words2.indexOf(answer) == words.words1.indexOf(word))
      return true
    return false
  }

  async generateWord(): Promise<string> {
    const generatedWords = await this.assignWords()
    const index = this.generateIndex(generatedWords.words1)
    return generatedWords.words1[index]
  }

  private generateIndex(words1: Array<string>): number {
    let randomIndex = Math.floor(Math.random() * words1.length)
    if (words1.length != 1) {
      if (!this.practiceOptions.repeatWords) {
        // Reset array if full
        if (this.generatedIndexes.length == words1.length)
          this.generatedIndexes = []
        // Generate till the index is unique
        while (this.generatedIndexes.indexOf(randomIndex) != -1)
          randomIndex = Math.floor(Math.random() * words1.length)
        // Add to generatex indexes
        this.generatedIndexes.push(randomIndex)
      }
      return randomIndex
    } else {
      // One word
      return 0
    }
  }

  // Set words according to the translation way
  private async assignWords(): Promise<Words> {
    const words = await this.backendProvider.fetchWords(this.language)
    const wordsPrimary = { words1: words.words1, words2: words.words2 }
    const wordsSecondary = { words1: words.words2, words2: words.words1 }
    let newWords: Words
    if (this.practiceOptions.translation == 0) {
      newWords = wordsPrimary
    } else if (this.practiceOptions.translation == 1) {
      newWords = wordsSecondary
    } else if (this.practiceOptions.translation == 2) {
      if (Math.random() >= 0.5) {
        newWords = wordsPrimary
      } else {
        newWords = wordsSecondary
      }
    }
    return newWords
  }

}
