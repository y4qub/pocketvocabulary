import { Injectable } from '@angular/core';

/*
  Generated class for the DateProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DateProvider {

  constructor() { }

  getToday() {
    const date = new Date()
    const day = date.getDate()
    const dd = day < 10 ? `0${day}` : day
    const month = date.getMonth() + 1
    const mm = month < 10 ? `0${month}` : month
    const yyyy = date.getFullYear()
    const today = `${dd}/${mm}/${yyyy}`
    return today
  }

  getDate() {
    const date = new Date()
    const day = date.getDate()
    const dd = day < 10 ? +`0${day}` : day
    const month = date.getMonth() + 1
    const mm = month < 10 ? +`0${month}` : month
    const yyyy = date.getFullYear()
    return { day: dd, month: mm, year: yyyy }
  }

}
