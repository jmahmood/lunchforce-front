import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../auth.service';
import {NavService} from '../nav.service';
import {NgForm} from '@angular/forms';
import {FoodOptions, LocationOptions} from '../init.service';

@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.css']
})
export class EnrollmentComponent implements OnInit {
  @ViewChild('enrollmentForm') enrollmentForm: NgForm;
  @Input() foodOptions: FoodOptions[];
  @Input() locationOptions: LocationOptions[];


  compareIdFn(l1: {id: string, name: string}, l2: {id: string, name: string}): boolean {
    return l1.id === l2.id;
  }

  onSubmitEnrollment(): void {
    // Ensure validity of form
    this.navService.waiting();
    this.authService.send_enrollment(this.enrollmentForm.value).then(() => {
      this.navService.login();
    }).catch(() => {
      this.navService.enrollment();
    });
  }

  constructor(public navService: NavService, public authService: AuthService) { }

  ngOnInit() {
  }


}
