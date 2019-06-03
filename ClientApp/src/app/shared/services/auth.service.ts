import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ConfigService } from './config.service';
import { Observable, of } from 'rxjs';
import { AuthBearer } from '../models/auth.interface';
import { debounceTime } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate{

  baseUrl = '';
  private tokeyKey = "token";

  constructor(private http: HttpClient, private configService: ConfigService, private router: Router) { 
    this.baseUrl = configService.getApiURI();
  }

  canActivate(route: ActivatedRouteSnapshot): boolean{
    const requiresLogin = route.data.requiresLogin || false;
    if (requiresLogin) {
      // Check that the user is logged in...
      if(!this.checkLogin()) {
        this.router.navigate(['home']);
        return false;
      }
      return true;
    }

    const requiresDoctor = route.data.requiresDoctor || false;
    if (requiresDoctor) {
      // Check that the user is doctor or not
      if(this.checkLogin()) {
        if(!this.checkDoctor()) {
          this.router.navigate(['patient-home']);
          return false;
        }
        else {
          return true;
        }
      }
      this.router.navigate(['home']);;
      return false;
    }

    const requiresPatient = route.data.requiresPatient || false;
    if (requiresPatient) {
      // Check that the user is patient or not
      if(this.checkLogin()) {
        if(this.checkDoctor()) {
          this.router.navigate(['doctor-home']);
          return false;
        }
        else {
          return true;
        }
      }
      this.router.navigate(['home']);;
      return false;
    }
  }

  public loginPatient(nin: string, password: string) {
    let body = JSON.stringify({nin, password});
    
    let header = new HttpHeaders().set('Content-Type', 'application/json');
    let options = { headers: header };

    return this.http.put<AuthBearer>(this.baseUrl +"api/Account/patientAccount", body, options).pipe(
        debounceTime(200),
        distinctUntilChanged(),
        map(
            res => {
                let result = res;
                console.log(result);
                if (result.state && result.state == 1 && result.data && result.data.accessToken) {
                    localStorage.setItem('user_id',result.data.user_id);
                    localStorage.setItem('user_password',result.data.user_password);
                    localStorage.setItem('user_email',result.data.user_email);
                    localStorage.setItem('isDoctor',result.data.isDoctor);
                    sessionStorage.setItem(this.tokeyKey,result.data.accessToken);
                }
                return result;
            }
        ),

        catchError(this.handleError<AuthBearer>("login"))
    )
  }


  public loginDoctor(din: string, password: string) {
    let body = JSON.stringify({din, password});
    
    let header = new HttpHeaders().set('Content-Type', 'application/json');
    let options = { headers: header };

    return this.http.put<AuthBearer>(this.baseUrl +"api/Account/doctorAccount", body, options).pipe(
        debounceTime(200),
        distinctUntilChanged(),
        map(
            res => {
                let result = res;
                console.log(result);
                if (result.state && result.state == 1 && result.data && result.data.accessToken) {
                    localStorage.setItem('user_id',result.data.user_id);
                    localStorage.setItem('user_password',result.data.user_password);
                    localStorage.setItem('user_email',result.data.user_email);
                    localStorage.setItem('isDoctor',result.data.isDoctor);
                    sessionStorage.setItem(this.tokeyKey,result.data.accessToken);
                }
                return result;
            }
        ),

        catchError(this.handleError<AuthBearer>("login"))
    )
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
        console.error(`${operation} error: ${error.message}`);
        return of(result as T);
    };
  }

  public checkLogin(): boolean {
    let token = sessionStorage.getItem(this.tokeyKey);
    return token != null;
}

  public checkDoctor(): boolean {
    let isDoctor = localStorage.getItem('isDoctor') == 'true' ? true : false;
    return isDoctor;
  }

  public logout()
  {
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/home']);
  }

}
