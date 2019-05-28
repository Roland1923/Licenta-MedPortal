import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  private authenticate: boolean;
  private isDoctor: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authenticate = this.authService.checkLogin();
    this.isDoctor = this.authService.checkDoctor();
  }

}
