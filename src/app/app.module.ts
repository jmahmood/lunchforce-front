import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap';
import { SalesforceOnlyDirective } from './salesforce-only.directive';
import { AppointmentItemComponent } from './appointment-item/appointment-item.component';
import { CalendarModule } from 'angular-calendar';
import { AvailabilityComponent } from './availability/availability.component';
import { CalendarHeaderComponent } from './demo-utils/calendar-header.component';

@NgModule({
  declarations: [
    AppComponent,
    SalesforceOnlyDirective,
    AppointmentItemComponent,
    AvailabilityComponent,
    CalendarHeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    CalendarModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
