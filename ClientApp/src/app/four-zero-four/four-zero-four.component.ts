import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-four-zero-four',
  templateUrl: './four-zero-four.component.html',
  styleUrls: ['./four-zero-four.component.scss']
})
export class FourZeroFourComponent implements OnInit {

  private authenticate: boolean;
  private isDoctor: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authenticate = this.authService.checkLogin();
    this.isDoctor = this.authService.checkDoctor();
  }

}
