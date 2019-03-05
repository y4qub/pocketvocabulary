import { Component } from '@angular/core';

/**
 * Generated class for the OptionsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'practice-options',
  templateUrl: 'options.html'
})
export class OptionsComponent {
  language: string = 'Dutch'
  currentLanguage: string = 'English'
  practiceOptions: Object = { repeatWords: false, types: [0, 1], translation: 2 }
  selectOptions = { cssClass: 'alertDark' }
  constructor() {
  }

  start() {

  }

}
