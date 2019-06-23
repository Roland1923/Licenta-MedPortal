import { Component, OnInit, ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { AuthService } from '../shared/services/auth.service';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PatientProfile } from '../shared/models/patient-profile';
import { PatientHistory } from '../shared/models/patient.history.inteface';


@Component({
  selector: 'app-patient-medical-history',
  templateUrl: './patient-medical-history.component.html',
  styleUrls: ['./patient-medical-history.component.scss']
})
export class PatientMedicalHistoryComponent implements OnInit {

  patientId: string;
  isExpired: boolean;
  subscriptions = new Subscription();
  patient: PatientProfile;
  errors: string;
  medicalHistory: PatientHistory;
  showMedicalHistory: boolean = false;
  allergies: Array<string> = new Array<string>();
  healthConditions: Array<string> = new Array<string>();
  consultations: Array<string> = new Array<string>();

  constructor(private router: Router, private userService: UserService, private authService: AuthService, private formBuilder: FormBuilder, _applicationRef: ApplicationRef) { }

  ngOnInit() {
    this.patientId =  this.userService.getUserId();
    this.isExpired = this.userService.isExpired();
    this.getMedicalHistory();
    if(this.patientId != null && !this.isExpired) {
      this.getPatient();
    }
    else {
      this.router.navigate(['/patient-login']);
      localStorage.clear();
    }
  }

  
  private getPatient() {
    this.subscriptions.add(this.userService.getPatient(this.patientId)
    .subscribe((patient: PatientProfile) => {
        this.patient = patient;
        
    },
    errors => this.errors = errors
    ));
  }


  getMedicalHistory() {
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }
    this.errors = '';

    
    this.subscriptions.add(this.userService.getMedicalHistory()
      .subscribe(
          result => {
            
                for(let mh of result){
                  if(mh.patientId==this.patientId) {
                    this.medicalHistory = mh;
                    //decriptare cu cheie privata
                    
                    if(this.medicalHistory.allergies!=null){
                      this.allergies = this.medicalHistory.allergies.split("\r\n"); 
                    }
                    if(this.medicalHistory.healthConditions!=null) {
                      this.healthConditions = this.medicalHistory.healthConditions.split("\r\n");
                    }

                    if(this.medicalHistory.consultations!=null) {
                      this.consultations = this.medicalHistory.consultations.split("\r\n");
                    }

                    this.showMedicalHistory=true;
                    break;
                  }
                }
          },
          errors => this.errors = errors));

  }


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
