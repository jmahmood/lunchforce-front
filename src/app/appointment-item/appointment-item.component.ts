import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LunchAppointment} from '../app.model';
import {AppointmentService, EventsAPI} from '../appointment.service';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-appointment-item',
  templateUrl: './appointment-item.component.html',
  styleUrls: ['./appointment-item.component.css'],
  providers: []
})
export class AppointmentItemComponent implements OnInit {
  @Input() appointments: LunchAppointment[];
  @Input() allowJoiningEvent = false;
  @Output() joinEvent = new EventEmitter<Boolean>();


  joinAppointment(appointment_id: string): void {
    this.appointmentService.attend(this.authService.token, appointment_id).then( () => {
        return this.appointmentService.my(this.authService.token); // My appointments are refreshed.
      }
    ).then((res: EventsAPI) => {
      /*  This stuff only affects this particular component. */
      for (const appointment of res.appointments){
        if (appointment.id === appointment_id) {
          appointment.highlight = true;
        }
      }
      this.joinEvent.emit(true);
    }).catch( (err) => {
      console.log('Unhandled exception!');
      console.log(err);
    });
  }

  constructor(public appointmentService: AppointmentService, public authService: AuthService) { }

  ngOnInit() {}

  lg(string: String) {
    console.log(string);
  }
}
