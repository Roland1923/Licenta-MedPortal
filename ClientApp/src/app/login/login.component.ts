import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  doctorLoginForm: FormGroup;
  patientLoginForm: FormGroup;
  private postStream: Subscription;
  private nin: string;
  private din: string;
  private password: string;
  loginFailed: boolean;

  constructor(private authService: AuthService, public router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    $(document).ready(function() {
      $("#bg").mousemove(function(e){
        var x = -(e.pageX + this.offsetLeft) / 65;
        var y = -(e.pageY + this.offsetTop) / 65;
        $('#bg').css("background-position", x + "px " + y + "px");
      });
    });

    this.patientLoginForm = this.formBuilder.group({
      nin:  ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    this.doctorLoginForm = this.formBuilder.group({
      din:  ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

  }

  loginPatient() {
    if (this.postStream) { this.postStream.unsubscribe }
      this.nin = this.patientLoginForm.get('nin').value;
      this.password = this.patientLoginForm.get('password').value;
      this.loginFailed = false;
        this.postStream = this.authService.loginPatient(this.nin, this.password).subscribe(
            result => {
                if (result.state == 1) {
                    this.router.navigate(["patient/account"]);
                } 
                else {
                  this.loginFailed = true;
                }
            }
        )
  }

  loginDoctor() {
    if (this.postStream) { this.postStream.unsubscribe }
      this.din = this.doctorLoginForm.get('din').value;
      this.password = this.doctorLoginForm.get('password').value;
      this.loginFailed = false;
        this.postStream = this.authService.loginDoctor(this.din, this.password).subscribe(
            result => {
                if (result.state == 1) {
                    this.router.navigate(["doctor/account"]);
                } 
                else {
                  this.loginFailed = true;
                }
            }
        )
  }


  ngOnDestroy() {
    if(this.postStream){this.postStream.unsubscribe()}
}
}
