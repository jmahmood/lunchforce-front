import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {NavService} from '../nav.service';
import {AuthService} from '../auth.service';
import {AppointmentService} from '../appointment.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm: NgForm;
  @Output() loginEvent = new EventEmitter<Boolean>();

  constructor(public authService: AuthService, public navService: NavService, public appointmentService: AppointmentService) { }

  ngOnInit() {
  }

  onSubmitLogin(): void {
    // We need to load our own events, and the public / 'Everyone' appointments
    this.navService.waiting();
    this.loginEvent.emit(this.loginForm.value);
  }

  fliplink($event) {
    console.log($event);
    $event.path[3].classList.toggle('flipped');

  }
}
