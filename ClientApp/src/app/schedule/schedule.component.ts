import { Component, OnInit, ApplicationRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DoctorProfile } from '../shared/models/doctor-profile';
import { DoctorFilter } from '../shared/models/doctor-filter';
import { Response } from '@angular/http/src/static_response';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  doctorSearch: FormGroup;
  errors : string;
  submitted = false;
  isRequesting = false;

  doctorsList : Array<DoctorProfile>;
  doctor : DoctorProfile;

  numberPages : number;
  numbers : Array<number>;

  subscriptions = new Subscription();

  active: Array<boolean> ;

  constructor(private router: Router, private userService: UserService, private formBuilder: FormBuilder, _applicationRef: ApplicationRef, zone: NgZone) {
    router.events.subscribe((uri)=> {
      zone.run(() => _applicationRef.tick());
  });
    this.doctorsList = new Array<DoctorProfile>();
    this.numbers = new Array<number>();
    this.active = new Array<boolean>();
    this.active[1]=true;
   }


  ngOnInit() {
    this.doctorSearch = this.formBuilder.group({
      hospital: [''],
      city: [''],
      speciality: [''],
      name: ['']
    });

    this.getDoctorsByFilter(this.doctorSearch, 0);
  }

  activate(page) {
    if(!this.active[page]) {
      this.active.fill(false);
      this.active[page] = true;
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
