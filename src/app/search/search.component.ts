import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FoodOptions, LocationOptions} from '../init.service';
import {AuthService} from '../auth.service';
import {AppointmentService} from '../appointment.service';
import {NavService} from '../nav.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @Input() foodOptions: FoodOptions[];
  @Input() locationOptions: LocationOptions[];
  @Output() joinEvent: EventEmitter<boolean>;
  @ViewChild('searchForm') searchForm: NgForm;
  searching = false;

  appointments() {
    // Returns a list of all possible appointments for search conditions provided.
    if (!this.appointmentService.searchResults) {
      return [];
    }
    return this.appointmentService.searchResults.youonly.concat(this.appointmentService.searchResults.everyone);
  }

  onAppointmentJoined(): void {
    this.navService.myevents();
    this.joinEvent.emit(true);
  }

  onSubmitSearch(): void {
    console.log('trigger search');
    this.searching = true;
    this.appointmentService.search(this.authService.token, this.searchForm).catch((err) => {
      console.log('Search Error!');
      console.log(err);
    });
  }

  compareIdFn(l1: {id: string, name: string}, l2: {id: string, name: string}): boolean {
    return l1.id === l2.id;
  }

  constructor(public authService: AuthService,
              public appointmentService: AppointmentService,
              public navService: NavService) {
  }

  ngOnInit() {
    setTimeout( () => {
      this.searchForm.form.controls.date.setValue(new Date().toISOString().split('T')[0]);
    }, 1500);
  }

}
