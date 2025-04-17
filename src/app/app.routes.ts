import { Routes } from '@angular/router';
import { MasterPageComponent } from './authentication/master-page/master-page.component';
import { SignInComponent } from './authentication';

export const appRoutes: Routes = [
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: 'myComponents',
    component: MasterPageComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./authentication/authentication.routes'),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  },
];

// sign-in and myComponents are the two main routes in the application.
// sign-in route will load the SignInComponent and myComponents route will load the MasterPageComponent.
// MasterPageComponent will load the authentication.routes.ts file which contains the routes for the application.
// The authentication.routes.ts file will load the SignUpComponent and ReportComponent.
// The appRoutes array is used to define the routes for the application.
// The routes are defined using the Routes interface from the @angular/router package.
