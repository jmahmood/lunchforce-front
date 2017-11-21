export class LunchAppointment {
  constructor(public date: Date, public title: String, public people: String[]) {
  }
}

export class LunchAppointmentSearchResults {
  constructor(public date: Date, public lunch_appointments: LunchAppointment[]) {
  }
}
