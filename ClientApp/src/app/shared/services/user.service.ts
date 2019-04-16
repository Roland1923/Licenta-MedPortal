import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { DoctorRegistration } from '../../shared/models/doctor-registration'
import { BaseService } from './base.service';
import { ConfigService } from './config.service'

import {Observable} from 'rxjs/Rx';



@Injectable({
  providedIn: 'root'
})

export class UserService extends BaseService {

  baseUrl: string = '';

  constructor(private http: Http, private configService: ConfigService) {
    super();
    this.baseUrl = configService.getApiURI();
  }
 

  doctorRegister(din: string, firstName: string, lastName: string, email: string, password: string, phoneNumber: string, description : string, speciality: string, hospital: string, city: string, country: string, address: string): Observable<DoctorRegistration> {
    let body = JSON.stringify({ din, firstName, lastName , email, password, phoneNumber, description, speciality, hospital, city, country, address });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    console.log(firstName);
    console.log(hospital);
    return this.http.post(this.baseUrl + "api/Doctors", body, options)
      .map (res => true)
      .catch (this.handleError);
    }

    private extractData(res: Response) {
      if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
          }
      let body = res.json();
      return body || { };
   }

}




