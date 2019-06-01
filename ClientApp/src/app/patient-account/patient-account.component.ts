import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-patient-account',
  templateUrl: './patient-account.component.html',
  styleUrls: ['./patient-account.component.scss']
})
export class PatientAccountComponent implements OnInit {

  private buttonsClicked: boolean[];
  patientEditForm: FormGroup;

  toggleShow(nr) {
    this.buttonsClicked = [false, false, false];
    this.buttonsClicked[nr]=true;
  }

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buttonsClicked = [true, false, false];
    $('.accountMenu button').on('click', function(){
      $(this).siblings().removeClass('active')
      $(this).addClass('active');
    })

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

  
  this.patientEditForm = this.formBuilder.group({
    lastName: ['Iordache', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]],
    firstName: ['Roland', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]],
    phoneNumber: ['0746524459', [Validators.required, Validators.pattern("[0-9]+")]],
    birthday: ['', [Validators.required]],
    city: ['Iasi', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]],
    country: ['Romania', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern("[a-zA-Z]+")]]    
  });
  }

}
