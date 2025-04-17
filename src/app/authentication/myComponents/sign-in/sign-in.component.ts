import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MasterApiService } from '../../../ServiceFolder/master-api-service';

@Component({
  selector: 'app-sign-in',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  providers: [MasterApiService],
  standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  signInForm: FormGroup;

  constructor(
    private masterApiService: MasterApiService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.signInForm = this.fb.group({
      userName: ['', [Validators.minLength(3)]],
      password: [''],
    });
  }

  async signIn() {
    // debugger;
    console.log('Sign In method is called: ' + this.signInForm.value);
    if (this.signInForm.invalid) {
      Swal.fire('Please fill all the fields');
      return;
    }

    const signInData = {
      UserName: this.signInForm.value.userName,
      UserPassword: this.signInForm.value.password,
    };

    try {
      const res: any = await this.masterApiService.signIn(signInData);
      if (res) {
        // Store the token in localStorage
        localStorage.setItem('token', res.myToken);

        // Navigate to the Report page
        this.router.navigateByUrl('myComponents/report');
      }
    } catch (error) {
      console.error('Sign-in failed', error);
      Swal.fire('Sign-in failed. Please try again.');
    }
  }
}
