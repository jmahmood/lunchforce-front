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
  appointments: LunchAppointment[];
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


// http://localhost:8000/api/my-appointments/
const SERVER_URL = 'http://localhost:8001/';
const SEARCH_URL = SERVER_URL + 'Search/Success/';
const JOIN_EVENT_URL = SERVER_URL + 'Events/Join/Success/';
const MY_EVENTS_URL = 'http://localhost:8000/api/my-appointments/';
const PUBLIC_EVENTS_URL = 'http://localhost:8000/api/public-appointments/';
const MY_AVAILABILITY_URL = 'http://localhost:8000/api/my-availability/';
const UPDATE_AVAILABILITY_URL = 'http://localhost:8000/api/update-availability/';


@Injectable()
export class AppointmentService {
  // Accessing appointments happens from here.
  searching = false;
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

  search(searchForm: NgForm): Promise<any> {
    return this.http.post(SEARCH_URL, searchForm.value).toPromise().then(
      (res: SearchAPI) => {
      console.log('Search results');
      console.log(res);
      this.searching = true;

      if (!res.success) {
        return reject(res.message);
      }
      this.searchResults = res;
      console.log('search results');
      console.log(res);
      return res;
    });
  }

  join(event_id: string): Promise<any> {
    return this.http.post(JOIN_EVENT_URL,
      JSON.stringify({'event_id': event_id})).toPromise().then((res: JoinEventAPI) => {
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
