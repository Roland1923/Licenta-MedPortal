import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  doctorSearch: FormGroup;

  constructor(private router: Router, private userService: UserService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.doctorSearch = this.formBuilder.group({
      country: [''],
      city: [''],
      speciality: [''],
      doctorOrInstitute: ['']
    });
  }

}
