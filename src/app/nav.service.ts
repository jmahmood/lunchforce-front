import { Injectable } from '@angular/core';

@Injectable()
export class NavService {
  state = 'login';
  constructor() { }

  is(to_check: string): boolean {
    return this.state === to_check;
  }

  introductionsuccess(): void {
    this.state = 'introductionsuccess';
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

  introduction(): void {
    this.state = 'introduction';
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
