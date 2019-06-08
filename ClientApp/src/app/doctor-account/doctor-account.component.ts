import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { DoctorProfile } from '../shared/models/doctor-profile';

import { UserService } from '../shared/services/user.service';
import { Router } from '@angular/router';
import { isUndefined } from 'util';
import { Md5 } from 'ts-md5/dist/md5';
import { NgForm } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-doctor-account',
  templateUrl: './doctor-account.component.html',
  styleUrls: ['./doctor-account.component.scss']
})
export class DoctorAccountComponent implements OnInit {

  private buttonsClicked: boolean[];
  doctorEditForm: FormGroup;
  doctorPasswordEditForm: FormGroup;
  doctorEmailEditForm: FormGroup;
  errors: string;  
  isRequesting: boolean;
  submitted: boolean = false;
  submitted2: boolean = false;
  submitted3: boolean = false;
  doctorId : string;
  email: string;
  password: string;
  doctor: DoctorProfile;
  private subscriptions = new Subscription();

  toggleShow(nr) {
    this.buttonsClicked = [false, false, false];
    this.buttonsClicked[nr]=true;
    $(".accountMenu button").removeClass("active");
    $(".accountMenu button").on("click", function() {
      $(".accountMenu button").removeClass("active");
      $(this).addClass("active");
    });
  }
  
    reload() {
      if(!!localStorage.getItem('reload') == true) {
      }
      else {
        localStorage.setItem('reload','true');
        window.location.reload();
      }
    }

  constructor(private router: Router, private userService: UserService, private formBuilder: FormBuilder) { }
  ngOnInit() {
    this.reload();

    this.buttonsClicked = [true, false, false];

    this.doctorId =  this.userService.getUserId();
    
    if(this.doctorId != null) {
      this.getDoctor();
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

  
    this.doctorEditForm = this.formBuilder.group({
      lastName: ['Test', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]],
      firstName: ['Test', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]],
      phoneNumber: ['0745119974', [Validators.required, Validators.pattern("[0-9]+")]],
      speciality: ['Test', [Validators.required]],
      description: ['Testtttttt', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      address: ['Str. Petre', [Validators.required]],
      hospital: ['Test', [Validators.required]],
      city: ['Iasi', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(35), this.validatePasswordConfirmation.bind(this)]],
      country: ['Romania', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]]    
    });

    this.doctorPasswordEditForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(35), this.validatePasswordConfirmation.bind(this)]],
      confirmNewPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(35)]],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(35)]]
    },
    {validator: this.validateConfirmPassword}
    );


    this.doctorEmailEditForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(35), this.validatePasswordConfirmation.bind(this)]],
      email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")], this.validateDoctorEmailNotTaken.bind(this)]
    });
  }

  validateConfirmPassword(frm: FormGroup){
    return frm.controls['newPassword'].value === 
    frm.controls['confirmNewPassword'].value ? null : {'mismatch': true};
  }

  validateDoctorEmailNotTaken(control: AbstractControl) {
    return this.userService.checkDoctorEmailNotTaken(control.value).map(res => {
      return res ? null : { doctorEmailTaken: true };
    });
  }

  private getDoctor() {
    this.subscriptions.add(this.userService.getDoctor(this.doctorId)
    .subscribe((doctor: DoctorProfile) => {
        this.doctor = doctor;
        this.email = doctor.email;
        this.password = doctor.password;
        this.doctorEditForm.controls['lastName'].setValue(doctor.lastName);
        this.doctorEditForm.controls['firstName'].setValue(doctor.firstName);
        this.doctorEditForm.controls['phoneNumber'].setValue(doctor.phoneNumber);
        this.doctorEditForm.controls['speciality'].setValue(doctor.speciality);
        this.doctorEditForm.controls['description'].setValue(doctor.description);
        this.doctorEditForm.controls['hospital'].setValue(doctor.hospital);
        this.doctorEditForm.controls['address'].setValue(doctor.address);
        this.doctorEditForm.controls['city'].setValue(doctor.city);
        this.doctorEditForm.controls['country'].setValue(doctor.country);
    },
    errors => this.errors = errors
    ));
  }



  editDoctorProfile(doctorEditForm: FormGroup) {
  this.submitted = true;
  this.isRequesting = true;
  this.errors = '';
  if (doctorEditForm.valid) { 
    this.subscriptions.add(this.userService.editDoctorProfile(this.doctorId,
          this.doctor.din,
          doctorEditForm.value.firstName,
          doctorEditForm.value.lastName,
          this.email,
          doctorEditForm.value.password,
          doctorEditForm.value.city,
          doctorEditForm.value.country,
          doctorEditForm.value.description,
          doctorEditForm.value.speciality,
          doctorEditForm.value.address,
          doctorEditForm.value.hospital,
          doctorEditForm.value.phoneNumber)
          .finally(() => this.isRequesting = false)
          .subscribe(
              result => {
                  if (result) {
                      this.router.navigate(['/doctor/account']);
                      localStorage.setItem('displayMessage1', "true");
                      window.location.reload();
                  }
              },
              errors => this.errors = errors));
  }
  }

  editDoctorPassword({ value, valid }: { value: DoctorProfile, valid: boolean }) {
    this.submitted2 = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      this.subscriptions.add(this.userService.editDoctorProfile(this.doctorId,
            this.doctor.din,
            this.doctor.firstName,
            this.doctor.lastName,
            this.email,
            value.newPassword,
            this.doctor.city,
            this.doctor.country,
            this.doctor.description,
            this.doctor.speciality,
            this.doctor.address,
            this.doctor.hospital,
            this.doctor.phoneNumber)
            .finally(() => this.isRequesting = false)
            .subscribe(
                result => {
                    if (result) {
                        this.router.navigate(['/doctor/account']);
                        localStorage.setItem('displayMessage2', "true");
                        window.location.reload(); 
                    }
                },
                errors => this.errors = errors));
    }
    }

    editDoctorEmail({ value, valid }: { value: DoctorProfile, valid: boolean }) {
      this.submitted3 = true;
      this.isRequesting = true;
      this.errors = '';
      if (valid) {
        this.subscriptions.add(this.userService.editDoctorProfile(this.doctorId,
            this.doctor.din,
            this.doctor.firstName,
            this.doctor.lastName,
            value.email,
            value.password,
            this.doctor.city,
            this.doctor.country,
            this.doctor.description,
            this.doctor.speciality,
            this.doctor.address,
            this.doctor.hospital,
            this.doctor.phoneNumber)
              .finally(() => this.isRequesting = false)
              .subscribe(
                  result => {
                      if (result) {
                          this.router.navigate(['/doctor/account']);
                          localStorage.setItem('displayMessage3', "true");
                          window.location.reload(); 
                      }
                  },
                  errors => this.errors = errors));
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


  ngOnDestroy() {
    localStorage.removeItem('displayMessage1');
    localStorage.removeItem('displayMessage2');
    localStorage.removeItem('displayMessage3');
    this.subscriptions.unsubscribe();
    localStorage.removeItem('reload');
  }

}
