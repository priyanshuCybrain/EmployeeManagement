import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountryPhoneService {
  private apiUrl = 'https://restcountries.com/v3.1/all';

  constructor(private http: HttpClient) {}

  getCountryPhoneByCode(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
