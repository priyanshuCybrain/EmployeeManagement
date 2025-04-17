import { Injectable, EventEmitter } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ApiService } from './apiservice.service';

@Injectable({ providedIn: 'root' })
export class MasterApiService {
  constructor(private httpclient: ApiService) {}

  private teacherDataSubject = new ReplaySubject<any>(1);
  // the data is coming from the signup component and is being emitted to the master service.
  // it stores the latest data and makes it available to anyone who subscribes.
  emitTeacherData(data: any) {
    this.teacherDataSubject.next(data);
    console.log('Teacher data emitted in master-service:', data);
  }

  getTeacherDataObservable() {
    return this.teacherDataSubject.asObservable();
  }
  // Components or services that need to know when the data changes can subscribe to it using this function.

  // Reset signal for qualification form
  private resetQualificationSubject = new ReplaySubject<void>(1);

  triggerResetQualification() {
    this.resetQualificationSubject.next();
    console.log('Qualification form reset triggered via service.');
  }

  onResetQualification() {
    return this.resetQualificationSubject.asObservable();
  }
  //Components or services that need to know when the reset action occurs can subscribe to it using this function.

  async getAllEmployeeData() {
    return await this.httpclient.GET('/EmpManagement');
  }

  async getAllTeacherData() {
    return await this.httpclient.GET('/Teacher');
  }

  async getAllClassData() {
    return await this.httpclient.GET('/Class');
  }

  async addNewTeacher(userModel: any) {
    console.log('addNewTeacher in master:', userModel);
    return await this.httpclient.POST(
      '/Teacher/insert-teacher-details',
      userModel
    );
  }

  async deleteTeacher(id: number) {
    return await this.httpclient.DELETE(`/Teacher/${id}`);
  }

  updateTeacher(id: number, teacherData: any) {
    return this.httpclient.PUT(`/Teacher/${id}`, teacherData);
  }

  async getAllTeacherDataByParams(data: any) {
    console.log('getAllTeacherDataByParams in master-api:', data);
    return await this.httpclient.POST('/Report/get-by-params/', data);
  }

  async signIn(data: any) {
    return await this.httpclient.POST('/Auth/login', data);
  }

  async addNewType(data: any) {
    console.log('addNewType in master-api:', data);
    return await this.httpclient.POST('/TeacherType', data);
  }

  async getAllTeacherType() {
    return await this.httpclient.GET('/TeacherType');
  }

  async getAllClassMasterData() {
    return await this.httpclient.GET('/TeacherClass');
  }

  async getAllTeacherPunchDetails() {
    return await this.httpclient.GET('/TeacherPunch');
  }

  async PostTeacherPunchDetails(data: any) {
    return await this.httpclient.POST('/TeacherPunch', data);
  }

  async PostTeacherQualification(data: any) {
    console.log('PostTeacherQualification in master-api:');
    return await this.httpclient.POST(
      '/Qualification/insert-qualifications',
      data
    );
  }

  async getAllCountriesData() {
    return await this.httpclient.GET('/Address/countries');
  }

  async getStatesData(countryId: number) {
    return await this.httpclient.GET(`/Address/states/${countryId}`);
  }

  async getCitiesData(stateId: number) {
    return await this.httpclient.GET(`/Address/cities/${stateId}`);
  }

  async getAllQualificationData(teacherId: number) {
    return await this.httpclient.GET(`/Qualification/${teacherId}`);
  }

  teacherDataEmitter = new EventEmitter<any>();
}
