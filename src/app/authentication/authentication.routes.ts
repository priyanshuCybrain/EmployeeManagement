import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./myComponents/sign-up/sign-up.component').then(
        (c) => c.SignUpComponent
      ),
  },
  {
    path: 'report',
    loadComponent: () =>
      import('./myComponents/report/report.component').then(
        (c) => c.ReportComponent
      ),
  },
  {
    path: 'PunchDetails',
    loadComponent: () =>
      import('./myComponents/PunchDetails/PunchDetails.component').then(
        (c) => c.PunchDetailsComponent
      ),
  },
  {
    path: 'qualification',
    loadComponent: () =>
      import('./myComponents/qualification/qualification.component').then(
        (c) => c.QualificationComponent
      ),
  },
];

export default routes;
