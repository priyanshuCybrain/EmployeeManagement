import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { MasterApiService } from '../../../ServiceFolder/master-api-service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ElementRef, inject, ViewChild } from '@angular/core';
import { Modal } from 'bootstrap'; // Assuming Modal is from bootstrap
import { FormArray } from '@angular/forms';
import { EnrollmentService } from '../../../enrollment.service';
import { FormsModule } from '@angular/forms';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Third-party Timepicker
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-PunchDetails',
  templateUrl: './PunchDetails.component.html',
  styleUrls: ['./PunchDetails.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    NgxMaterialTimepickerModule,
    MatTimepickerModule,
    RouterModule,
    NgxPaginationModule,
    FormsModule,
  ],
  providers: [provideNativeDateAdapter()],
})
export class PunchDetailsComponent implements OnInit {
  formControl: FormControl<Date | null>;
  PunchDetailsForm: FormGroup;
  allTeachers: any[] = [];
  TeacherPunchDetails: any[] = [];
  currentPage = 1;
  itemsPerPage = 3;
  NavTitle = 'Punch Details Page';
  searchText: string = '';
  teachers: any[] = [];

  constructor(
    private MasterApiService: MasterApiService,
    private fb: FormBuilder
  ) {
    const initialValue = new Date();
    initialValue.setHours(12, 30, 0);
    this.formControl = new FormControl(initialValue);
  }

  ngOnInit() {
    this.PunchDetailsForm = this.fb.group({
      teacherName: ['', [Validators.required, Validators.minLength(3)]],
      inTime: ['', [Validators.required]],
      outTime: ['', [Validators.required]],
      date: ['', [Validators.required]],
    });
    this.getAllTeachers();
    this.getTeachersPunchData();
  }

  async getAllTeachers() {
    const res = await this.MasterApiService.getAllTeacherData();
    this.allTeachers = res;
    console.log('allTeachers response:', res);
  }

  async getTeachersPunchData() {
    const res = await this.MasterApiService.getAllTeacherPunchDetails();
    this.TeacherPunchDetails = res;
    this.teachers = res;
    console.log('teachers:', this.teachers);
    console.log('TeacherPunchDetails response:', res);
  }

  async onSubmit() {
    this.PunchDetailsForm.markAllAsTouched();

    if (this.PunchDetailsForm.invalid) {
      console.log('Form is invalid. Please fill all required fields.');
      return;
    }

    try {
      const punchDetailsData = {
        teacherId: this.PunchDetailsForm.get('teacherName')?.value || '',
        inTime: this.PunchDetailsForm.get('inTime')?.value
          ? new Date(this.PunchDetailsForm.get('inTime')?.value).toISOString()
          : '',
        outTime: this.PunchDetailsForm.get('outTime')?.value
          ? new Date(this.PunchDetailsForm.get('outTime')?.value).toISOString()
          : '',
        date: this.PunchDetailsForm.get('date')?.value || '',
      };

      console.log('Submitting punch details:', punchDetailsData);

      if (
        punchDetailsData.teacherId &&
        punchDetailsData.inTime &&
        punchDetailsData.outTime &&
        punchDetailsData.date
      ) {
        const res = await this.MasterApiService.PostTeacherPunchDetails(
          punchDetailsData
        );
        this.getTeachersPunchData();
      } else {
        console.log('Error', 'Please fill all required fields!', 'error');
      }
    } catch (error) {
      console.error('Error submitting punch details:', error);
      Swal.fire('Error', 'Failed to submit punch details!', 'error');
    }
    this.getAllTeachers();
    this.getTeachersPunchData();
    this.PunchDetailsForm.reset();
  }

  // Helper method to format time to "hh:mm AM/PM"
  formatTime(time: any): string {
    // Check if the time is a Date object or a string
    if (time instanceof Date) {
      let hours = time.getHours();
      const minutes = time.getMinutes().toString().padStart(2, '0');
      const period = hours >= 12 ? 'PM' : 'AM';

      // Convert to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12; // 12:00 AM/PM instead of 0:00
      return `${hours}:${minutes} ${period}`;
    } else if (typeof time === 'string') {
      // If it's already a string (e.g., from an input field), assume it's in "HH:MM" format
      const [hours, minutes] = time.split(':');
      let hourNum = parseInt(hours, 10);
      const period = hourNum >= 12 ? 'PM' : 'AM';

      // Convert to 12-hour format
      hourNum = hourNum % 12;
      hourNum = hourNum ? hourNum : 12; // 12:00 AM/PM instead of 0:00
      return `${hourNum}:${minutes} ${period}`;
    } else {
      return ''; // Return an empty string if the time is not a valid type
    }
  }

  searchTeacher(event?: Event) {
    try {
      if (event) event.preventDefault(); // Prevent page refresh
      const searchValue = this.searchText.toLowerCase().trim();

      if (!searchValue) {
        this.TeacherPunchDetails = [...this.teachers]; // Reset if search is empty
        return;
      }

      this.TeacherPunchDetails = this.teachers.filter(
        (teacher) =>
          (teacher.teacherName?.toLowerCase().includes(searchValue) ?? false) ||
          (teacher.date?.toLowerCase().includes(searchValue) ?? false) ||
          (teacher.inTime?.toLowerCase().includes(searchValue) ?? false) ||
          (teacher.outTime?.toLowerCase().includes(searchValue) ?? false)
      );
      console.log(this.TeacherPunchDetails);
    } catch (error) {
      console.error('Error searching teacher:', error);
    }
  }
}
