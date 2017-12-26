import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AppointmentService} from '../appointment.service';
import {AuthService} from '../auth.service';
import {NgForm} from '@angular/forms';
import {NavService} from '../nav.service';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css']
})
export class IntroductionComponent implements OnInit {
  @ViewChild('introductionForm') introductionForm: NgForm;

  ngOnInit() {
  }

  onSubmitIntroduction(): void {
    this.navService.waiting();
    console.log('waiting');
    this.authService.send_introduction(this.introductionForm.value).then(() => {
      this.navService.introductionsuccess();
      console.log('success');
    }).catch(() => {
      this.navService.introduction();
      console.log('failure');
    });
  }

  constructor(public appointmentService: AppointmentService, public authService: AuthService, public navService: NavService) { }

}
