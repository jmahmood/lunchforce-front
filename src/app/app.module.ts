import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap';
import { SalesforceOnlyDirective } from './salesforce-only.directive';
import { AppointmentItemComponent } from './appointment-item/appointment-item.component';
import { AvailabilityComponent } from './availability/availability.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { InvitationSuccessComponent } from './invitation-success/invitation-success.component';
import { EnrollmentComponent } from './enrollment/enrollment.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { SearchComponent } from './search/search.component';
import { NavComponent } from './nav/nav.component';
import { LoginComponent } from './login/login.component';
import {CookieService} from 'ngx-cookie-service';
import { registerLocaleData } from '@angular/common';
import localeJa from '@angular/common/locales/ja';


@NgModule({
  declarations: [
    AppComponent,
    SalesforceOnlyDirective,
    AppointmentItemComponent,
    AvailabilityComponent,
    MyProfileComponent,
    IntroductionComponent,
    InvitationSuccessComponent,
    EnrollmentComponent,
    MyEventsComponent,
    SearchComponent,
    NavComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
