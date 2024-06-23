import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CommitResponse } from '../entities/github-commit.interface';
import { CommitFilter } from '../entities/commitFilter.interface';
import { environment } from '../../../../../environments/environment';
import { GithubCommitSearch } from '../entities/github-commit-search.interface';

@Injectable()
export class CommitService {
  private API_URL = environment.github.baseUrl;
  private http = inject(HttpClient);

  /**
   * Get commits based on the provided filter.
   *
   * @param {commitFilter} filter - The filter to apply to the commits.
   * @return {Observable<CommitResponse[]>} An observable that emits the commit response.
   */
  getCommits(filter: CommitFilter): Observable<CommitResponse[]> {
    return this.http.get<CommitResponse[]>(
      `${this.API_URL}/repos/${filter.owner}/${filter.repo}/commits`
    );
  }

  /**
   * Retrieves a list of commit responses based on the provided filter.
   *
   * @param {commitFilter} filter - The filter to apply to the commits.
   * @return {Observable<GithubCommitSearch>} An observable that emits the commit response.
   */
  getCommitBySearch(filter: CommitFilter): Observable<GithubCommitSearch> {
    let params = new HttpParams();
    if (filter.message) {
      params = new HttpParams().set(
        'q',
        `${filter.message} repo:${filter.owner}/${filter.repo}`
      );
    }

    return this.http.get<GithubCommitSearch>(`${this.API_URL}/search/commits`, {
      params,
    });
  }
}
