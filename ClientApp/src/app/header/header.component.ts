import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  authenticate: boolean;
  isDoctor: boolean;
  allow: boolean;
  public href: string = "";
  paths: Array<string> = ['/patient/account', '/patient/appointments', '/patient/medical-history', '/doctor/account', '/doctor/appointments', '/patient/doctor-reviews'];

  constructor(private authService: AuthService, private router: Router) {
    this.router.events
    .subscribe((event) => {
      if (event instanceof NavigationStart) {
        if(this.paths.includes(event.url)) {
          this.allow=true;
        }
        else {
          this.allow=false;
        }
        this.authenticate = this.authService.checkLogin();
        this.isDoctor = this.authService.checkDoctor();
      }
    });
   }

  ngOnInit() {
  }


  logout() {
    this.authService.logout();
    localStorage.removeItem('reload');
  }

}
