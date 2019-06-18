import { Component, OnInit, ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { AuthService } from '../shared/services/auth.service';
import { FormBuilder } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DoctorProfile } from '../shared/models/doctor-profile';
import { Appointment } from '../shared/models/appointment';
import { Time } from '@angular/common';

@Component({
  selector: 'app-doctor-appointments',
  templateUrl: './doctor-appointments.component.html',
  styleUrls: ['./doctor-appointments.component.scss']
})
export class DoctorAppointmentsComponent implements OnInit {
  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  datePicked: NgbDateStruct;
  now: Date = new Date();
  nrOfMonthsTillNextYear: number;

  subscriptions = new Subscription();

  lengthIsZero: boolean = true;  

  doctorId: string;
  doctor: DoctorProfile;
  isExpired: boolean;

  errors : string;

  appointmentsList: Array<Appointment>;
  appointmentsListValidated: Array<Appointment>;

  time: Time = {
    hours: 10,
    minutes: 10
  };
  time1InMinutesForTime1: number;
  time1InMinutesForTime2: number;

  constructor(private router: Router, private userService: UserService, private authService: AuthService, private formBuilder: FormBuilder, _applicationRef: ApplicationRef) { 
    this.minDate = {year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate()};
    this.nrOfMonthsTillNextYear = 12 - this.now.getMonth();
    this.maxDate = {year: this.now.getFullYear(), month: this.now.getMonth() + this.nrOfMonthsTillNextYear, day: this.now.getDate()};
  }

  ngOnInit() {
    this.doctorId =  this.userService.getUserId();
    this.isExpired = this.userService.isExpired();

    if(this.doctorId != null && !this.isExpired) {
      this.getDoctor();
    }
    else {
      this.router.navigate(['/doctor-login']);
      localStorage.clear();
    } 
  }

  private getDoctor() {
    this.subscriptions.add(this.userService.getDoctor(this.doctorId)
    .subscribe((doctor: DoctorProfile) => {
        this.doctor = doctor;
        this.datePicked = this.minDate;
        this.listScheduleForDate(this.minDate);
    },
    errors => this.errors = errors
    ));
  }

  listScheduleForDate(pickedDate: NgbDateStruct) {
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }

    //let dateString = pickedDate.month  + "-" + pickedDate.day + "-" + pickedDate.year + " 23:15:30";

    let date = new Date(pickedDate.year, pickedDate.month-1, pickedDate.day, 23, 15, 30);

    this.errors = '';

    var now = new Date();
    this.time.hours=now.getHours();
    this.time.minutes=now.getMinutes();
    now.setHours(6,0,0,0);

    this.appointmentsList = [];
    this.appointmentsListValidated = [];
    this.lengthIsZero=true;

    this.subscriptions.add(this.userService.getAppointments()
        .subscribe(response => {
          this.appointmentsList = response.json();
          for(var appointment of this.appointmentsList) {
            var appointmentGood = true;
            let appDate = new Date(appointment.appointmentDate);
            appDate.setHours(20, 15, 0);
            date.setHours(20, 15, 0);
            if(appDate.getTime()==date.getTime() && appointment.doctorId===this.doctor.doctorId) 
            {
              let time1String = this.time.hours  + ":" + this.time.minutes;

              this.time1InMinutesForTime1 = this.getTimeAsNumberOfMinutes(time1String);
              this.time1InMinutesForTime2 = this.getTimeAsNumberOfMinutes(appointment.appointmentInterval.startHour.toString());


              if(this.time1InMinutesForTime1 > this.time1InMinutesForTime2) {
                appointmentGood = false; //de fapt sa nu fi trecut ora de inceput
              }

              if(appointmentGood) {
                this.appointmentsListValidated.push(appointment);
              }
     
            }

          }
          
          this.appointmentsListValidated.sort(function(a,b){
            if(b.appointmentInterval.startHour < a.appointmentInterval.startHour) {
              return 1;
            }
            else if(b.appointmentInterval.startHour > a.appointmentInterval.startHour) {
              return -1
            }
            return 0;
          });

          if(this.appointmentsListValidated.length>0) {
            this.lengthIsZero=false;
          }

      },
      errors => this.errors = errors
      ));
    
  }

  getTimeAsNumberOfMinutes(time)
  {
      var timeParts = time.split(":");
  
      var timeInMinutes = Number((timeParts[0] * 60)) + Number(timeParts[1]);
  
      return Number(timeInMinutes);
  }
  
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
