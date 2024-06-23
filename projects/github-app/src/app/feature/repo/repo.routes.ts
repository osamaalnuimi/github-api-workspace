import { Routes } from '@angular/router';

import { RepoService } from './domain/infrastructure/repo.service';
import { RepoStore } from './domain/state/repo.store';
export default <Routes>[
  {
    path: '',
    providers: [RepoStore, RepoService],
    children: [
      {
        path: '',
        /**
         * Loads the component for the repo list by dynamically importing the
         * 'repo-list/repo-list.component' module and returning a promise that resolves
         * to the RepoListComponent class.
         *
         * RepoListComponent class.
         */
        loadComponent: () =>
          import('./repo-list/repo-list.component').then(
            m => m.RepoListComponent
          ),
      },
    ],
  },
];
