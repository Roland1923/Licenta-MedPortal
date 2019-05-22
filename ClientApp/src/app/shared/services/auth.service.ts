import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';
import { Observable, of } from 'rxjs';
import { AuthBearer } from '../models/auth.interface';
import { debounceTime } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = '';
  private tokeyKey = "token";

  constructor(private http: HttpClient, private configService: ConfigService, private router: Router) { 
    this.baseUrl = configService.getApiURI();
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
