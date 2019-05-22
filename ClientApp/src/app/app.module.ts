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
import { DoctorHomeComponent } from './doctor-home/doctor-home.component';
import { PatientHomeComponent } from './patient-home/patient-home.component';
import { FourZeroFourComponent } from './four-zero-four/four-zero-four.component';
import { AuthService } from './shared/services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    DoctorHomeComponent,
    PatientHomeComponent,
    FourZeroFourComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path:'', redirectTo: '/home', pathMatch: 'full' },
      {path:'home', component:HomeComponent},
      {path:'doctor-login', component:LoginComponent},
      {path:'patient-login', component:LoginComponent},
      {path:'doctor-register', component:RegisterComponent},
      {path:'patient-register', component:RegisterComponent},
      {path:'doctor-home', component:DoctorHomeComponent, data:{requiresDoctor: true}, canActivate: [ AuthService ]},
      {path:'patient-home', component:PatientHomeComponent, data:{requiresPatient: true}, canActivate: [ AuthService ]},
      {path:'**', component: FourZeroFourComponent}
    ]),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing
  ],
  providers: [UserService, ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule { }
