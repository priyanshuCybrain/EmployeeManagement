/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CountryPhoneService } from './countryPhone.service';

describe('Service: CountryPhone', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CountryPhoneService]
    });
  });

  it('should ...', inject([CountryPhoneService], (service: CountryPhoneService) => {
    expect(service).toBeTruthy();
  }));
});
