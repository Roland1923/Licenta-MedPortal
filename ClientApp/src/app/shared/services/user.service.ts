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
 

  doctorRegister(din: string, firstName: string, lastName: string, email: string, password: string, phoneNumber: string, description : string, speciality: string, hospital: string, city: string, country: string, address: string): Observable<any> {
    let body = JSON.stringify({ din, firstName, lastName , email, password, phoneNumber, description, speciality, hospital, city, country, address });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.baseUrl + "api/Doctors", body, options)
    .map (res => true)
    .catch (this.handleError);
  }

  patientRegister(nin: string, firstName: string, lastName: string, email: string, password: string, city: string, country: string, birthdate: Date, phoneNumber: string): Observable<any> {
    let body = JSON.stringify({ nin, firstName, lastName , email, password, city, country, birthdate, phoneNumber });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.baseUrl + "api/Patients", body, options)
    .map (res => true)
    .catch (this.handleError);
  }

  checkDoctorEmailNotTaken(email: string) {
    return this.http
      .get(this.baseUrl + "api/Doctors")
      .delay(1000)
      .map(res => res.json())
      .map(users => users.filter(user => user.email === email))
      .map(users => !users.length);
  }

  checkPatientEmailNotTaken(email: string) {
    return this.http
      .get(this.baseUrl + "api/Patients")
      .delay(1000)
      .map(res => res.json())
      .map(users => users.filter(user => user.email === email))
      .map(users => !users.length);
  }

  checkDoctorDINNotTaken(din: string) {
    return this.http
      .get(this.baseUrl + "api/Doctors")
      .delay(1000)
      .map(res => res.json())
      .map(users => users.filter(user => user.din == din))
      .map(users => !users.length);
  }

  checkPatientNINNotTaken(nin: string) {
    return this.http
      .get(this.baseUrl + "api/Patients")
      .delay(1000)
      .map(res => res.json())
      .map(users => users.filter(user => user.nin == nin))
      .map(users => !users.length);
  }

}




