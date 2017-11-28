import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import {getWeek} from "ngx-bootstrap/bs-moment/units/week";


function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 7 - (d.getUTCDay() || 7));
    // Get first day of year
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    const weekNo = Math.ceil(( ( (d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    // Return array of year and week number
    return [d.getUTCFullYear(), weekNo];
}


@Component({
  selector: 'app-availability',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent implements OnInit {
  selected_dates: {} = {};
  selected_dates_array: string[] = []
  display_dates: Date[] = [];
  current: Date;
  today: Date;

  submitAvailability(): void {
    console.log('Submitting availability to server');

  }

  // Get all days for this month; includes days to round out the week, and removes any old days before the start of the current week,
  // since tehre is no point (yet) in showing htem.

  getDaysInMonth(month: number, year: number): Date[] {
     const lastweek = new Date(year, month, 1);
     lastweek.setDate(lastweek.getDate() - 6);
     const d = new Date(year, month, 1);
     const days: Date[] = [];

     while (lastweek.getMonth() < month) {
       if (getWeekNumber(lastweek)[1] === getWeekNumber(d)[1] && getWeekNumber(d) >= getWeekNumber(this.today)) {
        days.push(new Date(lastweek));
       }
       lastweek.setDate(lastweek.getDate() + 1);
     }


     while (d.getMonth() === month) {
       if (getWeekNumber(d) >= getWeekNumber(this.today)) {
         days.push(new Date(d));
       }
       d.setDate(d.getDate() + 1);
     }


     while (getWeekNumber(d)[1] === getWeekNumber(this.today)[1]) {
       days.push(new Date(d));
       d.setDate(d.getDate() + 1);
     }
     return days;
  }

  constructor() { }

  ngOnInit() {
    this.current = new Date();
    this.today = new Date();
    this.set_display_dates();
  }

  toggle_date(d: Date): boolean {
    // Returns true if it is selected now, or false if it is not.
    const k = d.toISOString().split('T')[0];

    if (d > this.today) {
      this.selected_dates[k] = !this.selected_dates[k];
    } else {
      console.log('You cannot make yourself retroactively available.');
    }
    if (!this.selected_dates[k]){
      delete(this.selected_dates[k]);
    }
    this.set_selected_dates();
    return this.selected_dates[d.toISOString().split('T')[0]];
  }

  is_selected_date(d: Date): boolean {
    return this.selected_dates[d.toISOString().split('T')[0]];
  }

  set_display_dates(): void {
    this.display_dates = this.getDaysInMonth(this.current.getMonth(), this.current.getFullYear());
  }

  set_selected_dates(): void {
    const ret = Object.keys(this.selected_dates);
    ret.sort();
    this.selected_dates_array = ret.slice(0, 5);
  }

  next_month() {
    this.current.setMonth(this.current.getMonth() + 1);
    this.set_display_dates();
  }

  prev_month() {
    this.current.setMonth(this.current.getMonth() - 1);
    if ((this.current.getFullYear() === this.today.getFullYear() && this.current.getMonth() < this.today.getMonth()) ||
      (this.current.getFullYear() < this.today.getFullYear())) {
      this.current = Object.assign(new Date(), this.today);
      return;
    }
    this.set_display_dates();
  }
}
