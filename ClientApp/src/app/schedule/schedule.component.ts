import { Component, OnInit, ApplicationRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { DoctorProfile } from '../shared/models/doctor-profile';
import { DoctorFilter } from '../shared/models/doctor-filter';
import { Response } from '@angular/http/src/static_response';
import { Subscription } from 'rxjs';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { AppointmentInterval } from '../shared/models/appointment-interval';
import { PatientProfile } from '../shared/models/patient-profile';
import * as moment from 'moment'

declare var $: any;

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  model: NgbDateStruct;
  date: {year: number, month: number};


  doctorSearch: FormGroup;
  errors : string;
  submitted = false;
  isRequesting = false;

  doctorsList : Array<DoctorProfile>;
  appointmentIntervalsList : Array<AppointmentInterval>;
  doctor : DoctorProfile;

  numberPages : number;
  numbers : Array<number>;

  subscriptions = new Subscription();

  active: Array<boolean>;
  activeDisponibility:{ [key: string]: boolean; } = {};

  isExpired: boolean;
  lastPage: number;
  scheduleNotClicked: boolean = true;
  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  now: Date = new Date();
  nrOfMonthsTillNextYear: number;
  dateString: string;
  day_of_week: number;
  dateSelected: boolean = false;
  disponibilitySelected: boolean = false;
  appointmentDate: Date;
  patientId: string;
  patient: PatientProfile;
  appointmentIntervalId: string;
  appointmentIntervalsListWithValidSchedule:  Array<AppointmentInterval>;

  constructor(private router: Router, private userService: UserService, private formBuilder: FormBuilder, _applicationRef: ApplicationRef) {
      
    this.minDate = {year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate()};
    this.nrOfMonthsTillNextYear = 12 - this.now.getMonth();
    this.maxDate = {year: this.now.getFullYear(), month: this.now.getMonth() + this.nrOfMonthsTillNextYear, day: this.now.getDate()};

    this.doctorsList = new Array<DoctorProfile>();
    this.numbers = new Array<number>();
    this.active = new Array<boolean>();
    this.active[1]=true;
   }

   scheduleClicked(doctor: DoctorProfile) {
     this.scheduleNotClicked = false;
     this.doctor = doctor;
   }

  ngOnInit() {
    
    this.doctorSearch = this.formBuilder.group({
      hospital: [''],
      city: [''],
      speciality: [''],
      name: ['']
    });

    this.patientId =  this.userService.getUserId();
    this.isExpired = this.userService.isExpired();

    if(this.patientId != null && !this.isExpired) {
      this.getPatient();
    }
    else {
      this.router.navigate(['/patient-login']);
      localStorage.clear();
    }


    this.getDoctorsByFilter(this.doctorSearch, 0);
  }

  private getPatient() {
    this.subscriptions.add(this.userService.getPatient(this.patientId)
    .subscribe((patient: PatientProfile) => {
        this.patient = patient;
    },
    errors => this.errors = errors
    ));
  }


  goBack () {
    this.scheduleNotClicked = true;
    this.appointmentIntervalsListWithValidSchedule = [];
    this.dateSelected = false;
    this.disponibilitySelected = false;
    this.appointmentDate = null;
  }

  scheduleAppointment() {

      this.errors = '';

      this.subscriptions.add(this.userService.appointmentRegister(this.patient.patientId, this.doctor.doctorId, this.appointmentDate, this.appointmentIntervalId)
        .subscribe(
            result => {
                if (result) {
                  this.router.navigate(['/patient/account']);
                }
            },
            errors => this.errors = errors));
  }

  listScheduleForDate(pickedDate: NgbDateStruct) {
    this.dateSelected = true;
    let dateString = pickedDate.month  + "-" + pickedDate.day + "-" + pickedDate.year + " 23:15:30";

    let date = new Date(dateString);
    this.appointmentDate = new Date(date);

    let day_of_week = date.getDay();

    this.errors = '';

    this.appointmentIntervalsList = [];
    this.appointmentIntervalsListWithValidSchedule = [];

    this.subscriptions.add(this.userService.getAppointmentIntervals()
        .subscribe(response => {
          this.appointmentIntervalsList = response.json();
          for(var appointmentInterval of this.appointmentIntervalsList) {
            var appointmentExist = false;
            if(appointmentInterval.day==day_of_week && appointmentInterval.doctorId===this.doctor.doctorId) 
            {
              if(appointmentInterval.appointments!=null) {
                for(var appointment of appointmentInterval.appointments) {

                  var appDate = new Date(appointment.appointmentDate);
    
                  appDate.setHours(6,0,0,0);
                  this.appointmentDate.setHours(6,0,0,0);
    
                  if(appDate.getTime() === this.appointmentDate.getTime()) {
                    appointmentExist = true;
                  }
                }
              }
              if(!appointmentExist) {
                this.appointmentIntervalsListWithValidSchedule.push(appointmentInterval);
              }
             
            }
          }
            
          this.appointmentIntervalsListWithValidSchedule.sort(function(a,b){
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
      ));
    
  }

  activate(page) {
    if(!this.active[page]) {
      this.active.fill(false);
      this.active[page] = true;
    }
  }

  activateDisponibility(id) {
    this.appointmentIntervalId = id;
    this.disponibilitySelected = true;
    if(!this.activeDisponibility[id]) {
      for(let activeDisp in this.activeDisponibility) {
        if(this.activeDisponibility[activeDisp] == true) {
          this.activeDisponibility[activeDisp] = false;
        }
      }
        this.activeDisponibility[id] = true;
    }
  }

  getDoctorsByFilter({ value, valid }: { value: DoctorFilter, valid: boolean }, skip : number) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';

    this.doctorsList = [];
    this.numbers = [];
    this.numberPages = 0;

    if (valid) {
      this.subscriptions.add(this.userService.getDoctorsByFilter(value.name,
          value.hospital,
          value.speciality,
          value.city,
          skip * 10,
          10)
          .finally(() => this.isRequesting = false)
          .subscribe((response : Response) => {

            this.doctorsList = response.json();

            this.numberPages = +response.headers.get('x-inlinecount');
            this.numbers = [];
            this.lastPage = Math.ceil(this.numberPages / 10);
            for(let i = 0; i < this.numberPages / 10; i++)
            {
              this.numbers.push(i+1);
            }

            if(this.doctorsList.length == 0) {
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
