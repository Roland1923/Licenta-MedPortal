import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { of, Observable, Subscription } from 'rxjs';
import { PatientProfile } from '../shared/models/patient-profile';
import { UserService } from '../shared/services/user.service';
import { Router, RoutesRecognized, NavigationEnd } from '@angular/router';
import { isUndefined } from 'util';
import { Md5 } from 'ts-md5/dist/md5';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { pairwise, filter } from 'rxjs/operators';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateAdapter, NgbDateNativeAdapter} from '@ng-bootstrap/ng-bootstrap';

declare var $: any;

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

  toggleShow(nr) {
    this.buttonsClicked = [false, false, false];
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
  
  constructor(public router: Router, private userService: UserService, private formBuilder: FormBuilder) { 
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
    },
    errors => this.errors = errors
    ));
  }



  editPatientProfile(patientEditForm: FormGroup) {
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
