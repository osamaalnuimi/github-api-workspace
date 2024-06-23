import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, delay, map, of } from 'rxjs';
import { RepoSearchResponse } from '../entities/repo.interface';
import { RepoService } from '../infrastructure/repo.service';
import { repositoryFilter } from '../entities/filter.interface';

interface State {
  data: RepoSearchResponse | undefined;
  httpCallStatus: 'initial' | 'loading' | 'success' | 'error';
  error: string | null;
}

@Injectable()
export class RepoStore {
  private repoService = inject(RepoService);

  vm = signal<State>({
    data: undefined,
    httpCallStatus: 'initial',
    error: null,
  });
  /**
   * A function to search repositories based on filter criteria.
   *
   * @param {Object} filter - An object containing query, language, stars, and type.
   * @return {Observable<void>} An observable with repository search results.
   */
  searchRepos(filter: repositoryFilter): Observable<void> {
    this.vm.set({ data: undefined, httpCallStatus: 'loading', error: null });
    return this.repoService.searchRepos(filter).pipe(
      map(repos =>
        this.vm.set({
          data: repos,
          httpCallStatus: 'success',
          error: null,
        })
      ),
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
