import { Component, OnInit, ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';
import { FormBuilder, FormGroup, Validators, Form } from '@angular/forms';
import { PatientProfile } from '../shared/models/patient-profile';
import { Subscription } from 'rxjs';
import { Donor } from '../shared/models/donor';
import { DonorFilter } from '../shared/models/DonorFilter';
import { Response } from '@angular/http/src/static_response';

@Component({
  selector: 'app-donor',
  templateUrl: './donor.component.html',
  styleUrls: ['./donor.component.scss']
})
export class DonorComponent implements OnInit {
  isExpired: boolean;
  patientId: string;
  patient: PatientProfile;
  now: Date;
  subscriptions = new Subscription();
  errors: string;
  joinBloodDonor: FormGroup;
  bloodDonorFailed: boolean = true;
  alreadyDonated: boolean = false;
  nothingToConfirm: boolean = true;
  pendingPatient: PatientProfile;
  myBloodDonor: Donor;
  bloodDonorSearch: FormGroup;
  lastPage: number;
  bloodDonorsList : Array<Donor>;
  bloodDonorsListValidated : Array<Donor>;
  numberPages : number;
  numbers : Array<number>;
  active: Array<boolean>;
  constructor(private router: Router, private userService: UserService, private authService: AuthService, private formBuilder: FormBuilder, _applicationRef: ApplicationRef) { 
    this.bloodDonorsList = new Array<Donor>();
    this.bloodDonorsListValidated = new Array<Donor>();
    this.numbers = new Array<number>();
    this.active = new Array<boolean>();
    this.active[1]=true;
   
  }

  ngOnInit() {

   

    this.patientId =  this.userService.getUserId();
    this.isExpired=this.userService.isExpired();

    if(this.patientId != null && !this.isExpired) {
      this.getPatient();
    }
    else {
        this.router.navigate(['/patient-login']);
        localStorage.clear();
    }
    this.now = new Date();
    this.now.setHours(10,30,0);

    this.joinBloodDonor = this.formBuilder.group({
      type: [null, [Validators.required]]
    });

    this.bloodDonorSearch = this.formBuilder.group({
      type: [''],
      city: ['']
    });
    this.getBloodDonorsByFilter(this.bloodDonorSearch, 0);
    
  }

  patientAlreadyDonated (patientId: string) {
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }
    this.errors = '';

    this.subscriptions.add(this.userService.getBloodDonors()
      .subscribe(
          result => {
         
                for(let bloodDonor of result.json()){
                  if(bloodDonor.patientId==patientId)
                  {
                    var appDate = new Date(bloodDonor.applyDate);
                    var diff = Math.abs(this.now.getTime() - appDate.getTime());
                    var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
                    var weeks = Math.ceil(diffDays/7);
                    if(weeks<=8) {
                      this.alreadyDonated = true;
                    }
                  } 
                }
                this.validateBloodDonor();
          },
          errors => this.errors = errors));
  }

  activate(page) {
    if(!this.active[page]) {
      this.active.fill(false);
      this.active[page] = true;
    }
  }

  confirmDonate () {
   
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }
    this.errors = '';
    this.subscriptions.add(this.userService.updateBloodDonor(this.myBloodDonor.bloodDonorId, this.myBloodDonor.applyDate, this.myBloodDonor.patientId,
      this.myBloodDonor.pendingPatientId, this.myBloodDonor.type, this.myBloodDonor.haveDonated, true)
        .subscribe(response => {
          window.location.reload();
      }
      ,
      errors => this.errors = errors
      )
      );
  }

  needBlood (bloodDonor: Donor) {
   
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }
    this.errors = '';
    this.subscriptions.add(this.userService.updateBloodDonor(bloodDonor.bloodDonorId, bloodDonor.applyDate, bloodDonor.patientId,
      this.patientId, bloodDonor.type, true, false)
        .subscribe(response => {
          window.location.reload();
      }
      ,
      errors => this.errors = errors
      )
      );
  }

  declineDonate () {
   
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }
    this.errors = '';
    this.subscriptions.add(this.userService.updateBloodDonor(this.myBloodDonor.bloodDonorId, this.myBloodDonor.applyDate, this.myBloodDonor.patientId,
      this.myBloodDonor.pendingPatientId, this.myBloodDonor.type, false, true)
        .subscribe(response => {
          window.location.reload();
      }
      ,
      errors => this.errors = errors
      )
      );
  }


  validateBloodDonor () {
    var birthDate = new Date(this.patient.birthdate);
    var age = this.now.getFullYear() - birthDate.getFullYear();
    var m = this.now.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && this.now.getDate() < birthDate.getDate())) 
    {
        age--;
    }

    if(age>16 && !this.alreadyDonated) {
      this.bloodDonorFailed = false;
    }
  }
 
  checkDonateRequests () {
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }
    this.errors = '';

    this.subscriptions.add(this.userService.getBloodDonors()
      .subscribe(
          result => {
         
                for(let bloodDonor of result.json()){
                  if(bloodDonor.patientId==this.patientId)
                  {
                    if(bloodDonor.haveDonated && !bloodDonor.patientConfirmed) {
                      this.getPatientRequestById(bloodDonor.pendingPatientId);
                    }
                  } 
                }
          },
          errors => this.errors = errors));
  }

  getPatientRequestById (pendingPatientId: string) {
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }
    this.errors = '';

    this.subscriptions.add(this.userService.getPatients()
      .subscribe(
          result => {
         
                for(let patient of result){
                  if(patient.patientId==pendingPatientId)
                  {

                    this.pendingPatient = patient;
                    this.getMyBloodDonor();
                    this.nothingToConfirm = false;
                  } 
                }
          },
          errors => this.errors = errors));
   

  }

  getMyBloodDonor() {
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }
    this.errors = '';

    this.subscriptions.add(this.userService.getBloodDonors()
      .subscribe(
          result => {
         
                for(let bloodDonor of result.json()){
                  if(bloodDonor.patientId==this.patientId && !bloodDonor.patientConfirmed)
                  {
                    this.myBloodDonor=bloodDonor;
                    break;
                  } 
                }
          },
          errors => this.errors = errors));
  }


  private getPatient() {
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }

    this.subscriptions.add(this.userService.getPatient(this.patientId)
    .subscribe((patient: PatientProfile) => {
        this.patient = patient;
        this.patientAlreadyDonated (this.patientId);
        this.checkDonateRequests();
    },
    errors => this.errors = errors
    ));
  }

   addBloodDonor({ value, valid }: { value: Donor, valid: boolean }) {
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }
    this.errors = '';
    if (valid) {

      this.subscriptions.add(this.userService.addBloodDonor(this.patientId, value.type, this.now)
      .subscribe(
          result => {
              if (result) {
                window.location.reload(); 
              }
          },
          errors => this.errors = errors));
    }
    
    
  }


  getBloodDonorsByFilter({ value, valid }: { value: DonorFilter, valid: boolean }, skip : number) {
    this.isExpired = this.userService.isExpired();
    if(this.isExpired) {
      this.authService.logout();
    }

    this.errors = '';

    this.bloodDonorsList = [];
    this.bloodDonorsListValidated = [];

    this.numbers = [];
    this.numberPages = 0;

    if (valid) {
      this.subscriptions.add(this.userService.getBloodDonorsByFilter(value.type,
          value.city,
          skip * 10,
          10)
          
          .subscribe((response : Response) => {

            this.bloodDonorsList = response.json();

            for(let bloodDonor of this.bloodDonorsList) {
              if (bloodDonor.haveDonated==false && bloodDonor.patientId!=this.patientId) {
                this.bloodDonorsListValidated.push(bloodDonor);
              } 
              else {
                this.numberPages = this.numberPages - 1;
              }
            }

            this.numberPages = +response.headers.get('x-inlinecount');
            this.numbers = [];
            this.lastPage = Math.ceil(this.numberPages / 10);
            for(let i = 0; i < this.numberPages / 10; i++)
            {
              this.numbers.push(i+1);
            }

            if(this.bloodDonorsListValidated.length == 0) {
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
