import { Injectable } from '@angular/core';

@Injectable()
export class NavService {
  state = 'login';
  constructor() { }

  is(to_check: string): boolean {
    return this.state === to_check;
  }

  invitationsuccess(): void {
    this.state = 'invitationsuccess';
  }

  loadmyevents(): void {
    this.state = 'loadmyevents';
  }

  login(): void {
    this.state = 'login';
  }

  waiting(): void {
    this.state = 'waiting';
  }

  invitation(): void {
    this.state = 'invitation';
  }

  availability(): void {
    this.state = 'availability';
  }

  search(): void {
    this.state = 'search';
  }

  publicevents(): void {
    this.state = 'publicevents';
  }

  invitedto(): void {
    this.state = 'invitedto';
  }

  myevents(): void {
    this.state = 'myevents';
  }

  profile(): void {
    this.state = 'profile';
  }

  enrollment(): void {
    this.state = 'enrollment';
  }

}
