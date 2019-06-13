import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorRegistration } from '../shared/models/doctor-registration';
import { PatientRegistration } from '../shared/models/patient-registration';
import { UserService } from '../shared/services/user.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {

  errors: string;  
  isRequesting: boolean;
  submitted: boolean = false;
  doctorModel = {};
  patientModel ={};
  doctorRegisterForm: FormGroup;
  patientRegisterForm: FormGroup;
  private subscriptions = new Subscription();

  constructor(private userService: UserService, public router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    $(document).ready(function() {
      $("#bg").mousemove(function(e){
        var x = -(e.pageX + this.offsetLeft) / 65;
        var y = -(e.pageY + this.offsetTop) / 65;
        $('#bg').css("background-position", x + "px " + y + "px");
      });
    });

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


    this.doctorRegisterForm = this.formBuilder.group({
      din:  ['', [Validators.required], this.validateDoctorDINNotTaken.bind(this)],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]],
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]],
      phoneNumber: ['', [Validators.required, Validators.pattern("[0-9]+")]],
      email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")], this.validateDoctorEmailNotTaken.bind(this)],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      speciality: ['', [Validators.required]],
      hospital: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]],
      country: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(35)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(35)]]
  },
      {validator: this.validateConfirmPassword}
  );

    this.patientRegisterForm = this.formBuilder.group({
      nin:  ['', [Validators.required], this.validatePatientNINNotTaken.bind(this)],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]],
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]],
      phoneNumber: ['', [Validators.required, Validators.pattern("[0-9]+")]],
      birthdate: ['', [Validators.required, this.validateDOB.bind(this)]],
      city: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]],
      country: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(35)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(35)]],
      email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")], this.validatePatientEmailNotTaken.bind(this)]
  },
      {validator: this.validateConfirmPassword}
  );
  }

  validateDOB(control: AbstractControl){
    let year = new Date(control.value).getFullYear();
    let today = new Date().getFullYear();
    if(today - year >= 120 || today-year<0) {
      return { DOBwrong: false };
    }
    else {
      return true;
    }
  }

  validateConfirmPassword(frm: FormGroup){
    return frm.controls['password'].value === 
    frm.controls['confirm_password'].value ? null : {'mismatch': true};
  }

  validateDoctorDINNotTaken(control: AbstractControl) {
    return this.userService.checkDoctorDINNotTaken(control.value).map(res => {
      return res ? null : { dinTaken: true };
    });
  }

  validateDoctorEmailNotTaken(control: AbstractControl) {
    return this.userService.checkDoctorEmailNotTaken(control.value).map(res => {
      return res ? null : { doctorEmailTaken: true };
    });
  }

  validatePatientNINNotTaken(control: AbstractControl) {
    return this.userService.checkPatientNINNotTaken(control.value).map(res => {
      return res ? null : { ninTaken: true };
    });
  }

  validatePatientEmailNotTaken(control: AbstractControl) {
    return this.userService.checkPatientEmailNotTaken(control.value).map(res => {
      return res ? null : { patientEmailTaken: true };
    });
  }



  registerDoctor({ value, valid }: { value: DoctorRegistration, valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      this.subscriptions.add(this.userService.doctorRegister(value.din,
                value.firstName,
                value.lastName,
                value.email,
                value.password,
                value.phoneNumber,
                value.description,
                value.speciality,
                value.hospital,
                value.city,
                value.country,
                value.address)
                .finally(() => this.isRequesting = false)
                .subscribe(
                    result => {
                        if (result) {
                            this.router.navigate(['/doctor-login']);
                        }
                    },
                    errors => this.errors = errors));
    }
  }

  registerPatient({ value, valid }: { value: PatientRegistration, valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      this.subscriptions.add(this.userService.patientRegister(value.nin,
                value.firstName,
                value.lastName,
                value.email,
                value.password,
                value.city,
                value.country,
                value.birthdate,
                value.phoneNumber)
                .finally(() => this.isRequesting = false)
                .subscribe(
                    result => {
                        if (result) {
                            this.router.navigate(['/patient-login']);
                        }
                    },
                    errors => this.errors = errors));
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
