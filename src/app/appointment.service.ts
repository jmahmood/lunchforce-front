import { Injectable } from '@angular/core';
import {LunchAppointment} from './app.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NgForm} from '@angular/forms';
import {reject} from 'q';



export interface JoinEventAPI {
  success: boolean;
  message: string;
}

export interface SearchAPI {
  success: boolean;
  message: string;
  everyone: LunchAppointment[];
  youonly: LunchAppointment[];
}

export interface EventsAPI {
  success: boolean;
  message: string;
  appointments: LunchAppointment[];
}

export interface Availability {
  date_str: string;
  date: Date;
  in_use: boolean;
}

export interface GetAvailablilityAPI {
  success: boolean;
  message: string;
  availability: Availability[];
}

export interface SetAvailablilityAPI {
  success: boolean;
  message: string;
  errors: string[];
  availability: Availability[];
}


// https://jbm-lunchforce-staging.herokuapp.com/api/my-appointments/
const SEARCH_URL = 'https://jbm-lunchforce-staging.herokuapp.com/api/search/';
const ATTEND_EVENT_URL = 'https://jbm-lunchforce-staging.herokuapp.com/api/attend/';
const MY_EVENTS_URL = 'https://jbm-lunchforce-staging.herokuapp.com/api/my-appointments/';
const PUBLIC_EVENTS_URL = 'https://jbm-lunchforce-staging.herokuapp.com/api/public-appointments/';
const INVITATEDTO_URL = 'https://jbm-lunchforce-staging.herokuapp.com/api/invitedto-appointments/';
const MY_AVAILABILITY_URL = 'https://jbm-lunchforce-staging.herokuapp.com/api/my-availability/';
const UPDATE_AVAILABILITY_URL = 'https://jbm-lunchforce-staging.herokuapp.com/api/update-availability/';


@Injectable()
export class AppointmentService {
  myInvitations: EventsAPI;
  // Accessing appointments happens from here.
  searchResults: SearchAPI = null;
  myAppointments: EventsAPI;
  everyoneAppointments: EventsAPI;
  myAvailability: GetAvailablilityAPI;

  clear(): void {
    this.searchResults = null;
    this.myAppointments = null;
    this.myAvailability = null;
    this.everyoneAppointments = null;
  }

  constructor(private http: HttpClient) { }

  set_availability_dates(): void {
    for (const avail of this.myAvailability.availability) {
      avail.date = new Date(avail.date_str);
    }
  }

  send_availability(auth_token: String, month: number, availableOn: String[]): Promise<any> {
    const token_header = new HttpHeaders().set('Authorization', 'Token ' + auth_token);
    return this.http.post(UPDATE_AVAILABILITY_URL, {month: month, date: availableOn},
      {'headers': token_header}).toPromise().then((res: SetAvailablilityAPI) => {
      if (!res.success) {
        return reject(res.message);
      }
      console.log(res);
      this.myAvailability = {success: res.success, availability: res.availability, message: res.message};
      this.set_availability_dates();
      return res;
    });
  }

  available(auth_token: String): Promise<any> {
    const token_header = new HttpHeaders().set('Authorization', 'Token ' + auth_token);
    return this.http.get(MY_AVAILABILITY_URL, {'headers': token_header}).toPromise().then((res: GetAvailablilityAPI) => {
      this.myAvailability = res;
      this.set_availability_dates();
      console.log('my current availability');
      console.log(this.myAvailability);
      return res;
    });

  }

  search(auth_token: String, searchForm: NgForm): Promise<any> {
    const token_header = new HttpHeaders().set('Authorization', 'Token ' + auth_token);
    return this.http.post(SEARCH_URL, searchForm.value, {headers: token_header}).toPromise().then(
      (res: SearchAPI) => {
      console.log('Search results');
      console.log(res);

      if (!res.success) {
        return reject(res.message);
      }
      this.searchResults = res;
      console.log('search results');
      console.log(res);
      return res;
    });
  }

  attend(auth_token: String, appointment_id: string): Promise<any> {
    const token_header = new HttpHeaders().set('Authorization', 'Token ' + auth_token);
    return this.http.post(ATTEND_EVENT_URL,
      {'appointment_id': appointment_id}, {'headers': token_header}).toPromise().then((res: JoinEventAPI) => {
      console.log(res);
      if (!res.success) {
        return reject(res.message);
      }
      return res;
    });
  }

  my(auth_token: String): Promise<any> {
    const token_header = new HttpHeaders().set('Authorization', 'Token ' + auth_token);
    return this.http.get(MY_EVENTS_URL, {'headers': token_header}).toPromise().then((res: EventsAPI) => {
      if (!res.success) {
        return reject(res.message);
      }
      this.myAppointments = res;
      console.log('my appointments');
      console.log(res);
      return res;
    });
  }

  invitations(auth_token: String): Promise<any> {
    // "Public" is a reserved word, so we go with the term "Everyone"
    const token_header = new HttpHeaders().set('Authorization', 'Token ' + auth_token);
    return this.http.get(INVITATEDTO_URL, {'headers': token_header}).toPromise().then((res: EventsAPI) => {
      if (!res.success) {
        return reject(res.message);
      }
      console.log('my invitations');
      console.log(res);
      this.myInvitations = res;
      return res;
    });
  }

  everyone(auth_token: String): Promise<any> {
    // "Public" is a reserved word, so we go with the term "Everyone"
    const token_header = new HttpHeaders().set('Authorization', 'Token ' + auth_token);
    return this.http.get(PUBLIC_EVENTS_URL, {'headers': token_header}).toPromise().then((res: EventsAPI) => {
      if (!res.success) {
        return reject(res.message);
      }
      console.log('public appointments');
      console.log(res);
      this.everyoneAppointments = res;
      return res;
    });
  }


}
