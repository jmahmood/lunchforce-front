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
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
