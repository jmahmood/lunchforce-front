import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {LunchAppointment} from './app.model';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {NgForm} from '@angular/forms';
import {AppointmentService} from './appointment.service';
import {AuthService} from './auth.service';
import {FoodOptions, InitService, LocationOptions} from './init.service';
import {NavService} from './nav.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AppointmentService, AuthService, InitService, NavService]
})


export class AppComponent implements OnInit {
  joinedAppointment = false;
  foodOptions: FoodOptions[];
  locationOptions: LocationOptions[];
  errormodal_message: string;


  @ViewChild('errorModal') private errorModal: TemplateRef<any>;
  @ViewChild('loginForm') loginForm: NgForm;

  modalRef: BsModalRef; // To trigger bootstrap modals.

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  goLogout() {
    this.authService.logout().then( () => {
      console.log('Logout Successful.');
      this.authService.clear();
      this.appointmentService.clear();
      this.navService.login();
    }).catch(() => {
      console.log('failure while logging out; are you still connected to the internet?  Check our uptime at ()');
      this.errormodal_message = 'failure while logging out; are you still connected to the internet?  Check our uptime at';
      this.openModal(this.errorModal);
    });
  }

  goSearch() {
    this.navService.search();
  }


  goInvitedToEvents() {
    this.navService.invitedto();
  }

  goMyEvents() {
    this.navService.myevents();
  }

  goLogin() {
    this.navService.login();
  }

  goProfile() {
    this.navService.profile();
  }

  goEnrollment() {
    this.navService.enrollment();
  }

  appointments(): LunchAppointment[] {
    if (this.navService.is('myevents')) {
      return this.appointmentService.myAppointments.appointments;
    }

    if (this.navService.is('publicevents')) {
      return this.appointmentService.everyoneAppointments.appointments;
    }

    if (this.navService.is('search') && this.appointmentService.searchResults) {
      return this.appointmentService.searchResults.youonly.concat(this.appointmentService.searchResults.everyone);
    }
  }

  onAppointmentJoined(): void {
    this.navService.myevents();
    this.joinedAppointment = true;
    setTimeout(() => { this.joinedAppointment = false; }, 1000);
  }

  onSubmitLogin(): void {
    // We need to load our own events, and the public / 'Everyone' appointments

    this.navService.waiting();
    this.authService.send_login(this.loginForm.value).then(() => {
      this.navService.loadmyevents();
      const p1 = this.appointmentService.my(this.authService.token);
      const p2 = this.appointmentService.everyone(this.authService.token);
      const p3 = this.appointmentService.available(this.authService.token);
      const p4 = this.authService.my_profile();
      const p5 = this.appointmentService.invitations(this.authService.token);
      return Promise.all([p1, p2, p3, p4, p5]);
    }).then(() => {
      this.navService.myevents();
    }).catch((err) => {
      this.navService.login();
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
              public navService: NavService
              ) {

  }
  ngOnInit() {
    this.authService.clear();
    this.navService.login();

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
