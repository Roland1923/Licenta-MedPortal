import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorRegistration } from '../shared/models/doctor-registration';
import { PatientRegistration } from '../shared/models/patient-registration';
import { UserService } from '../shared/services/user.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

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
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      phoneNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")], this.validateDoctorEmailNotTaken.bind(this)],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      speciality: ['', [Validators.required]],
      hospital: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      country: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
  });

    this.patientRegisterForm = this.formBuilder.group({
      nin:  ['', [Validators.required], this.validatePatientNINNotTaken.bind(this)],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      phoneNumber: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      country: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")], this.validatePatientEmailNotTaken.bind(this)]
  });
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
      this.userService.doctorRegister(value.din,
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
                    errors => this.errors = errors);
    }
  }

  registerPatient({ value, valid }: { value: PatientRegistration, valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (valid) {
      this.userService.patientRegister(value.nin,
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
                    errors => this.errors = errors);
    }
  }


}
