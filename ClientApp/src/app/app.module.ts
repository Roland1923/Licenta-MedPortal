import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, XHRBackend } from '@angular/http';

import { routing } from './app-routing.module';

import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { UserService } from './shared/services/user.service';
import { HttpClientModule } from '@angular/common/http';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FooterComponent } from './footer/footer.component';
import { ConfigService } from './shared/services/config.service';
import { FourZeroFourComponent } from './four-zero-four/four-zero-four.component';
import { AuthService } from './shared/services/auth.service';
import { HeaderComponent } from './header/header.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { PatientMedicalHistoryComponent } from './patient-medical-history/patient-medical-history.component';
import { PatientAccountComponent } from './patient-account/patient-account.component';
import { DoctorAccountComponent } from './doctor-account/doctor-account.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    FourZeroFourComponent,
    HeaderComponent,
    ScheduleComponent,
    PatientMedicalHistoryComponent,
    PatientAccountComponent,
    DoctorAccountComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    RouterModule.forRoot([
      {path:'', redirectTo: '/home', pathMatch: 'full' },
      {path:'home', component:HomeComponent},
      {path:'doctor-login', component:LoginComponent},
      {path:'patient-login', component:LoginComponent},
      {path:'doctor-register', component:RegisterComponent},
      {path:'patient-register', component:RegisterComponent},
      {path:'patient/appointments', component:ScheduleComponent, data:{requiresPatient: true}, canActivate: [ AuthService]},
      {path:'patient/medical-history', component:PatientMedicalHistoryComponent, data:{requiresPatient: true}, canActivate: [ AuthService]},
      {path:'patient/account', component:PatientAccountComponent, data:{requiresPatient: true}, canActivate: [ AuthService]},
      {path:'doctor/account', component:DoctorAccountComponent, data:{requiresDoctor: true}, canActivate: [ AuthService]},
      {path:'**', component: FourZeroFourComponent}
    ]),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing
  ],
  providers: [UserService, ConfigService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
