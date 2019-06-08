import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { ResourceLoader } from '@angular/compiler';

@Component({
  selector: 'app-four-zero-four',
  templateUrl: './four-zero-four.component.html',
  styleUrls: ['./four-zero-four.component.scss']
})
export class FourZeroFourComponent implements OnInit {

  authenticate: boolean;
  isDoctor: boolean;

  reload() {
    if(!!localStorage.getItem('reload') == true) {
      localStorage.removeItem('reload');
    }
  }

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.reload();
    this.authenticate = this.authService.checkLogin();
    this.isDoctor = this.authService.checkDoctor();
  }

}
