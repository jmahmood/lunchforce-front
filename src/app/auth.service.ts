import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http';
import {reject} from 'q';

const SERVER_URL = 'http://localhost:8001/';
const ENROLLMENT_URL = SERVER_URL + 'Enrollment/Success/';
const LOGIN_URL = SERVER_URL + 'Login/Success/';
// const LOGIN_URL = SERVER_URL + 'Login/Failure/';
const INVITATION_URL = SERVER_URL + 'InvitationCode/Create/Success/';
const PROFILE_UPDATE_URL = SERVER_URL + 'Profile/Success/';
const LOGOUT_URL = SERVER_URL + 'Logout/Success/';

export interface LogoutAPI {
  success: boolean;
  error_messages: string[];
}

export interface Availability {
  date: Date;
  in_use: boolean;
}

export interface SetAvailablilityAPI {
  success: boolean;
  message: string;
  availability: Availability[];
}

export interface InvitationAPI {
  invitation_code: string;
  success: boolean;
  error_message: string;
}

export interface ProfileAPI {
  success: boolean;
  message: string;
}

export interface EnrollmentPostAPI {
  enrollmentEmail: string;
  enrollmentInvitationCode: string;
  enrollmentPassword: string;
  selectLocation: string;
  selectWhitelist: string;
}

export interface InvitationPostAPI {
  invitationEmail: string;
}

export interface LoginPostAPI {
  loginFormEmail: string;
  loginFormPassword: string;
}

export interface EnrollmentAPI {
  success: boolean;
  message: string;
  error_fields: string[];
}

export interface Invitation {
  email: string;
  invitation_code: string;
  submitted: boolean;
  error_messages: string[];
}

export interface ProfileDetails {
  email: string;
  name: string;
  locations: string[];
  whitelist: string[];
  success: boolean;
  error_messages: string[];
  updated: boolean;
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
  invitation: Invitation;
  profile: ProfileDetails;
  login: Login;


  blank_login(): void {
    this.login = {
        'email': '',
        'password': '',
        'submitted': false,
        'error_messages': [],
        'success': false
      };
  }

  blank_invitation(): void {
    this.invitation = {
        'email': '',
        'invitation_code': '',
        'submitted': false,
        'error_messages': []
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
      this.blank_invitation();
      this.blank_enrollment();
  }

  send_invitation(invitation_post_data: InvitationPostAPI): Promise<any> {
    console.log(invitation_post_data);
    this.invitation.submitted = true;
    this.login.submitted = true;
    this.invitation.email = invitation_post_data.invitationEmail;
    return this.http.post(INVITATION_URL, invitation_post_data).toPromise().then((res: InvitationAPI) => {
      if (!res.success) {
        this.invitation.error_messages = [res.error_message];
        return reject(res.error_message);
      }
      this.invitation.invitation_code = res.invitation_code;
      this.invitation.error_messages = [];
    });
  }

  // Moving to using Login API etc
  send_enrollment(enrollment_post_data: EnrollmentPostAPI): Promise<any> {
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
    return this.http.post(PROFILE_UPDATE_URL, this.profile).toPromise().then( (res: ProfileAPI) => {
      this.profile.updated = res.success;

      if (!res.success) {
        this.profile.updated = true;
        this.profile.error_messages = [res.message];
        return reject(res.message);
      }
      setTimeout(() => { this.profile.updated = false; }, 1000);
    });
  }

  send_login(login_data: LoginPostAPI): Promise<any> {
    this.login.submitted = true;
    const prom = this.http.post(LOGIN_URL, JSON.stringify(this.login)).toPromise();
    this.login.password = ''; // Delete the login password after we submit.
    return prom.then((res: ProfileDetails) => {
      if (!res.success) {
        this.login.error_messages = res.error_messages;
        return reject('Login failed.  Please check your email and password');
      }
      this.profile = res;
      this.profile.updated = false;
      this.login.success = true;
      return res;
    });
  }

  logout(): Promise<any> {
    return this.http.post(LOGOUT_URL, {}).toPromise().then( (res: LogoutAPI) => {
      if (!res.success) {
        return reject('Failure while logging out.');
      }
      this.clear();
      return res;
    });
  }

  constructor(private http: HttpClient) { }

}
