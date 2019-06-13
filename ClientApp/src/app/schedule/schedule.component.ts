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

    this.isExpired=this.userService.isExpired();
    if(this.isExpired) {
      this.router.navigate(['/patient-login']);
      localStorage.clear();
    }


    this.getDoctorsByFilter(this.doctorSearch, 0);
  }

  goBack () {
    this.scheduleNotClicked = true;
    this.appointmentIntervalsList = [];
    this.dateSelected = false;
    this.disponibilitySelected = false;
  }

  listScheduleForDate(pickedDate: NgbDateStruct) {
    this.dateSelected = true;
    let dateString = pickedDate.year + "-" + pickedDate.month + "-" + pickedDate.day;
    let date = new Date(dateString);
    let day_of_week = date.getDay();

    this.errors = '';

    this.appointmentIntervalsList = [];


    this.subscriptions.add(this.userService.getAppointmentIntervalsByFilter(this.doctor.doctorId, day_of_week)
        .subscribe((response : Response) => {

          this.appointmentIntervalsList = response.json();
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
