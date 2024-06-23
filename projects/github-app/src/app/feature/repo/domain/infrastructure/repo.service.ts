import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { RepoSearchResponse } from '../entities/repo.interface';
import { repositoryFilter } from '../entities/filter.interface';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class RepoService {
  private readonly API_URL = environment.github.baseUrl;

  private http = inject(HttpClient);

  /**
   * Searches for repositories based on the provided filter.
   *
   * @param {repositoryFilter} filter - The filter to apply to the search.
   * @return {Observable<RepoSearchResponse>} An observable that emits the search response.
   */
  searchRepos(filter: repositoryFilter): Observable<RepoSearchResponse> {
    const query = this.buildQuery(filter);
    const params = new HttpParams().set('q', query);

    return this.http.get<RepoSearchResponse>(
      `${this.API_URL}/search/repositories`,
      { params }
    );
  }

  /**
   * Builds a query string based on the provided repository filter.
   *
   * @param {repositoryFilter} filter - The filter to apply to the query.
   * @return {string} The built query string.
   */
  private buildQuery(filter: repositoryFilter): string {
    let query = filter.query;

    if (filter.type === 'name') {
      query += ` in:name`;
    }

    if (filter.language) {
      query += ` language:${filter.language}`;
    }

    if (filter.stars) {
      query += ` stars:>${filter.stars}`;
    }

    return query;
  }
}
