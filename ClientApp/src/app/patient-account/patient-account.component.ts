import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PatientProfile } from '../shared/models/patient-profile';
import { UserService } from '../shared/services/user.service';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateAdapter, NgbDateNativeAdapter} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../shared/services/auth.service';
import { Appointment } from '../shared/models/appointment';
import { Time } from '@angular/common';
import { Feedback } from '../shared/models/feedback.interface';


@Component({
  selector: 'app-patient-account',
  templateUrl: './patient-account.component.html',
  styleUrls: ['./patient-account.component.scss'],
  providers: [{provide: NgbDateAdapter, useClass: NgbDateNativeAdapter}]
})
export class PatientAccountComponent implements OnInit {

  private buttonsClicked: boolean[];
  patientEditForm: FormGroup;
  patientPasswordEditForm: FormGroup;
  patientEmailEditForm: FormGroup;
  errors: string;  
  isRequesting: boolean;
  submitted: boolean = false;
  submitted2: boolean = false;
  submitted3: boolean = false;
  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  valueDate: string;
  now: Date = new Date();
  patientId : string;
  email: string;
  password: string;
  patient: PatientProfile;
  private subscriptions = new Subscription();
  isExpired: boolean;
  birthdateValue: any;
  lengthIsZero: boolean = true;
  appointmentsList: Array<Appointment>;
  appointmentsListValidated: Array<Appointment>;
  time: Time = {
    hours: 10,
    minutes: 10
  };
  time1InMinutesForTime1: number;
  time1InMinutesForTime2: number;

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

  toggleShow(nr) {
    this.buttonsClicked = [false, false, false, false];
    this.buttonsClicked[nr]=true;
  }

  reload() {
    if(!!localStorage.getItem('reload') == true ) {
    }
    else {
      localStorage.setItem('reload','true');
      window.location.reload();
    }
  }
  
  constructor(public router: Router, private authService: AuthService, private userService: UserService, private formBuilder: FormBuilder) { 
    this.minDate = {year: this.now.getFullYear()-120, month: this.now.getMonth() + 1, day: this.now.getDate()};
    this.maxDate = {year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate()};
  }

  ngOnInit() {
    
    this.reload();
    localStorage.setItem('reload','false');

    this.buttonsClicked = [true, false, false];

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

    this.patientEditForm = this.formBuilder.group({
      lastName: ['Test', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]],
      firstName: ['Test', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]],
      phoneNumber: ['0745119974', [Validators.required, Validators.pattern("[0-9]+")]],
      city: ['Iasi', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(35), this.validatePasswordConfirmation.bind(this)]],
      country: ['Romania', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]]    
    });

    this.patientPasswordEditForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(35), this.validatePasswordConfirmation.bind(this)]],
      confirmNewPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(35)]],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(35)]]
    },
    {validator: this.validateConfirmPassword}
    );


    this.patientEmailEditForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(35), this.validatePasswordConfirmation.bind(this)]],
      email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")], this.validatePatientEmailNotTaken.bind(this)]
    });
  }

  validateConfirmPassword(frm: FormGroup){
    return frm.controls['newPassword'].value === 
    frm.controls['confirmNewPassword'].value ? null : {'mismatch': true};
  }

  validatePatientEmailNotTaken(control: AbstractControl) {
    return this.userService.checkPatientEmailNotTaken(control.value).map(res => {
      return res ? null : { patientEmailTaken: true };
    });
  }






  private getPatient() {
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }

    this.subscriptions.add(this.userService.getPatient(this.patientId)
    .subscribe((patient: PatientProfile) => {
        this.patient = patient;
        this.email = patient.email;
        this.birthdateValue = patient.birthdate;
        this.password = patient.password;
        this.patientEditForm.controls['lastName'].setValue(patient.lastName);
        this.patientEditForm.controls['firstName'].setValue(patient.firstName);
        this.patientEditForm.controls['phoneNumber'].setValue(patient.phoneNumber);
        this.patientEditForm.controls['city'].setValue(patient.city);
        this.patientEditForm.controls['country'].setValue(patient.country);
        this.listAppointments();
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



    },
    errors => this.errors = errors
    ));
    return true;
  }





  listAppointments() {
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }
    
    this.errors = '';

    this.appointmentsList = [];
    this.appointmentsListValidated = [];
    this.lengthIsZero=true;

    var now = new Date();
    this.time.hours=now.getHours();
    this.time.minutes=now.getMinutes();
    now.setHours(6,0,0,0);

    this.subscriptions.add(this.userService.getAppointments()
        .subscribe(response => {
          this.appointmentsList = response.json();
          for(var appointment of this.appointmentsList) {
            var appointmentGood = true;
            if(appointment.patientId===this.patient.patientId)
            {
              let time1String = this.time.hours  + ":" + this.time.minutes;

              this.time1InMinutesForTime1 = this.getTimeAsNumberOfMinutes(time1String);
              this.time1InMinutesForTime2 = this.getTimeAsNumberOfMinutes(appointment.appointmentInterval.startHour.toString());
          
              var appDate = new Date(appointment.appointmentDate);
              appDate.setHours(6,0,0,0);
              if(now.getTime() === appDate.getTime()) {

                if(this.time1InMinutesForTime1 > this.time1InMinutesForTime2) {
                  appointmentGood = false; //de fapt sa nu fi trecut ora de inceput
                }
              }
              if(appointmentGood) {
                this.appointmentsListValidated.push(appointment);
              }
              
            }

          }

          this.appointmentsListValidated.sort(function(a,b){
            if(b.appointmentDate < a.appointmentDate) {
              return 1;
            }
            else if(b.appointmentDate > a.appointmentDate) {
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

  deleteAppointment(id: string) {
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }
    this.errors = '';

    this.subscriptions.add(this.userService.deleteAppointment(id)
        .subscribe(() => {
          this.listAppointments();
 
      },
      errors => this.errors = errors
      )
      );

  }

  editPatientProfile(patientEditForm: FormGroup) {
  this.isExpired = this.userService.isExpired();
  if(this.isExpired) {
    this.authService.logout();
  }

  this.submitted = true;
  this.isRequesting = true;
  this.errors = '';
  if (patientEditForm.valid) { 
    this.subscriptions.add(this.userService.editPatientProfile(this.patientId,
          this.patient.nin,
          patientEditForm.value.firstName,
          patientEditForm.value.lastName,
          this.email,
          patientEditForm.value.password,
          patientEditForm.value.city,
          patientEditForm.value.country,
          this.birthdateValue,
          patientEditForm.value.phoneNumber)
          .finally(() => this.isRequesting = false)
          .subscribe(
              result => {
                  if (result) {
                      this.router.navigate(['/patient/account']);
                      localStorage.setItem('displayMessage1', "true");
                      window.location.reload();
                  }
              },
              errors => this.errors = errors));
  }
  }

  editPatientPassword({ value, valid }: { value: PatientProfile, valid: boolean }) {
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }

    this.submitted2 = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      this.subscriptions.add(this.userService.editPatientProfile(this.patientId,
            this.patient.nin,
            this.patient.firstName,
            this.patient.lastName,
            this.email,
            value.newPassword,
            this.patient.city,
            this.patient.country,
            this.patient.birthdate,
            this.patient.phoneNumber)
            .finally(() => this.isRequesting = false)
            .subscribe(
                result => {
                    if (result) {
                        this.router.navigate(['/patient/account']);
                        localStorage.setItem('displayMessage2', "true");
                        window.location.reload(); 
                    }
                },
                errors => this.errors = errors));
    }
    }

    editPatientEmail({ value, valid }: { value: PatientProfile, valid: boolean }) {
      this.isExpired = this.userService.isExpired();
      if(this.isExpired) {
        this.authService.logout();
      }

      this.submitted3 = true;
      this.isRequesting = true;
      this.errors = '';
      if (valid) {
        this.subscriptions.add(this.userService.editPatientProfile(this.patientId,
              this.patient.nin,
              this.patient.firstName,
              this.patient.lastName,
              value.email,
              value.password,
              this.patient.city,
              this.patient.country,
              this.patient.birthdate,
              this.patient.phoneNumber)
              .finally(() => this.isRequesting = false)
              .subscribe(
                  result => {
                      if (result) {
                          this.router.navigate(['/patient/account']);
                          localStorage.setItem('displayMessage3', "true");
                          window.location.reload(); 
                      }
                  },
                  errors => this.errors = errors));
      }
      }
  

  
  /*validateDOB(control: AbstractControl){
    let year = new Date(control.value).getFullYear();
    let today = new Date().getFullYear();
    if(today - year >= 120 || today-year<0) {
      return { DOBwrong: false };
    }
    else {
      return null;
    }
  }*/

  removeMessage(nr) {
    var str = "displayMessage".concat(nr);
    localStorage.removeItem(str);
  }

  displayMessage(nr) {
    var str = "displayMessage".concat(nr);
    if(!!localStorage.getItem(str) == true) {
      return true;
    }
    return false;
  }

  validatePasswordConfirmation(control: AbstractControl) {
    let hash = Md5.hashStr(control.value);
    if(hash!=this.password) {
      return { passConfirmation: false };
    }
    else {
      return null;
    }
  }

  ngOnDestroy() {
    localStorage.removeItem('displayMessage1');
    localStorage.removeItem('displayMessage2');
    localStorage.removeItem('displayMessage3');
    this.subscriptions.unsubscribe();
  }

}
