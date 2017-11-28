import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap';
import { SalesforceOnlyDirective } from './salesforce-only.directive';
import { AppointmentItemComponent } from './appointment-item/appointment-item.component';
import { AvailabilityComponent } from './availability/availability.component';

@NgModule({
  declarations: [
    AppComponent,
    SalesforceOnlyDirective,
    AppointmentItemComponent,
    AvailabilityComponent,
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
