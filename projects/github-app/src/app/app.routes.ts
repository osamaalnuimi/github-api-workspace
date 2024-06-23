import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'repos',
  },
  {
    path: 'repos',
    loadChildren: () => import('./feature/repo/repo.routes'),
  },
  {
    path: 'commits/:owner/:repo',
    loadChildren: () => import('./feature/commit/commit.routes'),
  },
  {
    path: '**',
    redirectTo: 'repos',
  },
];
