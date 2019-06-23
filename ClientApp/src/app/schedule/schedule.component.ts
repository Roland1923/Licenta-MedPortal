import { Component, OnInit, ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DoctorProfile } from '../shared/models/doctor-profile';
import { DoctorFilter } from '../shared/models/doctor-filter';
import { Response } from '@angular/http/src/static_response';
import { Subscription } from 'rxjs';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { AppointmentInterval } from '../shared/models/appointment-interval';
import { PatientProfile } from '../shared/models/patient-profile';
import { AuthService } from '../shared/services/auth.service';
import { getTranslationForTemplate } from '@angular/core/src/render3/i18n';
import { Time } from '@angular/common';
import { Feedback } from '../shared/models/feedback.interface';



@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  model: NgbDateStruct;
  date: {year: number, month: number};


  doctorSearch: FormGroup;
  errors : string;
  submitted = false;
  isRequesting = false;

  doctorsList : Array<DoctorProfile>;
  appointmentIntervalsList : Array<AppointmentInterval>;
  doctor : DoctorProfile;

  numberPages : number;
  numbers : Array<number>;

  subscriptions = new Subscription();

  active: Array<boolean>;
  activeDisponibility:{ [key: string]: boolean; } = {};

  isExpired: boolean;
  lastPage: number;
  scheduleNotClicked: boolean = true;
  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  now: Date = new Date();
  nrOfMonthsTillNextYear: number;
  dateString: string;
  day_of_week: number;
  dateSelected: boolean = false;
  disponibilitySelected: boolean = false;
  appointmentDate: Date;
  patientId: string;
  patient: PatientProfile;
  appointmentIntervalId: string;
  appointmentIntervalsListWithValidSchedule:  Array<AppointmentInterval>;
  lengthIsZero: boolean;
  datePicked;
  time: Time = {
    hours: 10,
    minutes: 10
  };
  time1InMinutesForTime1: number;
  time1InMinutesForTime2: number;
  savedHour: number;
  savedMinutes: number;
  reviewsLoaded: boolean = false;
  allReviews: Array<Feedback>;
  oneStar: Map<string, number> = new Map<string,number>();
  twoStars: Map<string, number> = new Map<string,number>();
  threeStars: Map<string, number> = new Map<string,number>();
  fourStars: Map<string, number> = new Map<string,number>();
  fiveStars: Map<string, number> = new Map<string,number>();
  totalReviews: Map<string, number> = new Map<string,number>();
  starsMean: Map<string, number> = new Map<string,number>();
  reviewsSubscribed: Map<string, boolean> = new Map<string,boolean>();
  
  width1: Map<string, number> = new Map<string,number>();
  width2: Map<string, number> = new Map<string,number>();
  width3: Map<string, number> = new Map<string,number>();
  width4: Map<string, number> = new Map<string,number>();
  width5: Map<string, number> = new Map<string,number>();

  constructor(private router: Router, private userService: UserService, private authService: AuthService, private formBuilder: FormBuilder, _applicationRef: ApplicationRef) {
      
    this.minDate = {year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate()};
    this.nrOfMonthsTillNextYear = 12 - this.now.getMonth();
    this.maxDate = {year: this.now.getFullYear(), month: this.now.getMonth() + this.nrOfMonthsTillNextYear, day: this.now.getDate()};

    this.doctorsList = new Array<DoctorProfile>();
    this.numbers = new Array<number>();
    this.active = new Array<boolean>();
    this.allReviews = new Array<Feedback>();
    this.active[1]=true;
   }

   scheduleClicked(doctor: DoctorProfile) {
     this.scheduleNotClicked = false;
     this.doctor = doctor;
     this.generateReviews(this.doctor.doctorId);
   }

  ngOnInit() {
    
    this.doctorSearch = this.formBuilder.group({
      hospital: [''],
      city: [''],
      speciality: [''],
      name: ['']
    });

    this.patientId =  this.userService.getUserId();
    this.isExpired = this.userService.isExpired();

    if(this.patientId != null && !this.isExpired) {
      this.getPatient();
    }
    else {
      this.router.navigate(['/patient-login']);
      localStorage.clear();
    }

    this.generateRatings();
    this.getDoctorsByFilter(this.doctorSearch, 0);
  }

  private getPatient() {
    this.subscriptions.add(this.userService.getPatient(this.patientId)
    .subscribe((patient: PatientProfile) => {
        this.patient = patient;
    },
    errors => this.errors = errors
    ));
  }


  goBack () {
    this.scheduleNotClicked = true;
    this.appointmentIntervalsListWithValidSchedule = [];
    this.dateSelected = false;
    this.disponibilitySelected = false;
    this.datePicked = null;
    this.reviewsLoaded = false;
    this.allReviews = [];
  }


  generateReviews(doctorId: string) {
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }
    this.errors = '';
    this.allReviews = [];
    
    this.subscriptions.add(this.userService.getReviews()
      .subscribe(
          result => {
             this.reviewsLoaded = true;
                for(let review of result){
                  if(review.doctorId==doctorId) {
                    this.allReviews.push(review);
                  }
                }

          },
          errors => this.errors = errors));
  }

  scheduleAppointment() {
      this.isExpired = this.userService.isExpired();
      if(this.isExpired) {
        this.authService.logout();
      }
      this.errors = '';

      this.appointmentDate.setHours(this.savedHour+3, this.savedMinutes);
      
      this.subscriptions.add(this.userService.appointmentRegister(this.patient.patientId, this.doctor.doctorId, this.appointmentDate, this.appointmentIntervalId)
        .subscribe(
            result => {
                if (result) {
                  this.router.navigate(['/patient/account']);
                }
            },
            errors => this.errors = errors));
  }

  listScheduleForDate(pickedDate: NgbDateStruct) {
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }
    this.dateSelected = true;
    //let dateString = pickedDate.month  + "-" + pickedDate.day + "-" + pickedDate.year + " 23:15:30";
    let date = new Date(pickedDate.year, pickedDate.month-1, pickedDate.day, 23, 15, 30);

    this.appointmentDate = new Date(date);
    this.savedHour = this.appointmentDate.getHours();
    this.savedMinutes = this.appointmentDate.getMinutes();
    this.appointmentDate.setHours(6,0,0,0);

    let day_of_week = date.getDay();

    this.errors = '';

    this.appointmentIntervalsList = [];
    this.appointmentIntervalsListWithValidSchedule = [];
    this.lengthIsZero=true;

    var now = new Date();

    this.time.hours=now.getHours();
    this.time.minutes=now.getMinutes();
    now.setHours(6,0,0,0);

    this.subscriptions.add(this.userService.getAppointmentIntervals()
        .subscribe(response => {
          this.appointmentIntervalsList = response.json();

          for(var appointmentInterval of this.appointmentIntervalsList) {
            var appointmentExist = false;
            if(appointmentInterval.day==day_of_week && appointmentInterval.doctorId===this.doctor.doctorId) 
            {
              if(appointmentInterval.appointments!=null) {
                for(var appointment of appointmentInterval.appointments) {

                  var appDate = new Date(appointment.appointmentDate);
    
                  appDate.setHours(6,0,0,0);
                  
    


                  if(appDate.getTime() === this.appointmentDate.getTime()) {
                    appointmentExist = true;
                  }

                }
              }
            
              let time1String = this.time.hours  + ":" + this.time.minutes;
              
              this.time1InMinutesForTime1 = this.getTimeAsNumberOfMinutes(time1String);
              this.time1InMinutesForTime2 = this.getTimeAsNumberOfMinutes(appointmentInterval.startHour.toString());
          
 
              if(now.getTime() === this.appointmentDate.getTime()) {

                if(this.time1InMinutesForTime1 > this.time1InMinutesForTime2) {

                  appointmentExist = true; //de fapt sa nu fi trecut ora de inceput
                }
              }

              if(!appointmentExist) {
                this.appointmentIntervalsListWithValidSchedule.push(appointmentInterval);
              }
             
            }
          }
            
          this.appointmentIntervalsListWithValidSchedule.sort(function(a,b){
            if(b.startHour < a.startHour) {
              return 1;
            }
            else if(b.startHour > a.startHour) {
              return -1
            }
            return 0;
          });

          if(this.appointmentIntervalsListWithValidSchedule.length>0) {
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

  activate(page) {
    if(!this.active[page]) {
      this.active.fill(false);
      this.active[page] = true;
    }
  }

  activateDisponibility(id) {
    this.appointmentIntervalId = id;
    this.disponibilitySelected = true;
    if(!this.activeDisponibility[id]) {
      for(let activeDisp in this.activeDisponibility) {
        if(this.activeDisponibility[activeDisp] == true) {
          this.activeDisponibility[activeDisp] = false;
        }
      }
        this.activeDisponibility[id] = true;
    }
  }

  generateNullRatings() {
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }
    this.errors = '';

    this.subscriptions.add(this.userService.getDoctors()
    .subscribe((doctors: Array<DoctorProfile>) => {
      for(var doctor of doctors) {
        if(!this.reviewsSubscribed.has(doctor.doctorId)) {

          this.reviewsSubscribed.set(doctor.doctorId,true);
          this.totalReviews.set(doctor.doctorId,0);
          this.starsMean.set(doctor.doctorId,0);
          this.oneStar.set(doctor.doctorId,0);
          this.twoStars.set(doctor.doctorId,0);
          this.threeStars.set(doctor.doctorId,0);
          this.fourStars.set(doctor.doctorId,0);
          this.fiveStars.set(doctor.doctorId,0);
          this.width1.set(doctor.doctorId, 0);
          this.width2.set(doctor.doctorId, 0);
          this.width3.set(doctor.doctorId, 0);
          this.width4.set(doctor.doctorId, 0);
          this.width5.set(doctor.doctorId, 0);
         }

        } 

    },
    errors => this.errors = errors
    ));
  }

  generateRatings() {

    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }
    this.errors = '';

    this.subscriptions.add(this.userService.getReviews()
    .subscribe((reviews: Array<Feedback>) => {
      for(var feedback of reviews) {
        if(this.reviewsSubscribed.has(feedback.doctorId)) {

          var totalReviews = this.totalReviews.get(feedback.doctorId);
          this.totalReviews.set(feedback.doctorId, totalReviews+1);
          var mean = this.starsMean.get(feedback.doctorId);
          this.starsMean.set(feedback.doctorId, mean+feedback.rating);
          switch(feedback.rating) { 
            case 1: { 
              if(this.oneStar.has(feedback.doctorId)) {
                var oneStar = this.oneStar.get(feedback.doctorId)+1;
                this.oneStar.set(feedback.doctorId, oneStar);
              }
              else {
                this.oneStar.set(feedback.doctorId,1);
              }
           
               break; 
            } 
            case 2: { 
              if(this.twoStars.has(feedback.doctorId)) {
                var twoStars = this.twoStars.get(feedback.doctorId)+1;
                this.twoStars.set(feedback.doctorId, twoStars);
              }
              else {
                this.twoStars.set(feedback.doctorId,1);
              }
               break; 
            } 
            case 3: { 
              if(this.threeStars.has(feedback.doctorId)) {
                var threeStars = this.threeStars.get(feedback.doctorId)+1;
                this.threeStars.set(feedback.doctorId, threeStars);
              }
              else {
                this.threeStars.set(feedback.doctorId,1);
              }
              break; 
            } 
              case 4: { 
                if(this.fourStars.has(feedback.doctorId)) {
                  var fourStars = this.fourStars.get(feedback.doctorId)+1;
                  this.fourStars.set(feedback.doctorId, fourStars);
                }
                else {
                  this.fourStars.set(feedback.doctorId,1);
                }
              break; 
            } 
             case 5: { 
              if(this.fiveStars.has(feedback.doctorId)) {
                var fiveStars = this.fiveStars.get(feedback.doctorId)+1;
                this.fiveStars.set(feedback.doctorId, fiveStars);
              }
              else {
                this.fiveStars.set(feedback.doctorId,1);
              }
              break; 
             } 
         }
        }

        else {
          this.reviewsSubscribed.set(feedback.doctorId,true);
          this.totalReviews.set(feedback.doctorId,1);
          this.starsMean.set(feedback.doctorId,feedback.rating);

           switch(feedback.rating) { 
            case 1: { 
              this.oneStar.set(feedback.doctorId,1);
              this.twoStars.set(feedback.doctorId,0);
              this.threeStars.set(feedback.doctorId,0);
              this.fourStars.set(feedback.doctorId,0);
              this.fiveStars.set(feedback.doctorId,0);
               break; 
            } 
            case 2: { 
              this.twoStars.set(feedback.doctorId,1);
              this.oneStar.set(feedback.doctorId,0);
              this.threeStars.set(feedback.doctorId,0);
              this.fourStars.set(feedback.doctorId,0);
              this.fiveStars.set(feedback.doctorId,0);
               break; 
            } 
            case 3: { 
              this.threeStars.set(feedback.doctorId,1);
              this.twoStars.set(feedback.doctorId,0);
              this.oneStar.set(feedback.doctorId,0);
              this.fourStars.set(feedback.doctorId,0);
              this.fiveStars.set(feedback.doctorId,0);
              break; 
            } 
              case 4: { 
                this.fourStars.set(feedback.doctorId,1);
                this.twoStars.set(feedback.doctorId,0);
                this.threeStars.set(feedback.doctorId,0);
                this.oneStar.set(feedback.doctorId,0);
                this.fiveStars.set(feedback.doctorId,0);
              break; 
            } 
             case 5: { 
              this.fiveStars.set(feedback.doctorId,1);
              this.twoStars.set(feedback.doctorId,0);
              this.threeStars.set(feedback.doctorId,0);
              this.fourStars.set(feedback.doctorId,0);
              this.oneStar.set(feedback.doctorId,0);
              break; 
             } 
         }

        } 
      }
      this.starsMean.forEach((value: number, key: string) => {
        var number = value / this.totalReviews.get(key);
        number = parseFloat(number.toPrecision(2));
        this.starsMean.set(key, number);
        var precision = parseFloat((100/this.totalReviews.get(key)).toPrecision(2));
        this.width1.set(key, precision*this.oneStar.get(key));
        this.width2.set(key, precision*this.twoStars.get(key));
        this.width3.set(key, precision*this.threeStars.get(key));
        this.width4.set(key, precision*this.fourStars.get(key));
        this.width5.set(key, precision*this.fiveStars.get(key));

      });

      this.generateNullRatings();

    },
    errors => this.errors = errors
    ));

    return true;
  }


  getDoctorsByFilter({ value, valid }: { value: DoctorFilter, valid: boolean }, skip : number) {
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';

    this.doctorsList = [];
    this.numbers = [];
    this.numberPages = 0;

    if (valid) {
      this.subscriptions.add(this.userService.getDoctorsByFilter(value.name,
          value.hospital,
          value.speciality,
          value.city,
          skip * 10,
          10)
          .finally(() => this.isRequesting = false)
          .subscribe((response : Response) => {

            this.doctorsList = response.json();

            this.numberPages = +response.headers.get('x-inlinecount');
            this.numbers = [];
            this.lastPage = Math.ceil(this.numberPages / 10);
            for(let i = 0; i < this.numberPages / 10; i++)
            {
              this.numbers.push(i+1);
            }

            if(this.doctorsList.length == 0) {
              this.numbers = [];
            }
        },
        errors => this.errors = errors
        ));
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
