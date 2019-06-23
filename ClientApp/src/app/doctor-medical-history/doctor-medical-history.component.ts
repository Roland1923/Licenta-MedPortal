import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DoctorProfile } from '../shared/models/doctor-profile';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Appointment } from '../shared/models/appointment';
import { PatientHistory } from '../shared/models/patient.history.inteface';
import * as CryptoJS from 'crypto-js';  

@Component({
  selector: 'app-doctor-medical-history',
  templateUrl: './doctor-medical-history.component.html',
  styleUrls: ['./doctor-medical-history.component.scss']
})
export class DoctorMedicalHistoryComponent implements OnInit {
  titleArray: Array<Appointment> = new Array<Appointment>();
  errors: string;  
  subscriptions = new Subscription();
  doctorId : string;
  doctor: DoctorProfile;
  isExpired: boolean;
  now: Date;
  patientSelected: boolean = false;
  medicalHistory: PatientHistory;
  medicalHistoryForm: FormGroup;
  heightArray: Array<string> = new Array<string>();
  weightArray: Array<string> = new Array<string>();
  allergies: Array<string> = new Array<string>();
  healthConditions: Array<string> = new Array<string>();
  consultations: Array<string> = new Array<string>();
  appointment: Appointment;
  conversionDecryptOutput: string;

  constructor(private router: Router, private authService: AuthService, private userService: UserService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.doctorId =  this.userService.getUserId();
    this.isExpired=this.userService.isExpired();

    if(this.doctorId != null && !this.isExpired) {
      this.getDoctor();
    }
    else {
        this.router.navigate(['/doctor-login']);
        localStorage.clear();
    }
    this.now = new Date();
    this.now.setHours(10,30,0);

    this.medicalHistoryForm = this.formBuilder.group({
      gender: [null],
      smoke: [null],
      drink: [null],
      weight: [null],
      height: [null],
      allergies: [null],
      healthConditions: [null],
      consultations: [null]
    });

    for(let i=1; i<635; ++i) {
      this.weightArray.push(i+" kg");
    }

    for(let i=0; i<3; ++i) {
      for(let j=21; j<=99; ++j) {
        this.heightArray.push(i+"."+j+" m");
      }
    }

   
  }

  private getDoctor() {
    this.subscriptions.add(this.userService.getDoctor(this.doctorId)
    .subscribe((doctor: DoctorProfile) => {
        this.doctor = doctor;
        this.generatePatients(this.doctor.doctorId);
    },
    errors => this.errors = errors
    ));
  }


  generatePatients(doctorId: string) {
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }
    this.errors = '';
    this.titleArray = [];

    this.subscriptions.add(this.userService.getAppointments()
      .subscribe(
          result => {
                for(let appointment of result.json()){
                    let date = new Date(appointment.appointmentDate);
                    date.setHours(10,30,0);
                    if(this.now.getTime()<=date.getTime() && appointment.doctor.doctorId==doctorId && appointment.haveMedicalHistory==false) 
                    {
                        this.titleArray.push(appointment);   
                    }
                }
                
  
          },
          errors => this.errors = errors));
  }


  getMedicalHistory(appointmentId: string) {
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }
    this.errors = '';

    this.patientSelected=false;

    for(var appointment of this.titleArray) {
      if(appointment.appointmentId==appointmentId) {
        this.appointment = appointment;
      }
    }

    
    this.subscriptions.add(this.userService.getMedicalHistory()
      .subscribe(
          result => {
           
                for(let mh of result){
                  if(mh.patientId==this.appointment.patient.patientId) {
                    this.patientSelected = true;
                    this.medicalHistory = mh;
                    this.medicalHistoryForm.controls['gender'].setValue(this.medicalHistory.gender);
                    this.medicalHistoryForm.controls['weight'].setValue(this.medicalHistory.weight);
                    this.medicalHistoryForm.controls['height'].setValue(this.medicalHistory.height);
                    this.medicalHistoryForm.controls['smoke'].setValue(this.medicalHistory.smoke);
                    this.medicalHistoryForm.controls['drink'].setValue(this.medicalHistory.drink);
                    
                    
                    if(this.medicalHistory.allergies!=null){
                      this.allergies = this.medicalHistory.allergies.split("\r\n"); 
                    }
                    
                    if(this.medicalHistory.healthConditions!=null) {
                      this.healthConditions = this.medicalHistory.healthConditions.split("\r\n");
                    }

                    if(this.medicalHistory.consultations!=null) {
                      this.consultations = this.medicalHistory.consultations.split("\r\n");
                    }
                    break;
                  }
                }
          },
          errors => this.errors = errors));

  }


  updateAppointment(appointment: Appointment) {
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }
    this.errors = '';
    this.subscriptions.add(this.userService.updateAppointment(appointment.appointmentId, appointment.appointmentIntervalId, appointment.appointmentDate, appointment.doctorId, appointment.patientId, appointment.haveFeedback, true)
        .subscribe(response => {


      }
      ,
      errors => this.errors = errors
      )
      );
  }

  updateMedicalHistory({ value, valid }: { value: PatientHistory, valid: boolean }) {
    this.errors = '';
    if (valid) {
      if(value.consultations!=null){
        value.consultations = new Date().toLocaleString() + "(" + this.doctor.firstName + " " + this.doctor.lastName + ") >> " + value.consultations;
      }

      this.subscriptions.add(this.userService.updateMedicalHistory(this.medicalHistory.historyId,
            this.medicalHistory.patientId,
            value.smoke,
            value.drink,
            value.gender,
            value.weight,
            value.height,
            value.healthConditions,
            value.allergies,
            value.consultations,
            new Date()
            )
            .subscribe(
                result => {
                    if (result) {
                      this.updateAppointment(this.appointment);
                      window.location.reload(); 
                    }
                },
                errors => this.errors = errors));
    }
    }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
