import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {reject} from 'q';
import {CookieService} from 'ngx-cookie-service';

// TODO
const INTRODUCTION_URL = 'https://jbm-lunchforce-staging.herokuapp.com/api/introduce/';
const ENROLLMENT_URL = 'https://jbm-lunchforce-staging.herokuapp.com/api/enroll/';

//  Done
const LOGIN_URL = 'https://jbm-lunchforce-staging.herokuapp.com/api-token-auth/';
const LOGOUT_URL = 'https://jbm-lunchforce-staging.herokuapp.com/logout/';
const GET_PROFILE_URL = 'https://jbm-lunchforce-staging.herokuapp.com/api/my-profile/';
const PROFILE_UPDATE_URL = 'https://jbm-lunchforce-staging.herokuapp.com/api/update-profile/';

export interface LogoutAPI {
  success: boolean;
  error_messages: string[];
}

export interface IntroductionAPI {
  introduction_code: string;
  email: string;
  success: boolean;
  message: string;
}

export interface ProfileAPI {
  success: boolean;
  message: string;
}

export interface EnrollmentPostAPI {
  enrollmentEmail: string;
  enrollmentIntroductionCode: string;
  enrollmentPassword: string;
  selectLocation: string;
  selectWhitelist: string;
}

export interface IntroductionPostAPI {
  introductionEmail: string;
}

export interface LoginPostAPI {
  loginFormEmail: string;
  loginFormPassword: string;
}

export interface EnrollmentAPI {
  success: boolean;
  message: string;
}

export interface Introduction {
  email: string;
  introduction_code: string;
  submitted: boolean;
  message: string;
}

export interface ProfileDetails {
  profile: {
    email: string;
    name: string;
    locations: [{id: string, name: string}];
    whitelist: [{id: string, name: string}];
  };
  success: boolean;
  message: string;
  updated: boolean;
}

export interface LoginAPIResponse {
  token: string; // This is used to allow logins.
}

export interface Login {
  email: string;
  password: string;
  submitted: boolean;
  error_messages: string[];
  success: boolean;
}

export interface Enrollment {
  submitted: boolean;
  error_messages: string[];
  success: boolean;
}

@Injectable()
export class AuthService {
  enrollment: Enrollment;
  introduction: Introduction;
  profile: ProfileDetails;
  login: Login;
  token: string;


  blank_login(): void {
    this.login = {
        'email': '',
        'password': '',
        'submitted': false,
        'error_messages': [],
        'success': false
      };
  }

  blank_introduction(): void {
    this.introduction = {
        'email': '',
        'introduction_code': '',
        'submitted': false,
        'message': ''
      };
  }

  blank_enrollment(): void {
    this.enrollment = {
      'submitted': false,
      'error_messages': [],
      'success': false
    };
  }

  clear(): void {
      this.blank_login();
      this.blank_introduction();
      this.blank_enrollment();
  }

  is_selected_location(location_id): boolean {
    for (const l of this.profile.profile.locations) {
      console.log('Comparing ' + location_id + ' to ' + l.id);
      if (l.id === location_id) {
        console.log('match found');
        return true;
      }
    }
    return false;
  }

  send_introduction(introduction_post_data: IntroductionPostAPI): Promise<any> {
    // Ensure logged in.
    // Add API to backend
    // Ensure this is checked when someone enrolls.
    // Only Salesforce.com emails are acceptable
    const token_header = new HttpHeaders().set('Authorization', 'Token ' + this.token);
    this.introduction.submitted = true;
    this.login.submitted = true;
    this.introduction.email = introduction_post_data.introductionEmail;
    return this.http.post(INTRODUCTION_URL, introduction_post_data, {'headers': token_header}).toPromise().then((res: IntroductionAPI) => {
      if (!res.success) {
        this.introduction.message = res.message;
        return reject(res.message);
      }
      this.introduction.introduction_code = res.introduction_code;
      this.introduction.email = res.email;
      this.introduction.message = '';
    });
  }

  // Moving to using Login API etc
  send_enrollment(enrollment_post_data: EnrollmentPostAPI): Promise<any> {
    // Anyone can enroll, given that they have a valid api code.
    this.enrollment.submitted = true;
    return this.http.post(ENROLLMENT_URL, enrollment_post_data).toPromise().then((res: EnrollmentAPI) => {
      console.log(res);
      if (!res.success) {
        this.enrollment.success = false;
        this.enrollment.error_messages = [res.message];
        return reject(res.message);
      }
      this.enrollment.success = true;
    });
  }

  send_profile_change(): Promise<any> {
    const token_header = new HttpHeaders().set('Authorization', 'Token ' + this.token);
    return this.http.post(PROFILE_UPDATE_URL, this.profile, {'headers': token_header}).toPromise().then( (res: ProfileAPI) => {
      this.profile.updated = res.success;

      if (!res.success) {
        this.profile.updated = true;
        this.profile.message = res.message;
        return reject(res.message);
      }
      setTimeout(() => { this.profile.updated = false; }, 1000);
    });
  }

  my_profile(): Promise<any> {
    const token_header = new HttpHeaders().set('Authorization', 'Token ' + this.token);
    return this.http.get(GET_PROFILE_URL, {'headers': token_header}).toPromise().then((res: ProfileDetails) => {
      if (!res.success) {
        this.login.error_messages = [res.message];
        return reject('Login failed.  Please check your email and password');
      }
      this.profile = res;
      this.profile.updated = false;

      console.log('setting profile');
      console.log(this.profile);
      this.login.success = true;
      return res;
    });
  }

  send_login(login_data: LoginPostAPI): Promise<any> {
    this.login.submitted = true;
    const prom = this.http.post(LOGIN_URL,
      {
        'username': login_data.loginFormEmail,
        'password': login_data.loginFormPassword}).toPromise();
    this.login.password = ''; // Delete the login password after we submit.
    return prom.then((res: LoginAPIResponse) => {
      console.log('login api response');
      console.log(res);
      this.token = res.token;
    });
 }

 check_cookies(cookieService: CookieService): boolean {
   const token = cookieService.get('login_token');
   if (token) {
     this.token = token;
     return true;
   }
   return false;
 }

  logout(cookieService: CookieService): Promise<any> {
    const token_header = new HttpHeaders().set('Authorization', 'Token ' + this.token);

    return this.http.get(LOGOUT_URL, {'headers': token_header}).toPromise().then( (res: LogoutAPI) => {
      if (!res.success) {
        return reject('Failure while logging out.');
      }
      cookieService.deleteAll();
      this.clear();
      return res;
    });
  }

  constructor(private http: HttpClient) { }

}
