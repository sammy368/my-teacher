import { Routes } from '@angular/router';
import { EcommerceComponent } from './pages/dashboard/ecommerce/ecommerce.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FormElementsComponent } from './pages/forms/form-elements/form-elements.component';
import { BasicTablesComponent } from './pages/tables/basic-tables/basic-tables.component';
import { BlankComponent } from './pages/blank/blank.component';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { LineChartComponent } from './pages/charts/line-chart/line-chart.component';
import { BarChartComponent } from './pages/charts/bar-chart/bar-chart.component';
import { AlertsComponent } from './pages/ui-elements/alerts/alerts.component';
import { AvatarElementComponent } from './pages/ui-elements/avatar-element/avatar-element.component';
import { BadgesComponent } from './pages/ui-elements/badges/badges.component';
import { ButtonsComponent } from './pages/ui-elements/buttons/buttons.component';
import { ImagesComponent } from './pages/ui-elements/images/images.component';
import { VideosComponent } from './pages/ui-elements/videos/videos.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
import { CalenderComponent } from './pages/calender/calender.component';
import { LandingComponent } from './pages/landing/landing.component';

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
    children: [
      {
        path: '',
        component: EcommerceComponent,
        pathMatch: 'full',
        title: 'My Teacher | Dashboard',
      },
      {
        path:'calendar',
        component:CalenderComponent,
        title:'My Teacher | Calendar'
      },
      {
        path:'profile',
        component:ProfileComponent,
        title:'My Teacher | Profile'
      },
      {
        path:'form-elements',
        component:FormElementsComponent,
        title:'My Teacher | Form Elements'
      },
      {
        path:'basic-tables',
        component:BasicTablesComponent,
        title:'My Teacher | Basic Tables'
      },
      {
        path:'blank',
        component:BlankComponent,
        title:'My Teacher | Blank'
      },
      // support tickets
      {
        path:'invoice',
        component:InvoicesComponent,
        title:'My Teacher | Invoice'
      },
      {
        path:'line-chart',
        component:LineChartComponent,
        title:'My Teacher | Line Chart'
      },
      {
        path:'bar-chart',
        component:BarChartComponent,
        title:'My Teacher | Bar Chart'
      },
      {
        path:'alerts',
        component:AlertsComponent,
        title:'My Teacher | Alerts'
      },
      {
        path:'avatars',
        component:AvatarElementComponent,
        title:'My Teacher | Avatars'
      },
      {
        path:'badge',
        component:BadgesComponent,
        title:'My Teacher | Badges'
      },
      {
        path:'buttons',
        component:ButtonsComponent,
        title:'My Teacher | Buttons'
      },
      {
        path:'images',
        component:ImagesComponent,
        title:'My Teacher | Images'
      },
      {
        path:'videos',
        component:VideosComponent,
        title:'My Teacher | Videos'
      },
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
