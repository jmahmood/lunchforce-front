import {Component, OnInit} from '@angular/core';
import {LunchAppointment, LunchAppointmentSearchResults} from './app.model';
import {HttpClient} from '@angular/common/http';
import {reject} from 'q';

// TODO: XSS attack protection; https://docs.djangoproject.com/en/1.11/ref/csrf/

function *dateGenerator(initial_date: Date): IterableIterator<LunchAppointment> {
  yield new LunchAppointment(initial_date, null, []);
  for (let i = 1; i < 30; i++) {
    const app_date = new Date(initial_date.getTime() + i * 1000 * 60 * 60 * 24);
    yield new LunchAppointment(app_date, 'Awesome Lunch.com', ['Jack', 'Jill']);
  }
}

const SERVER_URL = 'http://localhost:8001/';
const ENROLLMENT_URL = SERVER_URL + 'Enrollment/Success/';
const LOGIN_URL = SERVER_URL + 'Login/Success/';
const MY_EVENTS_URL = SERVER_URL + 'MyEvents/Success/';
// const LOGIN_URL = SERVER_URL + 'Login/Failure/';
// const ENROLLMENT_URL = SERVER_URL + 'Enrollment/Failure/1/';

interface EventsAPI {
  success: boolean;
  message: string;
  appointments: LunchAppointment[];
}

interface LocationOptions {
  id: string;
  name: string;
}

interface FoodOptions {
  id: string;
  name: string;
}

interface EnrollmentAPI {
  success: boolean;
  message: string;
  error_fields: string[];
}

interface Login {
  email: string;
  password: string;
  submitted: boolean;
  error_messages: string[];
  success: boolean;
}

interface Enrollment {
  email: string;
  password: string;
  invitation_code: string;
  whitelist: string[];
  locations: string[];
  submitted: boolean;
  error_messages: string[];
  success: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  enrollment: Enrollment;
  login: Login;
  state: string;
  dateIterator: any;
  searchResultIterator: LunchAppointmentSearchResults[];
  searching: boolean;
  foodOptions: FoodOptions[];
  locationOptions: LocationOptions[];

  goEnrollment() {
    this.state = 'enrollment';
  }

  EnrollmentAPIPromise(): Promise<any> {
    return this.http.post(ENROLLMENT_URL, JSON.stringify(this.enrollment)).toPromise();
  }

  MyEventsAPIPromise(): Promise<any> {
    return this.http.get(MY_EVENTS_URL, JSON.stringify(this.enrollment)).toPromise();
  }

  LoginAPIPromise(): Promise<any> {
    this.login.submitted = true;
    return this.http.post(LOGIN_URL, JSON.stringify(this.login)).toPromise();
  }

  onSubmitEnrollment(): void {
    // Ensure validity of form
    this.enrollment.submitted = true;
    this.state = 'waiting';

    this.EnrollmentAPIPromise().then((res) => {
      console.log(res);
      if (!res.success) {
        return reject(res.message);
      }
      this.enrollment.success = true;
      this.state = 'login';
    }).catch((err) => {
      this.enrollment.error_messages = [err];
      this.state = 'enrollment';
    });
  }

  onSubmitLogin(): void {
    this.state = 'waiting';

    this.LoginAPIPromise().then((res) => {
      console.log(res);
      if (!res.success) {
        return reject('Login failed.  Please check your email and password');
      }
      this.login.success = true;
      this.state = 'loadmyevents';
    }).then((res) => {
      return this.MyEventsAPIPromise();
    }).then((res: EventsAPI) => {
      console.log(res);
      this.dateIterator = res.appointments;
      this.state = 'myevents'
    }).catch((err) => {
      this.state = 'login';
      this.login.error_messages = [err];
    });
  }

  constructor(private http: HttpClient) {
    this.enrollment = {
      'email': '',
      'password': '',
      'invitation_code': '',
      'whitelist': [],
      'locations': [],
      'submitted': false,
      'error_messages': [],
      'success': false
    };

    this.login = {
      'email': '',
      'password': '',
      'submitted': false,
      'error_messages': [],
      'success': false
    };

    this.state = 'login';
    this.dateIterator = [...dateGenerator(new Date())];
    this.searchResultIterator = [];
    this.searching = false;
    this.foodOptions = [
      {'id': '1', 'name': 'Chinese'},
      {'id': '2', 'name': 'Indian'},
      {'id': '3', 'name': 'Turkish'}
    ];
    this.locationOptions = [
      {'id': '1', 'name': 'Tokyo Office'},
      {'id': '2', 'name': 'Shinjuku Station'},
      {'id': '3', 'name': 'Koenji Station'}
    ];
  }
  ngOnInit() {  }

  OnInit() {}

}
