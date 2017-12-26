import { Component, OnInit } from '@angular/core';
import {NavService} from '../nav.service';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-invitation-success',
  templateUrl: './invitation-success.component.html',
  styleUrls: ['./invitation-success.component.css']
})
export class InvitationSuccessComponent implements OnInit {

  constructor(public authService: AuthService,
              public navService: NavService) { }

  ngOnInit() {
  }

  goInvitation() {
    this.authService.blank_invitation();
    this.navService.introduction();
  }


}
