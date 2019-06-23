import { Component, OnInit, ApplicationRef, Type } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { AuthService } from '../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DoctorProfile } from '../shared/models/doctor-profile';
import { Appointment } from '../shared/models/appointment';
import { PatientProfile } from '../shared/models/patient-profile';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { Directive, Output, EventEmitter, Input, SimpleChange} from '@angular/core';
import { Feedback } from '../shared/models/feedback.interface';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})


@Directive({
  selector: '[onCreate]'
})

export class ReviewsComponent implements OnInit {

  @Output() onCreate: EventEmitter<any> = new EventEmitter<any>();

  reviewNotClicked: boolean = true;
  doctorsToBeReviewed: boolean = true;
  isRequesting: boolean = false;
  patientId: string;
  isExpired: boolean;
  subscriptions = new Subscription();
  patient: PatientProfile;
  errors: string;
  now: Date;
  appointmentsList: Array<Appointment>;
  appointmentsListValidated: Array<Appointment>;
  doctorIdArray: Array<string>;
  doctor: DoctorProfile;
  currentRate: number;
  describe: FormGroup;
  appointment: Appointment;
  review: Feedback;
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

  constructor(private router: Router, private userService: UserService, private authService: AuthService, private formBuilder: FormBuilder, _applicationRef: ApplicationRef, config: NgbRatingConfig) { 
    config.max = 5;
  }


  ngOnInit() {
    this.currentRate = 0;
    this.doctorIdArray=[];
    this.patientId =  this.userService.getUserId();
    this.isExpired = this.userService.isExpired();

    if(this.patientId != null && !this.isExpired) {
      this.getPatient();
    }
    else {
      this.router.navigate(['/patient-login']);
      localStorage.clear();
    } 
    this.now = new Date();
    this.now.setHours(10,30,0);
    this.generateRatings();
    this.describe = this.formBuilder.group({
      comments: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(400)]]
    });
  }

  private getPatient() {
    this.subscriptions.add(this.userService.getPatient(this.patientId)
    .subscribe((patient: PatientProfile) => {
        this.patient = patient;
        this.listDoctorsToBeReviewed();
    },
    errors => this.errors = errors
    ));
  }

  /*isAlreadyPushed(doctorId: string) {
    for(let id of this.doctorIdArray) {
      if(id==doctorId) {
        return true;
      }
    }
    return false;
  }*/

  addReview(description: string, currentRate: number) {
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }
    this.errors = '';

    this.subscriptions.add(this.userService.addReview(currentRate, description, this.doctor.doctorId, this.patientId, this.appointment.appointmentDate)
    .subscribe(
      result => {
          if (result) {
              this.updateAppointment(this.appointment);
              this.reviewNotClicked = true;
              this.listDoctorsToBeReviewed();
              this.doctorIdArray=[];
              this.currentRate=0;
              this.describe.controls['comments'].reset();
              window.location.reload();
          }
      },
      errors => this.errors = errors));
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

  goBack () {
    this.reviewNotClicked = true;
    this.listDoctorsToBeReviewed();
    this.doctorIdArray=[];
    this.currentRate=0;
    this.describe.controls['comments'].reset();
  }

  reviewClicked(doctor: DoctorProfile, appointment: Appointment) {
    this.reviewNotClicked = !this.reviewClicked;
    this.doctor=doctor;
    this.appointment=appointment;
  }

  updateAppointment(appointment: Appointment) {
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }
    this.errors = '';
    this.subscriptions.add(this.userService.updateAppointment(appointment.appointmentId, appointment.appointmentIntervalId, appointment.appointmentDate, appointment.doctorId, appointment.patientId, true, appointment.haveMedicalHistory)
        .subscribe(response => {


      }
      ,
      errors => this.errors = errors
      )
      );
  }

  listDoctorsToBeReviewed() {
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }
    this.errors = '';
    this.isRequesting = true;
    this.appointmentsList = [];
    this.appointmentsListValidated = [];
    this.doctorsToBeReviewed = false;

    this.subscriptions.add(this.userService.getAppointments()
        .finally(() => this.isRequesting = false)
        .subscribe(response => {
          this.appointmentsList = response.json();
          for(var appointment of this.appointmentsList) {
            let date = new Date(appointment.appointmentDate);
            date.setHours(10,30,0);
            if(this.now.getTime()<=date.getTime() && appointment.patientId===this.patient.patientId && appointment.haveFeedback==false) 
            {
              this.appointmentsListValidated.push(appointment);
            }

          }

          if(this.appointmentsListValidated.length>0) {
            this.doctorsToBeReviewed=true;
          }

      }
      ,
      errors => this.errors = errors
      )
      );

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
