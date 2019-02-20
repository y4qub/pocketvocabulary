import { Injectable } from '@angular/core';
import { DateProvider } from '../date/date';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from 'firebase'

/*
  Generated class for the StreakProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StreakProvider {
  user: User
  constructor(public date: DateProvider, public db: AngularFireDatabase, public auth: AngularFireAuth) {
    this.auth.authState.subscribe((auth: User) => {
      this.user = auth
    })
  }

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate()
  }

  checkStreak() {
    if (!this.user) return
    this.db.database.ref(`users/${this.user.uid}/info`).once('value').then(snapshot => {
      if (!snapshot.val()['lastStreak']) return
      // Reset Practiced Words
      if (this.date.getToday() != snapshot.val()['lastActive'])
        this.db.database.ref(`users/${this.user.uid}/info`).update({ practicedWords: 0 })
      const ldd = snapshot.val()['lastStreak'].substring(0, 2)
      const lmm = snapshot.val()['lastStreak'].substring(3, 5)
      const lyyyy = snapshot.val()['lastStreak'].substring(6, 11)
      if (!(this.date.getDate().day - ldd <= 1 && lmm == this.date.getDate().month && lyyyy == this.date.getDate().year) &&
        !(ldd == this.daysInMonth(lmm, lyyyy) && this.date.getDate().day == 1 && this.date.getDate().month - lmm == 1 && lyyyy == this.date.getDate().year) &&
        !(ldd == 31 && this.date.getDate().day == 1 && lmm == 12 && this.date.getDate().month == 1 && this.date.getDate().year - lyyyy == 1)
      ) {
        // Reset Streak
        this.db.database.ref(`users/${this.user.uid}/info`).update({ streak: 0 })
      }
    }).catch(console.error)
  }

}
