import {AfterContentChecked, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
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
export class SearchComponent implements AfterContentChecked {
  @Input() foodOptions: FoodOptions[];
  @Input() locationOptions: LocationOptions[];
  @Output() joinEvent: EventEmitter<boolean>;
  @ViewChild('searchForm') searchForm: NgForm;


  searching(): boolean {
    return this.appointmentService.searching;
  }

  appointments() {
      return this.appointmentService.searchResults.youonly.concat(this.appointmentService.searchResults.everyone);
  }

  onAppointmentJoined(): void {
    this.navService.myevents();
    this.joinEvent.emit(true);
  }

  onSubmitSearch(): void {
    console.log('trigger search');
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

  ngAfterContentChecked() {
    this.searchForm.setValue({'date': new Date().toISOString().split('T')[0],
            'location': [],
            'bothsexes': false,
            'male': false,
            'female': false});
  }

}
