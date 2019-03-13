import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as languageList from './supportedLanguages.json';

@Injectable()
export class LanguageProvider {
  private language: BehaviorSubject<string>

  constructor() {
    this.language = new BehaviorSubject<string>(null)
  }

  setLanguage(language: string) {
    this.language.next(language)
  }

  getLanguage() {
    return this.language.asObservable()
  }

  getLanguageList() {
    return languageList
  }

  getLanguageNames() {
    return languageList.map(item => {
      // Simplify the name
      let name = item.name
      if (item.name.includes(','))
        name = item.name.split(',')[0]
      if (item.name.includes(';'))
        name = item.name.split(';')[0]
      return name
    })
  }

  getLanguageName(code: string): Promise<string> {
    return new Promise((resolve, reject) => {
      languageList.forEach(element => {
        if (element.code == code) resolve(element.name)
      })
      reject('No match')
    })
  }

  getLanguageCode(name: string): Promise<string> {
    return new Promise((resolve, reject) => {
      languageList.forEach(element => {
        if (element.name.includes(name)) resolve(element.code)
      })
      reject('No match')
    })
  }

}
