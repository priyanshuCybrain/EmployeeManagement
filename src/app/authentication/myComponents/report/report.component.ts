import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MasterApiService } from '../../../ServiceFolder/master-api-service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-report',
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
})
export class ReportComponent {
  // teacherType = ['Full Time', 'Part Time', 'Contract', 'Intern'];
  teacherType: any = [];
  teacherReportOutputs = [];
  filteredTeacherReports: any[] = [];
  reportFormInput: FormGroup;
  searchText: string = '';
  classData: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  genderOptions = ['Male', 'Female'];

  constructor(
    private MasterApiService: MasterApiService,
    private fb: FormBuilder
  ) {
    this.getAllTeachers();
    this.getAllTeacherType();
    this.getAllClassMasterData();
  }

  async getAllTeacherType() {
    const res = await this.MasterApiService.getAllTeacherType();
    this.teacherType = res;
    // console.log('getAllTeacherType: ', res);
  }
  // res that will be received from the above method will receive all the data fields like typeId, teacherTypeName etc.,
  // so we will have to specify which field from them we specifically need like type.teacherTypeName or type.typeId

  async getAllTeachers() {
    try {
      const res = await this.MasterApiService.getAllTeacherData();
      // console.log('getAllTeachers: ', res);
      this.teacherReportOutputs = res;
      this.filteredTeacherReports = res;
      // console.log('filteredTeacherReports: ', this.filteredTeacherReports);
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    }
  }

  ngOnInit() {
    this.reportFormInput = this.fb.group({
      reportTeacherName: ['', [Validators.minLength(3)]],
      reportTeacherType: [''],
      gender: [''],
      class: [''],
      ClassName: [''],
      fromDate: [''],
      toDate: [''],
    });
  }

  async onSubmit() {
    try {
      if (this.reportFormInput.invalid) {
        console.log('Form is invalid. Please fill all required fields.');
        // return;
      }

      const reportFormData = {
        TeacherName: this.reportFormInput.get('reportTeacherName')?.value || '',
        TeacherType: this.reportFormInput.get('reportTeacherType')?.value || '',
        Gender: this.reportFormInput.get('gender')?.value || '',
        ClassName: this.reportFormInput.get('ClassName')?.value || '',
        FromDate: this.reportFormInput.get('fromDate')?.value || '',
        ToDate: this.reportFormInput.get('toDate')?.value || '',
      };
      console.log('onSubmit method is called, reportFormData ', reportFormData);

      if (
        reportFormData.TeacherName ||
        reportFormData.TeacherType ||
        reportFormData.Gender ||
        reportFormData.ClassName
        // reportFormData.FromDate ||
        // reportFormData.ToDate
      ) {
        const res = await this.MasterApiService.getAllTeacherDataByParams(
          reportFormData
        );
        // console.log('res: ', res);
        this.teacherReportOutputs = res;
        this.filteredTeacherReports = res;
        console.log('teacherReportOutputs:', this.teacherReportOutputs);
        console.log('filteredTeacherReports:', this.filteredTeacherReports);
      }
    } catch (error) {
      console.error('Error submitting report form:', error);
    }
    // this.ngOnInit();
  }

  searchTeacher(event?: Event) {
    try {
      if (event) event.preventDefault(); // Prevent page refresh
      const searchValue = this.searchText.toLowerCase().trim();

      if (!searchValue) {
        this.filteredTeacherReports = [...this.teacherReportOutputs]; // Reset if search is empty
        return;
      }

      this.filteredTeacherReports = this.teacherReportOutputs.filter(
        (teacher) =>
          (teacher.teacherName?.toLowerCase().includes(searchValue) ?? false) ||
          (teacher.teacherTypeName?.toLowerCase().includes(searchValue) ??
            false) ||
          (teacher.teacherDob?.toLowerCase().includes(searchValue) ?? false)
      );
    } catch (error) {
      console.error('Error searching teacher:', error);
    }
  }

  async getAllClassMasterData() {
    const res = await this.MasterApiService.getAllClassMasterData();
    this.classData = res;
    // console.log('getAllClassMasterData in report.component:', this.classData);
  }

  pprintTable() {
    const printContents = document.getElementById('printTable')?.outerHTML;
    if (printContents) {
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Table</title>
              <style>
                table {
                  width: 100%;
                  border-collapse: collapse;
                }
                table, th, td {
                  border: 1px solid black;
                }
                th, td {
                  padding: 8px;
                  text-align: left;
                }
                th {
                  background-color: #f2f2f2;
                }
              </style>
            </head>
            <body>
              ${printContents}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    } else {
      console.error('Table with id "printTable" not found.');
    }
  }

  // isPrinting: boolean = false;

  printTable() {
    const tableElement = document.getElementById('printTable');
    if (!tableElement) {
      console.error('Table with id "printTable" not found.');
      return;
    }

    const printContents = tableElement.outerHTML;
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Table</title>
            <style>
              table {
                width: 100%;
                border-collapse: collapse;
              }
              table, th, td {
                border: 1px solid black;
              }
              th, td {
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
              }
            </style>
          </head>
          <body>
            ${printContents}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }

  exportTableToExcel(): void {
    // Get the table element
    const tableElement = document.getElementById('printTable');
    if (!tableElement) {
      console.error('Table with id "printTable" not found.');
      return;
    }

    // Convert the table to a worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tableElement);

    // Create a workbook and add the worksheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');

    // Export the workbook to an Excel file
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the Excel file
    const fileName = 'Teacher_Report.xlsx';
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    saveAs(data, fileName);
  }

  selectAllClasses(classDropdown: any): void {
    const allClasses = this.classData.map(
      (classItem: any) => classItem.className
    );
    this.reportFormInput.get('ClassName')?.setValue(allClasses);

    // Close the dropdown after selection
    classDropdown.close();
  }
}
