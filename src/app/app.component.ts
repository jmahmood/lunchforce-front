import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {LunchAppointment} from './app.model';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {AppointmentService} from './appointment.service';
import {AuthService} from './auth.service';
import {FoodOptions, InitService, LocationOptions} from './init.service';
import {NavService} from './nav.service';
import {CookieService} from 'ngx-cookie-service';


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

  modalRef: BsModalRef; // To trigger bootstrap modals.

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
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

  loginError() {
    const navService = this.navService;
    const authService = this.authService;
    return (err) => {
      navService.login();
      if (err.status === 400) {
        authService.login.error_messages = ['Invalid username or password'];
      }
      if (err.status === 0) {
        authService.login.error_messages = ['Could not connect to server'];
      }
      console.log(err);
    };
  }

  onLogin(data): void {
    console.log(data);
    this.authService.send_login(data).then(() => {
      console.log('Emitting event');
      this.onLoginTokenSet();
    }).catch(this.loginError());
  }


  onLoginTokenSet(): void {
    console.log('Event caught.');
    this.postLoginSetup().then( () => {
      this.navService.myevents();
      this.cookieService.set('login_token', this.authService.token);
    }).catch(this.loginError());
  }

  postLoginSetup(): Promise<any> {
      this.navService.loadmyevents();
      const p1 = this.appointmentService.my(this.authService.token);
      const p2 = this.appointmentService.everyone(this.authService.token);
      const p3 = this.appointmentService.available(this.authService.token);
      const p4 = this.authService.my_profile();
      const p5 = this.appointmentService.invitations(this.authService.token);
      return Promise.all([p1, p2, p3, p4, p5]);
  }

  constructor(private modalService: BsModalService,
              public authService: AuthService,
              public appointmentService: AppointmentService,
              public initService: InitService,
              public navService: NavService,
              public cookieService: CookieService
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

    if (this.authService.check_cookies(this.cookieService)) {
      console.log('We have a cookie set with the token information.');
      this.onLoginTokenSet();
    }

  }
}
