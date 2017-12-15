import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {LunchAppointment} from './app.model';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {NgForm} from '@angular/forms';
import {AppointmentService, EventsAPI} from './appointment.service';
import {AuthService} from './auth.service';
import {InitService} from './init.service';


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
  providers: [AppointmentService, AuthService, InitService]
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
    setTimeout(
      () => {
          this.searchForm.setValue({'date': new Date().toISOString().split('T')[0],
                  'location': [],
                  'bothsexes': false,
                  'male': false,
                  'female': false});
      }, 250
    );
    this.state = 'search';
  }

  goPublicEvents() {
    this.state = 'publicevents';
  }

  goInvitedToEvents() {
    this.state = 'invitedto';
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
      return this.appointmentService.searchResults.youonly.concat(this.appointmentService.searchResults.everyone);
    }
  }

  compareIdFn(l1: {id: string, name: string}, l2: {id: string, name: string}): boolean {
    return l1.id === l2.id;
  }

  onAppointmentJoined(): void {
    this.state = 'myevents';
    this.joinedAppointment = true;
    setTimeout(() => { this.joinedAppointment = false; }, 1000);
  }

  onSubmitSearch(): void {
    console.log('trigger search');
    this.appointmentService.search(this.authService.token, this.searchForm).catch((err) => {
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
      const p1 = this.appointmentService.my(this.authService.token);
      const p2 = this.appointmentService.everyone(this.authService.token);
      const p3 = this.appointmentService.available(this.authService.token);
      const p4 = this.authService.my_profile();
      const p5 = this.appointmentService.invitations(this.authService.token);
      return Promise.all([p1, p2, p3, p4, p5]);
    }).then(() => {
      this.state = 'myevents';
    }).catch((err) => {
      this.state = 'login';
      if (err.status === 0) {
        this.authService.login.error_messages = ['Could not connect to server'];
      }
      console.log(err);
    });
  }

  constructor(private modalService: BsModalService,
              public authService: AuthService,
              public appointmentService: AppointmentService,
              public initService: InitService,
              ) {

  }
  ngOnInit() {
    this.authService.clear();
    this.state = 'login';

    this.foodOptions = [];
    this.initService.food_options().then( res => {
      this.foodOptions = res.food_options;
      console.log(this.foodOptions);
      return res;
    }).catch( err => {
      console.log('could not load food options');
      console.log(err);
    });

    this.locationOptions = [];
    this.initService.locations().then( res => {
      this.locationOptions = res.locations;
      console.log(this.locationOptions);
      return res;
    }).catch( err => {
      console.log('could not load food options');
      console.log(err);
    });
  }
}
