import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { DoctorProfile } from '../shared/models/doctor-profile';

import { UserService } from '../shared/services/user.service';
import { Router } from '@angular/router';
import { isUndefined } from 'util';
import { Md5 } from 'ts-md5/dist/md5';
import { NgForm } from '@angular/forms';
import { AppointmentInterval } from '../shared/models/appointment-interval';

import { Time } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-doctor-account',
  templateUrl: './doctor-account.component.html',
  styleUrls: ['./doctor-account.component.scss']
})
export class DoctorAccountComponent implements OnInit {

  private buttonsClicked: boolean[];
  menuSelected: boolean[];
  doctorEditForm: FormGroup;
  doctorPasswordEditForm: FormGroup;
  doctorEmailEditForm: FormGroup;
  doctorAppointmentEditForm: FormGroup;
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
  isExpired: boolean;
  days: Array<{value: number, label: string}>;
  disponibilities: Array<AppointmentInterval>;
  startHour: Time;
  endHour: Time;
  showErrorHoursInterval: boolean = false;

  toggleShow(nr) {
    this.buttonsClicked = [false, false, false,false];
    this.buttonsClicked[nr]=true;
  }

  daysMenu(nr) {
    this.menuSelected = [false, false, false, false, false, false];
    this.menuSelected[nr] = true;
  }
  
    reload() {
      if(!!localStorage.getItem('reload') == true) {
      }
      else {
        localStorage.setItem('reload','true');
        window.location.reload();
      }
    }

  constructor(private router: Router, private userService: UserService, private formBuilder: FormBuilder) {
    this.disponibilities = new Array<AppointmentInterval>();
   }

  ngOnInit() {

    this.days = [
      { value: 1, label: 'Monday' },
      { value: 2, label: 'Tuesday' },
      { value: 3, label: 'Wednesday' },
      { value: 4, label: 'Thursday' },
      { value: 5, label: 'Friday' },
      { value: 6, label: 'Saturday' }
      ];

    this.reload();
    localStorage.setItem('reload','false');

    this.buttonsClicked = [true, false, false,false];
    this.menuSelected = [true, false, false, false, false, false];

    this.doctorId =  this.userService.getUserId();
    this.isExpired=this.userService.isExpired();

    if(this.doctorId != null && !this.isExpired) {
      this.getAppointmentIntervals();
      this.getDoctor();
    }
    else {
        this.router.navigate(['/doctor-login']);
        localStorage.clear();
    }


  
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

    this.doctorAppointmentEditForm = this.formBuilder.group({
      day: [1, [Validators.required]],
      startHour: ['08:00', [Validators.required]],
      endHour: ['08:30', [Validators.required]]
    },
    {validator: this.validateDifferenceBetweenHours}
    );

  }




  validateDifferenceBetweenHours(frm: FormGroup) {
    return frm.controls['startHour'].value < frm.controls['endHour'].value ? null : {'wrong': true};
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

  transformDayOfTheWeek(day: number) {
    switch(day) { 
      case 1: { 
        return "Monday";
      } 
      case 2: { 
        return "Tuesday";
      } 
      case 3: {
        return "Wednesday";   
      } 
      case 4: { 
        return "Thursday";
      }  
      case 5: { 
        return "Friday";
     }  
     case 6: { 
      return "Saturday";
     }  
  }
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
  
    editDoctorAppointment({ value, valid }: { value: AppointmentInterval, valid: boolean }) {
      this.isRequesting = true;
      this.errors = '';
      if (valid && this.validateHourNotTaken(this.doctorAppointmentEditForm, value.day)) {
        this.subscriptions.add(this.userService.addDoctorAppointment(this.doctorId,
            value.day,
            value.startHour,
            value.endHour)
              .finally(() => this.isRequesting = false)
              .subscribe(
                  result => {
                      if (result) {
                          this.showErrorHoursInterval = false;
                          this.getAppointmentIntervals();
                      }
                  },
                  errors => this.errors = errors));
      }
      else {
        this.isRequesting = false;
        this.showErrorHoursInterval = true;
      }
      }


    
    getAppointmentIntervals() {
      this.errors = '';
  
      this.disponibilities = [];
 
      this.subscriptions.add(this.userService.getAppointmentIntervalsForDoctor(this.doctorId)
          .subscribe((appointmentIntervals : Array<AppointmentInterval>) => {
            this.disponibilities = appointmentIntervals;
            this.disponibilities.sort(function(a,b){
              if(b.startHour < a.startHour) {
                return 1;
              }
              else if(b.startHour > a.startHour) {
                return -1
              }
              return 0;
            });
        },
        errors => this.errors = errors
        )
        );

    }

    validateHourNotTaken(frm: FormGroup, day: number) {
      let extractedStart = frm.controls['startHour'].value.split(":");
      let extractedEnd = frm.controls['endHour'].value.split(":");

      var startHour = extractedStart[0];
      var startMinute = extractedStart[1];

      var endHour = extractedEnd[0];
      var endMinute = extractedEnd[1];

      //Create date object and set the time to that
      var startTimeObject = new Date();
      startTimeObject.setHours(startHour, startMinute);

      //Create date object and set the time to that
      var endTimeObject = new Date(startTimeObject);
      endTimeObject.setHours(endHour, endMinute);

      

      for(let disponibility of this.disponibilities) {
        if(disponibility.day == day) {
          var disponibilityStringStartHour = disponibility.startHour.toString();
          var disponibilityStringEndHour = disponibility.endHour.toString();
  
          let disponibilityExtractedStart = disponibilityStringStartHour.split(":");
          let disponibilityExtractedEnd = disponibilityStringEndHour.split(":");
    
          var disponibilityStartHour = disponibilityExtractedStart[0];
          var disponibilityStartMinute = disponibilityExtractedStart[1];
    
          var disponibilityEndHour = disponibilityExtractedEnd[0];
          var disponibilityEndMinute = disponibilityExtractedEnd[1];
  
          //Create date object and set the time to that
          var startTimeDisponibility = new Date();
          startTimeDisponibility.setHours(parseInt(disponibilityStartHour), parseInt(disponibilityStartMinute));
  
          //Create date object and set the time to that
          var endTimeDisponibility = new Date(startTimeObject);
          endTimeDisponibility.setHours(parseInt(disponibilityEndHour), parseInt(disponibilityEndMinute));
       
          if(startTimeObject.getTime() == startTimeDisponibility.getTime() || endTimeObject.getTime() == endTimeDisponibility.getTime()) {
            return false;
          }
          if(startTimeObject < startTimeDisponibility && endTimeObject > startTimeDisponibility) {
            return false;
          }
          if(startTimeObject > startTimeDisponibility && startTimeObject < endTimeDisponibility ) {
            return false;
          }
        }
        
      }
      return true;
    }


    deleteDisponibility(id: string) {
      this.errors = '';
  
      this.subscriptions.add(this.userService.deleteDisponibility(id)
          .subscribe(() => {
            this.getAppointmentIntervals();
   
        },
        errors => this.errors = errors
        )
        );

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
  }

}
