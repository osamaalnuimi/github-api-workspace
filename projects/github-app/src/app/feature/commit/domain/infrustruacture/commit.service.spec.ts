import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../../environments/environment';
import { CommitResponse } from '../entities/github-commit.interface';
import { CommitFilter } from '../entities/commitFilter.interface';
import { CommitService } from './commit.service';

describe('CommitService', () => {
  let service: CommitService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [CommitService, provideHttpClientTesting()],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(CommitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the API to get commits', async () => {
    const filter: CommitFilter = {
      owner: 'owner',
      repo: 'repo',
      message: 'message',
    };

    const mockCommitResponse: CommitResponse[] = [
      {
        sha: 'abc123',
        node_id: 'node123',
        commit: {
          author: {
            name: 'Author Name',
            email: 'author@example.com',
            date: '2023-01-01T00:00:00Z',
          },
          committer: {
            name: 'Committer Name',
            email: 'committer@example.com',
            date: '2023-01-01T00:00:00Z',
          },
          message: 'Initial commit',
          tree: {
            sha: 'tree123',
            url: 'https://api.github.com/repos/owner/repo/git/trees/tree123',
          },
          url: 'https://api.github.com/repos/owner/repo/git/commits/abc123',
          comment_count: 0,
          verification: {
            verified: false,
            reason: 'unsigned',
            signature: '',
            payload: '',
          },
        },
        url: 'https://api.github.com/repos/owner/repo/commits/abc123',
        html_url: 'https://github.com/owner/repo/commit/abc123',
        comments_url:
          'https://api.github.com/repos/owner/repo/commits/abc123/comments',
        author: {
          login: 'author',
          id: 1,
          avatar_url: 'https://github.com/images/error/author.png',
          url: 'https://api.github.com/users/author',
          html_url: 'https://github.com/author',
          type: 'User',
          site_admin: false,
          events_url: 'https://api.github.com/users/author/events{/privacy}',
          followers_url: 'https://api.github.com/users/author/followers',
          following_url:
            'https://api.github.com/users/author/following{/other_user}',
          gists_url: 'https://api.github.com/users/author/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/author/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/author/subscriptions',
          organizations_url: 'https://api.github.com/users/author/orgs',
          repos_url: 'https://api.github.com/users/author/repos',
          received_events_url:
            'https://api.github.com/users/author/received_events',
          gravatar_id: '',
          node_id: 'MDQ6VXNlcjE=',
        },
        committer: {
          login: 'committer',
          id: 2,
          avatar_url: 'https://github.com/images/error/committer.png',
          url: 'https://api.github.com/users/committer',
          events_url: 'https://api.github.com/users/committer/events{/privacy}',
          html_url: 'https://github.com/committer',
          followers_url: 'https://api.github.com/users/committer/followers',
          following_url:
            'https://api.github.com/users/committer/following{/other_user}',
          gists_url: 'https://api.github.com/users/committer/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/committer/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/committer/subscriptions',
          organizations_url: 'https://api.github.com/users/committer/orgs',
          repos_url: 'https://api.github.com/users/committer/repos',
          received_events_url:
            'https://api.github.com/users/committer/received_events',
          type: 'User',
          site_admin: false,
          gravatar_id: '',
          node_id: 'MDQ6VXNlcjI=',
        },
        parents: [
          {
            sha: 'parent123',
            url: 'https://api.github.com/repos/owner/repo/commits/parent123',
            html_url: 'https://github.com/owner/repo/commit/parent123',
          },
        ],
      },
    ];

    service.getCommits(filter).subscribe(response => {
      expect(response).toEqual(mockCommitResponse);
    });

    const req = httpMock.expectOne(
      `${environment.github.baseUrl}/repos/${filter.owner}/${filter.repo}/commits`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('q')).toBe(
      `${filter.message}+repo:${filter.owner}/${filter.repo}`
    );
    expect(req.request.headers.get('Accept')).toBe(
      'application/vnd.github.cloak-preview'
    );
    req.flush(mockCommitResponse);
  });
});
