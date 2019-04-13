import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, XHRBackend } from '@angular/http';

import { routing } from './app-routing.module';

import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path:'', redirectTo: '/home', pathMatch: 'full' },
      {path:'home', component:HomeComponent},
      {path:'doctor-login',component:LoginComponent},
      {path:'patient-login',component:LoginComponent},
      {path:'doctor-register',component:RegisterComponent},
      {path:'patient-register',component:RegisterComponent}
    ]),
    HttpClientModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
