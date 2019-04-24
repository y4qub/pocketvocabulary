import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { PracticeOptions, Words } from '../../interfaces';
import { BackendProvider } from '../backend/backend';

@Injectable()
export class PracticeProvider {

  private word2: string

  private practiceOptions: PracticeOptions = {
    repeatWords: false,
    translation: 0,
    types: ['yesno']

  }
  private generatedIndexes: Array<number> = []

  constructor(private backendProvider: BackendProvider, private storage: Storage) {
  }

  getPracticeOptions() {
    return this.practiceOptions
  }

  setPracticeOptions(practiceOptions: PracticeOptions) {
    this.storage.set('practiceOptions', practiceOptions)
  }

  getSecondWord() {
    return this.word2
  }

  async matches(answer: string) {
    // if(options.normalizeInput)
    if (!answer) return
    const answerNormalized = answer.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const wordNormalized = this.word2.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    if (answerNormalized == wordNormalized)
      return true
    return false
  }

  async generateWord(): Promise<string> {
    const generatedWords = await this.assignWords()
    const index = this.generateIndex(generatedWords.words1)
    this.word2 = generatedWords.words2[index]
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
    const words = await this.backendProvider.fetchVocabulary()
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
