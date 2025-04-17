import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-master-page',
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ],
  templateUrl: './master-page.component.html',
  styleUrl: './master-page.component.css',
})
export class MasterPageComponent {
  NavTitle: string = 'Master-Page';

  constructor(private router: Router) {}

  routeToSignInPage: boolean = false;

  updateNavTitle(newTitle: string): void {
    this.NavTitle = newTitle;
  }

  confirm() {
    Swal.fire({
      title: 'Do you want to sign-out?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/sign-in']);
      }
    });
  }
}
