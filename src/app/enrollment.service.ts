import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from './emp-class';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  private http = inject(HttpClient);
  private baseUrl = 'https://localhost:7265/api/';

  constructor() {}
}

// getAllEmployees(): Observable<User[]> {
//   // debugger
//   return this.http.get<User[]>(`${this.baseUrl}`)
//     .pipe(catchError(this.errorHandler));
// }

// getEmployeeById(id: number): Observable<User> {
//   // debugger
//   return this.http.get<User>(`${this.baseUrl}/${id}`)
//     .pipe(catchError(this.errorHandler));
// }

// addEmployee(user: User): Observable<any> {
//   return this.http.post<any>(`${this.baseUrl}`, user)
//     .pipe(catchError(this.errorHandler));
// }

// updateEmployee(id: number, user: User): Observable<any> {
//   return this.http.put<any>(`${this.baseUrl}/${id}`, user)
//     .pipe(catchError(this.errorHandler));
// }

// private errorHandler(error: HttpErrorResponse) {
//   console.error('Error occurred:', error);
//   return throwError(() => new Error(error.message));
// }
// }
