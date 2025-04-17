import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Options {
  withFormData: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  queryParams: any = {};

  constructor(private httpClient: HttpClient) {}

  /**
   * Perform a GET request to the API.
   */
  async GET(endpoint: string, params: any = {}): Promise<any> {
    // debugger;
    return new Promise(async (resolve, reject) => {
      try {
        const token = localStorage.getItem('token'); // 🔑 Get token from local storage
        const headers = token
          ? {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          : { 'Content-Type': 'application/json' };

        const httpParams = this.buildQueryParams(params);

        const result = this.httpClient
          .get(ApiService.getApiUrl() + endpoint, {
            headers,
            params: httpParams,
          })
          .pipe();

        result.subscribe(
          (response: any) => resolve(response),
          (error) => reject(error)
        );
      } catch (e) {
        console.log('Caught exception in GET request: ', e);
        reject(null);
      }
    });
  }

  /**
   * Perform a POST request to the server.
   */

  // we are first sending the username and passord to the server and then we are getting the token from the server and storing it in local storage.
  // then we are using that token in the header of the request to authenticate the user and get the data from the server.
  // the token is used to identify the user and give them access to the data they are allowed to see.
  // the token is sent in the header of the request as a bearer token.
  // then we are getting the data from the server and returning it to the component.
  // the component is then using that data to display it on the screen.
  // then we are getting the data through the GET method in the api service

  async POST(
    endpoint: string,
    data: any | FormData = null,
    options: Options = { withFormData: false }
  ): Promise<any> {
    console.log('data in POST method in apiservice!', data);
    // debugger;
    return new Promise(async (resolve, reject) => {
      try {
        const token = localStorage.getItem('token'); // 🔑 Get token from local storage
        const headers = token
          ? {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          : { 'Content-Type': 'application/json' };

        const result = this.httpClient
          .post(ApiService.getApiUrl() + endpoint, data, { headers })
          .pipe();

        result.subscribe(
          (response: any) => resolve(response),
          (error) => reject(error)
        );
      } catch (e) {
        console.log('Caught exception in POST request:', e);
        reject(null);
      }
    });
  }

  /**
   * Perform a PUT request to the server.
   */
  async PUT(
    endpoint: string,
    data: any | FormData = null,
    options: Options = { withFormData: false }
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const token = localStorage.getItem('token'); // 🔑 Get token from local storage
        const headers = token
          ? {
              Authorization: `Bearer ${token}`,
              'Content-Type': options.withFormData
                ? undefined
                : 'application/json',
            }
          : {
              'Content-Type': options.withFormData
                ? undefined
                : 'application/json',
            };

        const result = this.httpClient
          .put(ApiService.getApiUrl() + endpoint, data, { headers })
          .pipe();

        result.subscribe(
          (response: any) => resolve(response),
          (error) => reject(error)
        );
      } catch (e) {
        console.log('Caught exception in PUT request: ', e);
        reject(null);
      }
    });
  }

  /**
   * Perform a DELETE request to the server.
   */
  async DELETE(endpoint: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const token = localStorage.getItem('token'); // 🔑 Get token from local storage
        const headers = token
          ? {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          : { 'Content-Type': 'application/json' };

        const result = this.httpClient
          .delete(ApiService.getApiUrl() + endpoint, { headers })
          .pipe();

        result.subscribe(
          (response: any) => resolve(response),
          (error) => reject(error)
        );
      } catch (e) {
        console.log('Caught exception in DELETE request: ', e);
        reject(null);
      }
    });
  }

  /**
   * Perform a BLOB request to the server.
   */
  async BLOB(url: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const token = localStorage.getItem('token'); // 🔑 Get token from local storage
        const headers = token
          ? {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          : { 'Content-Type': 'application/json' };

        const result = this.httpClient
          .get(url, { headers, responseType: 'blob' })
          .pipe();

        result.subscribe(
          (response: any) => resolve(response),
          (error) => reject(error)
        );
      } catch (e) {
        console.log('Caught exception in BLOB request: ', e);
        reject(null);
      }
    });
  }

  /**
   * Build query parameters for the request.
   */
  private buildQueryParams(params: any = {}): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      httpParams = httpParams.append(key, params[key]);
    });
    return httpParams;
  }

  /**
   * Get the API URL to use through different environment strategies.
   */
  private static getApiUrl(): string {
    return environment.apiUrl + '/api';
  }
}
