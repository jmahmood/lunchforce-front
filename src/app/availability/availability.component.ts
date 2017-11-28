import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-availability',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent implements OnInit {
  view = 'month';
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  clickedDate: Date;

  constructor() { }

  ngOnInit() {
  }

}
