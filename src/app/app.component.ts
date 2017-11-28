import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {LunchAppointment} from './app.model';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {NgForm} from '@angular/forms';
import {AppointmentService, EventsAPI} from './appointment.service';
import {AuthService} from './auth.service';

interface LocationOptions {
  id: string;
  name: string;
}

interface FoodOptions {
  id: string;
  name: string;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AppointmentService, AuthService]
})


export class AppComponent implements OnInit {
  state: string;
  joinedAppointment = false;
  foodOptions: FoodOptions[];
  locationOptions: LocationOptions[];
  errormodal_message: string;

  @ViewChild('errorModal') private errorModal: TemplateRef<any>;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('enrollmentForm') enrollmentForm: NgForm;
  @ViewChild('loginForm') loginForm: NgForm;
  @ViewChild('invitationForm') invitationForm: NgForm;

  modalRef: BsModalRef; // To trigger bootstrap modals.

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  goLogout() {
    this.authService.logout().then( () => {
      console.log('Logout Successful.');
      this.authService.clear();
      this.appointmentService.clear();
      this.state = 'login';
    }).catch(() => {
      console.log('failure while logging out; are you still connected to the internet?  Check our uptime at ()');
      this.errormodal_message = 'failure while logging out; are you still connected to the internet?  Check our uptime at';
      this.openModal(this.errorModal);
    });
  }

  goInvitation() {
    this.authService.blank_invitation();
    this.state = 'invitation';
  }

  goAvailability() {
    this.state = 'availability';
  }

  goSearch() {
    this.state = 'search';
  }

  goPublicEvents() {
    this.state = 'publicevents';
  }

  goMyEvents() {
    this.state = 'myevents';
  }

  goLogin() {
    this.state = 'login';
  }

  goProfile() {
    this.state = 'profile';
  }

  goEnrollment() {
    this.state = 'enrollment';
  }

  searching(): boolean {
    return this.appointmentService.searching;
  }

  appointments(): LunchAppointment[] {
    if (this.state === 'myevents') {
      return this.appointmentService.myAppointments.appointments;
    }

    if (this.state === 'publicevents') {
      return this.appointmentService.everyoneAppointments.appointments;
    }

    if (this.state === 'search' && this.appointmentService.searchResults) {
      return this.appointmentService.searchResults.appointments;
    }
  }

  onAppointmentJoined(): void {
    this.state = 'myevents';
    this.joinedAppointment = true;
    setTimeout(() => { this.joinedAppointment = false; }, 1000);
  }

  onSubmitSearch(): void {
    this.appointmentService.search(this.searchForm).catch((err) => {
      console.log('Search Error!');
      console.log(err);
    });
  }

  onSubmitInvitation(): void {
    this.state = 'waiting';
    this.authService.send_invitation(this.invitationForm.value).then(() => {
      this.state = 'invitationsuccess';
    }).catch(() => {
      this.state = 'invitation';
    });
  }

  onSubmitEnrollment(): void {
    // Ensure validity of form
    this.state = 'waiting';
    this.authService.send_enrollment(this.enrollmentForm.value).then(() => {
      this.state = 'login';
    }).catch(() => {
      this.state = 'enrollment';
    });
  }


  onSubmitProfileForm(): void {
    this.authService.send_profile_change().catch( (err) => {
      console.log(err);
    });
  }

  onSubmitLogin(): void {
    // We need to load our own events, and the public / 'Everyone' appointments

    this.state = 'waiting';
    this.authService.send_login(this.loginForm.value).then(() => {
      this.state = 'loadmyevents';
      const p1 = this.appointmentService.my();
      const p2 = this.appointmentService.everyone();
      return Promise.all([p1, p2]);
    }).then(() => {
      this.state = 'myevents';
    }).catch((err) => {
      this.state = 'login';
      console.log(err);
    });
  }

  constructor(private modalService: BsModalService,
              public authService: AuthService,
              public appointmentService: AppointmentService) {

  }
  ngOnInit() {
    this.authService.clear();
    this.state = 'login';

    this.foodOptions = [
      {'id': '1', 'name': 'Chinese'},
      {'id': '2', 'name': 'Indian'},
      {'id': '3', 'name': 'Turkish'}
    ];
    this.locationOptions = [
      {'id': '1', 'name': 'Tokyo Office'},
      {'id': '2', 'name': 'Shinjuku Station'},
      {'id': '3', 'name': 'Koenji Station'}
    ];
  }
}
