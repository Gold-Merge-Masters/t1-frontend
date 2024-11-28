import { Routes } from '@angular/router';
import { Download } from './pages/download/download.component';
import { Compare } from './pages/compare/compare.component';
import { Gold } from './pages/gold/gold.component';
import { Preparing } from './pages/preparing/preparing.component';

export const routes: Routes = [
  {
    path: 'upload',
    component: Download,
  },
  {
    path: 'compare',
    component: Compare,
  },
  {
    path: 'preparing',
    component: Preparing,
  },
  {
    path: 'gold',
    component: Gold,
  },
  {
    path: '',
    redirectTo: '/upload',
    pathMatch: 'full',
  },
];
