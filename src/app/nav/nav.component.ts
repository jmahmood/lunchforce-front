import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {AppointmentService} from '../appointment.service';
import {NavService} from '../nav.service';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(public authService: AuthService,
              public appointmentService: AppointmentService,
              public navService: NavService,
              public cookieService: CookieService) {
  }

  ngOnInit() {
  }

  goLogout() {
    this.authService.logout(this.cookieService).then( () => {
      console.log('Logout Successful.');
      this.authService.clear();
      this.appointmentService.clear();
      this.navService.login();
    }).catch((err) => {
      console.log(err);
      console.log('failure while logging out; are you still connected to the internet?  Check our uptime at ()');
      /*
        this.errormodal_message = 'failure while logging out; are you still connected to the internet?  Check our uptime at';
        this.openModal(this.errorModal);
      */
    });
  }


}
