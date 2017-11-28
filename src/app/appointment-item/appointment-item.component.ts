import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LunchAppointment} from '../app.model';
import {AppointmentService, EventsAPI} from '../appointment.service';

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
    console.log('Component');
    this.appointmentService.join(event_id).then( () => {
        return this.appointmentService.my(); // My appointments are refreshed.
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

  constructor(public appointmentService: AppointmentService) { }

  ngOnInit() {}

}
