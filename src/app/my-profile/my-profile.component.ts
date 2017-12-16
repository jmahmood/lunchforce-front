import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {FoodOptions, LocationOptions} from '../init.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  @Input() foodOptions: FoodOptions[];
  @Input() locationOptions: LocationOptions[];

  constructor(public authService: AuthService) { }

  compareIdFn(l1: {id: string, name: string}, l2: {id: string, name: string}): boolean {
    return l1.id === l2.id;
  }

  onSubmitProfileForm(): void {
    this.authService.send_profile_change().catch( (err) => {
      console.log(err);
    });
  }


  ngOnInit() {
  }

}
