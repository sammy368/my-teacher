import { Routes } from '@angular/router';
import { AdminAccessComponent } from './pages/admin/admin-access/admin-access.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
import { BlankComponent } from './pages/blank/blank.component';
import { CalenderComponent } from './pages/calender/calender.component';
import { BarChartComponent } from './pages/charts/bar-chart/bar-chart.component';
import { LineChartComponent } from './pages/charts/line-chart/line-chart.component';
import { ClassroomPage } from './pages/classroom/classroom.component';
import { FormElementsComponent } from './pages/forms/form-elements/form-elements.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { LandingComponent } from './pages/landing/landing.component';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { BasicTablesComponent } from './pages/tables/basic-tables/basic-tables.component';
import { AlertsComponent } from './pages/ui-elements/alerts/alerts.component';
import { AvatarElementComponent } from './pages/ui-elements/avatar-element/avatar-element.component';
import { BadgesComponent } from './pages/ui-elements/badges/badges.component';
import { ButtonsComponent } from './pages/ui-elements/buttons/buttons.component';
import { ImagesComponent } from './pages/ui-elements/images/images.component';
import { VideosComponent } from './pages/ui-elements/videos/videos.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    pathMatch: 'full',
    title: 'My Teacher | Learn with confidence',
  },
  {
    path: 'dashboard',
    component: AppLayoutComponent,
    // canActivate: [RoleGuard],
    // canActivateChild: [RoleGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent),
        pathMatch: 'full',
        title: 'My Teacher | Dashboard',
        data: { pageKey: 'dashboard' }
      },
      {
        path: 'my-subjects',
        loadComponent: () => import('./pages/my-subjects/my-subjects.component').then(m => m.MySubjectsComponent),
        title: 'My Teacher | My Subjects',
        data: { pageKey: 'my-subjects' }
      },
      { 
        path: 'classroom/:roomName', 
        component: ClassroomPage,
        title: 'My Teacher | Classroom',
        data: { pageKey: 'classroom' } 
      },
      {
        path:'calendar',
        component:CalenderComponent,
        title:'My Teacher | Calendar',
        data: { pageKey: 'calendar' }
      },
      {
        path:'profile',
        component:ProfileComponent,
        title:'My Teacher | Profile',
        data: { pageKey: 'profile' }
      },
      {
        path:'form-elements',
        component:FormElementsComponent,
        title:'My Teacher | Form Elements',
        data: { pageKey: 'form-elements' }
      },
      {
        path:'basic-tables',
        component:BasicTablesComponent,
        title:'My Teacher | Basic Tables',
        data: { pageKey: 'basic-tables' }
      },
      {
        path:'blank',
        component:BlankComponent,
        title:'My Teacher | Blank',
        data: { pageKey: 'blank' }
      },
      // support tickets
      {
        path:'invoice',
        component:InvoicesComponent,
        title:'My Teacher | Invoice',
        data: { pageKey: 'invoice' }
      },
      {
        path:'line-chart',
        component:LineChartComponent,
        title:'My Teacher | Line Chart',
        data: { pageKey: 'line-chart' }
      },
      {
        path:'bar-chart',
        component:BarChartComponent,
        title:'My Teacher | Bar Chart',
        data: { pageKey: 'bar-chart' }
      },
      {
        path:'alerts',
        component:AlertsComponent,
        title:'My Teacher | Alerts',
        data: { pageKey: 'alerts' }
      },
      {
        path:'avatars',
        component:AvatarElementComponent,
        title:'My Teacher | Avatars',
        data: { pageKey: 'avatars' }
      },
      {
        path:'badge',
        component:BadgesComponent,
        title:'My Teacher | Badges',
        data: { pageKey: 'badge' }
      },
      {
        path:'buttons',
        component:ButtonsComponent,
        title:'My Teacher | Buttons',
        data: { pageKey: 'buttons' }
      },
      {
        path:'images',
        component:ImagesComponent,
        title:'My Teacher | Images',
        data: { pageKey: 'images' }
      },
      {
        path:'videos',
        component:VideosComponent,
        title:'My Teacher | Videos',
        data: { pageKey: 'videos' }
      },
      {
        path:'admin-access',
        component: AdminAccessComponent,
        title: 'My Teacher | Admin Role Access',
        data: { roles: ['Admin'] }
      }
    ]
  },
  // auth pages
  {
    path:'signin',
    component:SignInComponent,
    title:'My Teacher | Sign In'
  },
  {
    path:'signup',
    component:SignUpComponent,
    title:'My Teacher | Sign Up'
  },
  // error pages
  {
    path:'**',
    component:NotFoundComponent,
    title:'My Teacher | Not Found'
  },
];
