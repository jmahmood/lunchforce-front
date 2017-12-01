import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LunchAppointment} from '../app.model';
import {AppointmentService, EventsAPI} from '../appointment.service';
import {AuthService} from "../auth.service";

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


  joinAppointment(event_id: string): void {
    this.appointmentService.join(event_id).then( () => {
        return this.appointmentService.my(this.authService.token); // My appointments are refreshed.
      }
    ).then((res: EventsAPI) => {
      /*  This stuff only affects this particular component. */
      for (const lunch_event of res.appointments){
        if (lunch_event.id === event_id) {
          lunch_event.highlight = true;
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
