import { Routes } from '@angular/router';
import { CommitStore } from './domain/state/commit.store';
import { CommitService } from './domain/infrustruacture/commit.service';

export default <Routes>[
  {
    path: '',
    providers: [CommitStore, CommitService],
    children: [
      {
        path: '',
        /**
         * Loads the component for the commit list by dynamically importing it
         * and returning a promise that resolves to the CommitListComponent class.
         *
         */
        loadComponent: () =>
          import('./commit-list/commit-list.component').then(
            m => m.CommitListComponent
          ),
      },
    ],
  },
];
