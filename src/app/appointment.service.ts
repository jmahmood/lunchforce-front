import { Injectable } from '@angular/core';
import {LunchAppointment} from './app.model';
import {HttpClient} from '@angular/common/http';
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


const SERVER_URL = 'http://localhost:8001/';
const SEARCH_URL = SERVER_URL + 'Search/Success/';
const JOIN_EVENT_URL = SERVER_URL + 'Events/Join/Success/';
const MY_EVENTS_URL = SERVER_URL + 'MyEvents/Success/1/';
const PUBLIC_EVENTS_URL = SERVER_URL + 'PublicEvents/Success/';
const MY_AVAILABILITY_URL = SERVER_URL + 'Availability/Get/Success/';
const UPDATE_AVAILABILITY_URL = SERVER_URL + 'Availability/Update/Success/';


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

  send_availablility(availableOn: Date[]): Promise<any> {
    return this.http.post(UPDATE_AVAILABILITY_URL, availableOn).toPromise().then((res: SetAvailablilityAPI) => {
      if (!res.success) {
        return reject(res.message);
      }
      console.log(res);
      this.myAvailability = {success: res.success, availability: res.availability, message: res.message};
      this.set_availability_dates();
      return res;
    });
  }

  available(): Promise<any> {
    return this.http.get(MY_AVAILABILITY_URL).toPromise().then((res: GetAvailablilityAPI) => {
      this.myAvailability = res;
      console.log(this.myAvailability);
      this.set_availability_dates();
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
    });
  }

  join(event_id: string): Promise<any> {
    console.log('Service');
    return this.http.post(JOIN_EVENT_URL,
      JSON.stringify({'event_id': event_id})).toPromise().then((res: JoinEventAPI) => {
      console.log(res);
      if (!res.success) {
        return reject(res.message);
      }
      return res;
    });
  }

  my(): Promise<any> {
    return this.http.get(MY_EVENTS_URL).toPromise().then((res: EventsAPI) => {
      this.myAppointments = res;
      return res;
    });
  }

  everyone(): Promise<any> {
    // "Public" is a reserved word, so we go with the term "Everyone"
    return this.http.get(PUBLIC_EVENTS_URL).toPromise().then((res: EventsAPI) => {
      this.everyoneAppointments = res;
      return res;
    });
  }


}
