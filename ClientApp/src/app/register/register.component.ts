import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorRegistration } from '../shared/models/doctor-registration';
import { UserService } from '../shared/services/user.service';
import { KeyValuePipe } from '@angular/common';

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

  constructor(private userService: UserService, public router: Router) { }

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
                            this.router.navigate(['/home']);
                        }
                    },
                    errors => this.errors = errors);
    }
  }


}
