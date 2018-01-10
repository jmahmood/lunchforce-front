import { Component, OnInit } from '@angular/core';
import {AppointmentService} from '../appointment.service';
import {AuthService} from '../auth.service';
import {NavService} from '../nav.service';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {
  joinedAppointment = false;

  goAvailability() {
    this.navService.availability();
  }

  goPublicEvents() {
    this.navService.publicevents();
  }

  constructor(public appointmentService: AppointmentService, public authService: AuthService, public navService: NavService) { }

  ngOnInit() {
  }

}
