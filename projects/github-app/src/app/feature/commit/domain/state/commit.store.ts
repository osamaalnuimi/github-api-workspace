import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, delay, map, of } from 'rxjs';
import { Commit } from '../entities/commit.interface';
import { CommitFilter } from '../entities/commitFilter.interface';
import { CommitService } from '../infrustruacture/commit.service';

interface State {
  data: Commit[] | undefined;
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
   * @param {CommitFilter} filter - The filter to apply when searching for commits.
   * @return {Observable<void>} An observable that emits `undefined` if an error occurs, or completes without emitting otherwise.
   */
  getCommits(filter: CommitFilter): Observable<void> {
    this.vm.set({ data: undefined, httpCallStatus: 'loading', error: null });
    return this.commitService.getCommits(filter).pipe(
      map(commits => {
        const data = commits.map(commit => ({
          author: commit.commit.author.name,
          url: commit.html_url,
          message: commit.commit.message,
        }));
        return this.vm.set({
          data: data,
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

  /**
   * Searches for commits based on the provided filter and updates the state accordingly.
   *
   * @param {CommitFilter} filter - The filter to apply when searching for commits.
   * @return {Observable<void>} An observable that emits `undefined` if an error occurs, or completes without emitting otherwise.
   */
  searchCommits(filter: CommitFilter): Observable<void> {
    this.vm.set({ data: undefined, httpCallStatus: 'loading', error: null });
    return this.commitService.getCommitBySearch(filter).pipe(
      delay(1000),
      map(commits => {
        const data: Commit[] = commits.items.map(item => ({
          author: item.author?.login ?? '',
          url: item.html_url || '',
          message: item.commit.message ?? '',
        }));

        return this.vm.set({
          data: data,
          httpCallStatus: 'success',
          error: null,
        });
      }),
      catchError(error => {
        console.log(error);
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
