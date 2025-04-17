import {
  Component,
  Inject,
  OnInit,
  ViewChild as Angular,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MasterApiService } from '../../../ServiceFolder/master-api-service';
import { SignUpComponent } from '../sign-up/sign-up.component';

@Component({
  selector: 'app-qualification',
  templateUrl: './qualification.component.html',
  styleUrls: ['./qualification.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class QualificationComponent implements OnInit {
  qualificationForm!: FormGroup;
  qualificationData: any[] = []; // In-memory variable to store qualifications
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<QualificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Used to receive data passed into the dialog when it’s opened.
    @Inject(MasterApiService) private sharedService: MasterApiService
  ) {}

  @Input() allFormData: any;
  @Output() allFormDataChange = new EventEmitter<any>();
  @Output() operationCompleted = new EventEmitter<string>();

  ngOnInit() {
    this.qualificationForm = this.fb.group({
      qualifications: this.fb.array([]),
    });

    // Get teacher data via ReplaySubject
    this.sharedService.getTeacherDataObservable().subscribe((data) => {
      if (data?.qualifications?.length) {
        this.onEditMode(data);
        console.log('Received teacher data in child:', data);
      }
    });

    // Handle MAT_DIALOG_DATA
    if (this.data && Array.isArray(this.data)) {
      this.onEditMode({ qualifications: this.data });
    } // This pre-populates the form if the user had already added qualification data earlier.

    // Load from in-memory variable if available
    if (this.qualificationData.length && this.qualifications.length === 0) {
      this.qualificationData.forEach((q: any) => {
        this.qualifications.push(this.createQualificationGroup(q));
      });
    } else if (this.qualifications.length === 0) {
      this.addNew(); // Default row
    }

    // Subscribe to reset event
    this.sharedService.onResetQualification().subscribe(() => {
      this.resetQualificationForm();
    });
  }

  async onEditMode(data: any) {
    this.isEditMode = true;
    this.qualifications.clear();

    if (data && Array.isArray(data.qualifications)) {
      await Promise.all(
        data.qualifications.map(async (qual: any) => {
          const qualificationGroup = this.createQualificationGroup({
            qualification: qual.qualification,
            year: qual.year,
            maxmarks: qual.maxmarks || qual.maxMarks,
            obtmarks: qual.obtmarks || qual.obtMarks,
            percentage: qual.percentage,
          });
          this.qualifications.push(qualificationGroup);
        })
      );
    }
  }

  get qualifications(): FormArray {
    return this.qualificationForm.get('qualifications') as FormArray;
  }

  createQualificationGroup(data: any = {}): FormGroup {
    const group = this.fb.group({
      qualification: [data.qualification || '', Validators.required],
      year: [data.year || '', Validators.required],
      maxmarks: [data.maxmarks || '', [Validators.required, Validators.min(0)]],
      obtmarks: [data.obtmarks || '', [Validators.required, Validators.min(0)]],
      percentage: [
        { value: data.percentage || '', disabled: true },
        Validators.required,
      ],
    });

    group
      .get('maxmarks')
      ?.valueChanges.subscribe(() => this.updatePercentage(group));
    group
      .get('obtmarks')
      ?.valueChanges.subscribe(() => this.updatePercentage(group));

    return group;
  }

  updatePercentage(group: FormGroup): void {
    const max = parseFloat(group.get('maxmarks')?.value);
    const obt = parseFloat(group.get('obtmarks')?.value);

    if (!isNaN(max) && !isNaN(obt) && max > 0) {
      if (obt > max) {
        group.get('obtmarks')?.setErrors({ max: true });
        group.get('percentage')?.setValue('');
      } else {
        const percent = ((obt / max) * 100).toFixed(2);
        group.get('percentage')?.setValue(percent);
      }
    } else {
      group.get('percentage')?.setValue('');
    }
  }

  addNew(): void {
    this.qualifications.push(this.createQualificationGroup());
  }

  deleteCurrent(index: number): void {
    this.qualifications.removeAt(index);
    this.saveToMemory();
  }

  saveQualification(): void {
    if (this.qualificationForm.invalid) {
      this.qualificationForm.markAllAsTouched();
      return;
    } // part of the final submission and dialog closure.

    const submittedData = this.qualifications.getRawValue();
    this.qualificationData = submittedData; // <-- Save to memory
    this.dialogRef.close(submittedData);
    // submitting the complete form data (submittedData) to the parent component.
    // qualificationData is storing the data to be shown if dialog is opened again.
  }

  saveToMemory(): void {
    this.qualificationData = this.qualifications.getRawValue(); // <-- Save to memory
  } // This is called when the user adds or deletes a qualification.

  closeModal(): void {
    this.dialogRef.close();
  }

  resetQualificationForm(): void {
    this.qualifications.clear(); // clear all existing rows
    this.addNew(); // add default empty row
    this.qualificationData = []; // clear in-memory data
    console.log('Qualification form reset from shared service');
  }
}
