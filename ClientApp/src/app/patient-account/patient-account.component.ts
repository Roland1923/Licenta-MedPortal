import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { of, Observable } from 'rxjs';
import { PatientProfile } from '../shared/models/patient-profile';
import { UserService } from '../shared/services/user.service';
import { Router } from '@angular/router';
import { isUndefined } from 'util';
import { Md5 } from 'ts-md5/dist/md5';

declare var $: any;

@Component({
  selector: 'app-patient-account',
  templateUrl: './patient-account.component.html',
  styleUrls: ['./patient-account.component.scss']
})
export class PatientAccountComponent implements OnInit {

  private buttonsClicked: boolean[];
  patientEditForm: FormGroup;
  patientPasswordEditForm: FormGroup;
  errors: string;  
  isRequesting: boolean;
  submitted: boolean = false;
  submitted2: boolean = false;
  patientId : string;
  password: string;
  email: string;
  patient: PatientProfile;

  toggleShow(nr) {
    this.buttonsClicked = [false, false, false];
    this.buttonsClicked[nr]=true;
    $(".accountMenu button").removeClass("active");
    $(".accountMenu button").on("click", function() {
      $(".accountMenu button").removeClass("active");
      $(this).addClass("active");
    });
  }

  constructor(private router: Router, private userService: UserService, private formBuilder: FormBuilder) { 
  }

  ngOnInit() {
    this.buttonsClicked = [true, false, false];

    this.patientId =  this.userService.getUserId();
    this.password = this.userService.getPassword();
    this.email = this.userService.getEmail();
    if(this.patientId != null) {
      this.getPatient();
    }
    else {
        this.router.navigate(['/home']);
    }

    $(function(){
      var dtToday = new Date();
      
      var month = (dtToday.getMonth() + 1).toString();
      var day = dtToday.getDate().toString();
      var year = dtToday.getFullYear().toString();
      if(parseInt(month) < 10)
        month = '0' + month.toString();
      if(parseInt(day) < 10)
        day = '0' + day.toString();
      
      var minDate = '1900-01-01';

      var maxDate = year + '-' + month + '-' + day;
      $('#txtDate').attr('max', maxDate);
      $('#txtDate').attr('min', minDate);
         
      
  });

  
    this.patientEditForm = this.formBuilder.group({
      lastName: ['Test', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]],
      firstName: ['Test', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]],
      phoneNumber: ['0745119974', [Validators.required, Validators.pattern("[0-9]+")]],
      birthdate: ['1996-02-10', [Validators.required,this.validateDOB.bind(this)]],
      city: ['Iasi', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(35), this.validatePasswordConfirmation.bind(this)]],
      country: ['Romania', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]]    
    });

    this.patientPasswordEditForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(35), this.validatePasswordConfirmation.bind(this)]],
      confirmNewPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(35)]],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(35)]]
    });

  }



  private getPatient() {
    this.userService.getPatient(this.patientId)
    .subscribe((patient: PatientProfile) => {
        this.patient = patient;
    },
    errors => this.errors = errors
    );
  }



  editPatientProfile({ value, valid }: { value: PatientProfile, valid: boolean }) {
  this.submitted = true;
  this.isRequesting = true;
  this.errors = '';
  if (valid) {
      this.userService.editPatientProfile(this.patientId,
          this.patient.nin,
          value.firstName,
          value.lastName,
          this.email,
          this.password,
          value.city,
          value.country,
          value.birthdate,
          value.phoneNumber)
          .finally(() => this.isRequesting = false)
          .subscribe(
              result => {
                  if (result) {
                      this.router.navigate(['/patient/account']);
                      localStorage.setItem('displayMessage1', "true");
                      window.location.reload();
                  }
              },
              errors => this.errors = errors);
  }
  }

  editPatientPassword({ value, valid }: { value: PatientProfile, valid: boolean }) {
    this.submitted2 = true;
    this.isRequesting = true;
    this.errors = '';

    if (valid) {
        this.userService.editPatientProfile(this.patientId,
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
                        window.location.reload(); //??
                    }
                },
                errors => this.errors = errors);
    }
    }

  
  validateDOB(control: AbstractControl){
    let year = new Date(control.value).getFullYear();
    let today = new Date().getFullYear();
    if(today - year >= 120 || today-year<0) {
      return { DOBwrong: false };
    }
    else {
      return null;
    }
  }

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

}
