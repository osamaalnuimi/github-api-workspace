import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, delay, map, of } from 'rxjs';
import { CommitResponse } from '../entities/commit.interface';
import { CommitService } from '../infrustruacture/commit.service';
import { commitFilter } from '../entities/commitFilter.interface';

interface State {
  data: CommitResponse[] | undefined;
  httpCallStatus: 'initial' | 'loading' | 'success' | 'error';
  error: string | null;
}

@Injectable()
export class CommitStore {
  private commitService = inject(CommitService);

  vm = signal<State>({
    data: undefined,
    httpCallStatus: 'initial',
    error: null,
  });
  /**
   * Searches for commits based on the provided filter and updates the state accordingly.
   *
   * @param {commitFilter} filter - The filter to apply when searching for commits.
   * @return {Observable<void>} An observable that emits `undefined` if an error occurs, or completes without emitting otherwise.
   */
  searchCommits(filter: commitFilter): Observable<void> {
    this.vm.set({ data: undefined, httpCallStatus: 'loading', error: null });
    return this.commitService.getCommits(filter).pipe(
      map(commit => {
        return this.vm.set({
          data: commit,
          httpCallStatus: 'success',
          error: null,
        });
      }),
      catchError(() => {
        this.vm.set({
          data: undefined,
          httpCallStatus: 'error',
          error: 'Something went wrong!',
        });
        return of(undefined);
      })
    );
  }
}
