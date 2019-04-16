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

  constructor(private userService: UserService, public router: Router) { }

  ngOnInit() {
    $(document).ready(function() {
      $("#bg").mousemove(function(e){
        var x = -(e.pageX + this.offsetLeft) / 65;
        var y = -(e.pageY + this.offsetTop) / 65;
        $('#bg').css("background-position", x + "px " + y + "px");
      });
    });
  }

  registerDoctor({ value, valid }: { value: DoctorRegistration, valid: boolean }) {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';

    if(value.password != value.confirm_password) {
        this.errors = "Parolele nu coincid";
        console.log(value.password);
        console.log(value.confirm_password);
    }
    
    else {
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


}
