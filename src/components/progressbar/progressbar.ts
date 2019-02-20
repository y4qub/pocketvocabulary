import { Component, Input, OnChanges } from '@angular/core';

/**
 * Generated class for the ProgressbarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'progressbar',
  templateUrl: 'progressbar.html'
})
export class ProgressbarComponent implements OnChanges {
  @Input('rating') rating: number
  @Input('score') score: number
  @Input('attempts') attempts: number
  rateColor: string = 'hsl(0, 100%, 50%)'

  ngOnChanges() {
    // Set color based on the rating
    let rating120 = this.rating / 100 * 120
    if (this.rating < 90) rating120 /= 2
    this.rateColor = `hsl(${rating120}, 100%, 50%)`
  }

}
