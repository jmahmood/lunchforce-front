export class LunchAppointment {

  constructor(public id: string,
              public date: Date,
              public title: string,
              public people: [string, string][], // id, name
              public space_available: number,
              public highlight: boolean,
              public location: string) {
  }

}
