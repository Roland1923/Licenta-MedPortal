import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { DoctorRegistration } from '../../shared/models/doctor-registration'
import { BaseService } from './base.service';
import { ConfigService } from './config.service'

import {Observable} from 'rxjs/Rx';
import { Time } from '@angular/common';



@Injectable({
  providedIn: 'root'
})

export class UserService extends BaseService {

  baseUrl: string = '';

  constructor(private http: Http, private configService: ConfigService) {
    super();
    this.baseUrl = configService.getApiURI();
  }
 
  getUserId() {
    if(!!localStorage.getItem('user_id') == true) {
      return localStorage.getItem('user_id');
    }
    return null;
  }

  isExpired() {
    if(!!localStorage.getItem('expiration') == true && !!localStorage.getItem('requestAt') == true) {
      var seconds = parseInt(localStorage.getItem("expiration"));
      var currentDate = new Date();
      var requestAt = new Date(localStorage.getItem('requestAt'));
      var dif = currentDate.getTime() - requestAt.getTime();
      var secondsDiff = dif / 1000;
      if(secondsDiff<seconds) {
        return false;
      }
      return true;
    }
    return true;
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

  editPatientProfile(id : string, NIN : string, firstName: string, lastName: string, email: string, password: string, city: string, country: string, birthdate: Date, phoneNumber: string): Observable<any> {
    let body = JSON.stringify({ NIN, firstName, lastName, email, password, city, country, birthdate, phoneNumber });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    
    return this.http.put(this.baseUrl + "api/Patients/" + id, body, options)
      .map(res => true)
      .catch(this.handleError);
  }

  editDoctorProfile(id : string, DIN : string, firstName: string, lastName: string, email: string, password: string, city: string, country: string, description: string, speciality: string, address: string, hospital: string, phoneNumber: string): Observable<any> {
    let body = JSON.stringify({ DIN, firstName, lastName, email, password, city, country, description, speciality, address, hospital, phoneNumber });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    
    return this.http.put(this.baseUrl + "api/Doctors/" + id, body, options)
      .map(res => true)
      .catch(this.handleError);
  }

  addDoctorAppointment(doctorId : string, day: number, startHour: Time, endHour: Time) {
    let body = JSON.stringify({doctorId, day, startHour, endHour});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });
    
    return this.http.post(this.baseUrl + "api/AppointmentIntervals", body, options)
      .map(res => true)
      .catch(this.handleError);
  }

  getAppointmentIntervalsForDoctor(doctorId : string) {
    return this.http.get(this.baseUrl + "api/AppointmentIntervals/" + doctorId)
    .map(response => response.json())
    .catch(this.handleError);
  }

  deleteDisponibility(appointmentIntervalId : string) {
    return this.http.delete(this.baseUrl + "api/AppointmentIntervals/" + appointmentIntervalId)
    .map(response => response.json())
    .catch(this.handleError);
  }

  getDoctorsByFilter(name : string, hospital : string, speciality : string, city : string, skip : number, take : number) {
    let body = JSON.stringify({ name, hospital , speciality, city});
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(this.baseUrl + "api/Doctors/page/" + skip + "/" + take, body, options)
      .map(response => response)
      .catch(this.handleError);
  }

  getAppointmentIntervalsByFilter(doctorId : string, day: number) {
    return this.http.get(this.baseUrl + "api/AppointmentIntervals/" + doctorId + "/" + day)
      .map(response => response)
      .catch(this.handleError);
  }

  getPatient (id : string) {
    return this.http.get(this.baseUrl + "api/Patients/" + id)
      .map(response => response.json())
      .catch(this.handleError);
  }

  getDoctor (id : string) {
    return this.http.get(this.baseUrl + "api/Doctors/" + id)
      .map(response => response.json())
      .catch(this.handleError);
  }





}




