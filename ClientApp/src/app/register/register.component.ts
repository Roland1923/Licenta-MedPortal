import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
    $(document).ready(function() {
      $("#bg").mousemove(function(e){
        var x = -(e.pageX + this.offsetLeft) / 65;
        var y = -(e.pageY + this.offsetTop) / 65;
        $('#bg').css("background-position", x + "px " + y + "px");
      });
    });
  }

}
