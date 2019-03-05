import { Component } from '@angular/core';

/**
 * Generated class for the InputComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'practice-input',
  templateUrl: 'input.html'
})
export class InputComponent {

  text: string;

  constructor() {
    console.log('Hello InputComponent Component');
    this.text = 'Hello World';
  }

}
