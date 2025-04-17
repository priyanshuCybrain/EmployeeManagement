import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Modal } from 'bootstrap';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormArray,
  FormControl,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { EnrollmentService } from '../../../enrollment.service';
import { MasterApiService } from '../../../ServiceFolder/master-api-service';
import { CommonModule } from '@angular/common';
import { RouterModule, NavigationStart, Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { QualificationComponent } from '../qualification/qualification.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxPaginationModule,
    MatDialogModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  @Input() data: any;
  //allFormData: any = {};

  @Input() allFormData: any;
  @Output() allFormDataChange = new EventEmitter<any>();
  @Output() operationCompleted = new EventEmitter<string>();
  title = 'Employee Management';
  teacherForm: FormGroup;
  teachers: any[] = [];
  Countries: any[] = [];
  States: any[] = [];
  Cities: any[] = [];
  classDatas: any[] = [];
  employees: any[] = [];
  userModel: any = {};
  //teacherType: any[] = [];
  addedType: string = '';
  showInput: boolean = false;
  currentPage = 1;
  itemsPerPage = 5;
  filteredTeachers: any[] = [];
  searchText: string = '';
  classData: any[] = [];
  classDataArr: any[] = [];
  showClasses: boolean = false;
  showPopup: number = -1;
  NavTitle = 'Teachers-Data';
  private routerSubscription!: Subscription;
  qualificationDialogRef: any;
  submittedQualifications: any[] = [];
  expandQual: boolean = false;
  singleQualification: any[] = [];

  teacherType: { teacherType: number; teacherTypeName: string }[] = [];

  enrollmentService: EnrollmentService = inject(EnrollmentService);
  item: any;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private MasterApiService: MasterApiService,
    private router: Router
  ) {}

  @ViewChild('classPopup', { static: false }) classPopup!: ElementRef;
  modalInstance!: Modal;

  ngOnInit() {
    this.teacherForm = this.fb.group({
      teacherType: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      teacherName: ['', [Validators.required, Validators.minLength(3)]],
      teacherDob: ['', Validators.required],
      teacherId: [null],
      address: ['', Validators.required],
      teacherTypeform: [''],
      gender: ['Male'],
      isVeg: false,
      classes: this.fb.array([]),
      selectAll: [false],
      classSelected: this.fb.array([]),
      States: [''],
      Cities: [''],
      // submittedQualifications: [''],
    });

    this.getAllCountries();
    this.getAllTeacherType();
    this.getAllTeachers();
    this.getAllClassMasterData();

    if (this.classPopup) {
      this.modalInstance = new Modal(this.classPopup.nativeElement);
    }

    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.dialog) {
          this.dialog.closeAll();
        }
      }
    });
  }

  updateAllFormData(updatedData: any): void {
    // This pushes data into a ReplaySubject in MasterApiService.
    this.MasterApiService.emitTeacherData(updatedData);
    this.allFormDataChange.emit(updatedData);
    console.log('Updated Data:', updatedData);
  }

  ngAfterViewInit() {
    if (this.classPopup) {
      this.modalInstance = new Modal(this.classPopup.nativeElement);
    }
  }

  reset() {
    this.teacherForm.reset({
      gender: 'Male',
      isVeg: false,
      selectAll: false,
      teacherType: [''],
      country: [''],
      state: [''],
      city: [''],
      teacherName: [''],
      teacherDob: [''],
      address: [''],
      teacherTypeform: [''],
      teacherId: [null],
    });

    this.States = [];
    this.Cities = [];
    this.submittedQualifications = [];

    (this.teacherForm.get('classes') as FormArray).clear();
    (this.teacherForm.get('classSelected') as FormArray).clear();

    this.classData.forEach((classItem) => {
      classItem.Selected = false;
    });

    // localStorage.removeItem('submittedQualifications');
    this.MasterApiService.triggerResetQualification();

    console.log('Form reset successfully!', this.teacherForm.value);
  }

  get classesFormArray(): FormArray {
    return this.teacherForm.get('classes') as FormArray;
  }

  async getAllCountries() {
    const res = await this.MasterApiService.getAllCountriesData();
    this.Countries = res;
  }

  async getAllStates() {
    const selectedCountryId = this.teacherForm.get('country')?.value;
    if (selectedCountryId) {
      const res = await this.MasterApiService.getStatesData(selectedCountryId);
      this.States = res;
      this.Cities = [];
    }
  }

  async getAllCities() {
    const selectedStateId = this.teacherForm.get('state')?.value;
    if (selectedStateId) {
      const res = await this.MasterApiService.getCitiesData(selectedStateId);
      this.Cities = res;
    }
  }

  async getStates(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCountryId = +selectElement.value;
    this.teacherForm.patchValue({ country: selectedCountryId });
    await this.loadStatesByCountryId(selectedCountryId);
  }

  async getCities(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedStateId = +selectElement.value;
    this.teacherForm.patchValue({
      state: selectedStateId,
      city: 0,
    });
    await this.loadCitiesByStateId(selectedStateId);
  }

  async loadStatesByCountryId(countryId: number) {
    const res = await this.MasterApiService.getStatesData(countryId);
    this.States = res;
    this.Cities = [];
  }

  async loadCitiesByStateId(stateId: number) {
    const res = await this.MasterApiService.getCitiesData(stateId);
    this.Cities = res;
  }

  async getAllTeachers() {
    const res = await this.MasterApiService.getAllTeacherData();
    this.teachers = res;
    this.filteredTeachers = res;

    // Extract unique teacher types
    const typeMap = new Map<number, string>();
    res.forEach((t) => {
      if (!typeMap.has(t.teacherType)) {
        typeMap.set(t.teacherType, t.teacherTypeName);
      }
    });

    this.teacherType = Array.from(
      typeMap,
      ([teacherType, teacherTypeName]) => ({
        teacherType,
        teacherTypeName,
      })
    );
    console.log('Teachers :', this.teachers);
  }

  async getAllClassMasterData() {
    const res = await this.MasterApiService.getAllClassMasterData();
    this.classData = res;
  }

  async getAllTeacherType() {
    const res = await this.MasterApiService.getAllTeacherType();
    this.teacherType = res;
  }

  async onEditSubmit() {
    if (this.teacherForm.invalid || this.teacherForm.get('classes')?.invalid)
      return;

    this.classDataArr = this.classData
      .filter((item) => item.Selected)
      .map((item) => ({ classId: item.classId }));

    const teacherData = {
      teacherId: this.teacherForm.value.teacherId || 0,
      teacherName: this.teacherForm.value.teacherName,
      teacherType: this.teacherForm.value.teacherType,
      teacherDOB: this.teacherForm.value.teacherDob?.split('T')[0] || null,
      address: this.teacherForm.value.address,
      isVeg: this.teacherForm.value.isVeg || false,
      gender: this.teacherForm.value.gender,
      teacherClasses: this.classDataArr,
      qualifications: this.submittedQualifications,
      countryId: this.teacherForm.value.country,
      stateId: this.teacherForm.value.state,
      cityId: this.teacherForm.value.city,
    };
    console.log('Teacher Data:', teacherData);

    try {
      debugger;
      let response;
      if (teacherData.teacherId) {
        response = await this.MasterApiService.updateTeacher(
          teacherData.teacherId,
          teacherData
        );
      } else {
        response = await this.MasterApiService.addNewTeacher(teacherData);
        Swal.fire(response.message);
      }

      if (response) {
        this.getAllTeachers();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  // submitTeacherForm() {
  //   const teacherData = this.teacherForm.value;
  //   this.MasterApiService.emitTeacherData(teacherData);
  // }

  async editTeacher(teacher: any) {
    // sends the selected teacher data to the service

    // this.allFormData['qualification'] = teacher;

    this.updateAllFormData(this.allFormData);
    // console.log('All Form Data:', this.allFormData);
    this.operationCompleted.emit();
    // console.log('Qualification Data', this.allFormData);

    const countryId = teacher.homeCountry?.countryId || null;
    const stateId = teacher.homeState?.stateId || null;
    const cityId = teacher.homeCity?.cityId || null;

    this.teacherForm.patchValue({
      teacherId: teacher.teacherId,
      teacherName: teacher.teacherName,
      teacherType: teacher.teacherType,
      teacherDob: this.convertToISOFormat(teacher.teacherDob),
      address: teacher.address,
      isVeg: teacher.isVeg === 'Yes',
      gender: teacher.gender,
      country: countryId,
    });

    if (countryId) {
      await this.loadStatesByCountryId(countryId);
      this.teacherForm.patchValue({ state: stateId });
    }

    if (stateId) {
      await this.loadCitiesByStateId(stateId);
      this.teacherForm.patchValue({ city: cityId });
    }

    // Clear any previous selections in the FormArray
    const classesArray = this.teacherForm.get('classes') as FormArray;
    classesArray.clear();

    // Patch the selected classes
    teacher.classNames?.forEach((className: string) => {
      const matchedClass = this.classData.find(
        (c) => c.className === className
      );
      if (matchedClass) {
        classesArray.push(new FormControl(matchedClass.classId)); // Add the class to FormArray
        matchedClass.Selected = true; // Mark as selected for checkbox
      }
    });

    // Ensure class selection state is updated
    this.teacherForm.markAsDirty();
    this.getQualificationById();
    this.updateAllFormData(teacher);
    // this.sharedService.emitTeacherData(teacherData); // Confirm this is being called

    console.log('Teacher Data in editTeacher:', teacher);
  }

  convertToISOFormat(dateStr: string): string {
    // From "dd-MM-yyyy" to "yyyy-MM-dd"
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  }

  deleteTeacherCreation(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this Teacher data?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await this.MasterApiService.deleteTeacher(id);
          this.getAllTeachers();
        } catch (error) {
          console.error('Error deleting teacher:', error);
        }
      }
    });
  }

  async newType() {
    try {
      const response = await this.MasterApiService.addNewType({
        typeNo: this.teacherForm.value.typeNo || 0,
        teacherTypeName: this.teacherForm.value.teacherTypeform,
      });
      this.showInput = false;
      this.teacherForm.reset();
    } catch (error) {
      console.error('Error adding new type:', error);
    }
    this.getAllTeacherType();
  }

  handleIconClick() {
    if (this.teacherForm.value.teacherTypeform.trim()) {
      this.newType();
    } else {
      console.warn('Please enter a teacher type before submitting.');
    }
  }

  closeDialog(): void {
    this.expandQual = false;
  }

  getQualification(qual: any) {
    this.expandQual = true;
    this.singleQualification = qual.qualifications;
  }

  searchTeacher(event?: Event) {
    if (event) event.preventDefault();

    const searchValue = this.searchText.toLowerCase().trim();

    if (!searchValue) {
      this.filteredTeachers = [...this.teachers];
      return;
    }

    this.filteredTeachers = this.teachers.filter((teacher) => {
      const teacherValues = [
        teacher.teacherName,
        teacher.teacherTypeName,
        teacher.teacherDob,
        teacher.address,
        teacher.gender,
        teacher.isVeg,
        teacher.homeCountry?.countryName,
        teacher.homeState?.stateName,
        teacher.homeCity?.cityName,
        teacher.classNames?.join(', '),
        // turn array into string
      ];

      return teacherValues.some((val) =>
        val?.toString().toLowerCase().includes(searchValue)
      );
    });

    console.log('filteredTeachers', this.filteredTeachers);
  }

  onCheckboxChange(event: Event, classItem: any) {
    const isChecked = (event.target as HTMLInputElement).checked;
    classItem.Selected = isChecked;

    const classesArray = this.teacherForm.get('classes') as FormArray;

    if (isChecked) {
      classesArray.push(new FormControl(classItem.classId)); // Add to FormArray if checked
    } else {
      const index = classesArray.controls.findIndex(
        (control) => control.value === classItem.classId
      );
      if (index !== -1) {
        classesArray.removeAt(index); // Remove from FormArray if unchecked
      }
    }
  }

  selectAllFunc() {
    const selectAllChecked = this.teacherForm.get('selectAll')?.value;
    this.classData.forEach((classItem) => {
      classItem.Selected = selectAllChecked;
    });
  }

  isClassSelected(classId: number): boolean {
    const classSelectedControl = this.teacherForm.get('classSelected');
    if (!classSelectedControl) return false;
    const classArray = classSelectedControl.value || [];
    return classArray.includes(classId);
  }

  formatDateToISO(dateString: string): string {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  }

  async getQualificationById() {
    // debugger;
    try {
      const teacherId = this.teacherForm.value.teacherId;
      this.submittedQualifications =
        await this.MasterApiService.getAllQualificationData(teacherId);
      // this.submittedQualifications = qualifications;
      // return this.submittedQualifications;
    } catch (error) {
      console.error('Error fetching qualifications:', error);
    }
  }

  openOrEditQualification(item?: any): void {
    const isEdit = item;

    const dialogRef = this.dialog.open(QualificationComponent, {
      width: '95vw',
      maxWidth: 'none',
      height: '80vh',
      panelClass: isEdit ? 'english-responsiveness' : 'custom-dialog',
      data: isEdit
        ? { item: item.qualifications } // edit mode
        : this.submittedQualifications?.length
        ? this.submittedQualifications // add with existing cached data
        : null, // add from scratch
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.submittedQualifications = result;
        // localStorage.setItem('submittedQualifications', JSON.stringify(result));
      }
    });
  }
}
// changes made from the git
