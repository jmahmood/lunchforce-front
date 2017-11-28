export class LunchAppointment {

  constructor(public id: string,
              public date: Date,
              public title: string,
              public people: string[],
              public space_available: number,
              public highlight: boolean,
              public location: string) {
  }
}

export class LunchAppointmentSearchResults {
  constructor(public date: Date, public lunch_appointments: LunchAppointment[]) {
  }
}
