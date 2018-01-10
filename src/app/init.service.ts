import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {reject} from 'q';

const FOODOPTIONS_URL = 'https://jbm-lunchforce-staging.herokuapp.com/api/food-options/';
const LOCATIONS_URL = 'https://jbm-lunchforce-staging.herokuapp.com/api/locations/';


export interface FoodOptionsAPI {
  food_options: {'id': string, 'name': string};
  success: boolean;
  message: string;
}

export interface LocationsAPI {
  locations: {'id': string, 'name': string};
  success: boolean;
  message: string;
}

export interface LocationOptions {
  id: string;
  name: string;
}

export interface FoodOptions {
  id: string;
  name: string;
}

@Injectable()
export class InitService {

  constructor(private http: HttpClient) { }

  // Moving to using Login API etc
  food_options(): Promise<any> {
    return this.http.get(FOODOPTIONS_URL).toPromise().then((res: FoodOptionsAPI) => {
      if (!res.success) {
        return reject(res.message);
      }
      return res;
    });
  }


  // Moving to using Login API etc
  locations(): Promise<any> {
    return this.http.get(LOCATIONS_URL).toPromise().then((res: LocationsAPI) => {
      if (!res.success) {
        return reject(res.message);
      }
      return res;
    });
  }
}
