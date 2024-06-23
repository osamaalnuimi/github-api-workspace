import { DatePipe, JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  input,
} from '@angular/core';
import { CommitStore } from '../domain/state/commit.store';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'github-commit-list',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinner,
  ],
  templateUrl: './commit-list.component.html',
  styleUrl: './commit-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommitListComponent implements OnInit {
  private readonly commitService = inject(CommitStore);

  private destroyRef = inject(DestroyRef);
  displayedColumns: string[] = ['author', 'url', 'message'];

  vm = this.commitService.vm;

  repo = input.required<string>();
  owner = input.required<string>();

  query = new FormControl();
  ngOnInit(): void {
    this.getCommits({ owner: this.owner(), repo: this.repo() });

    this.query.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(query => {
          if (!query) {
            return this.commitService.getCommits({
              owner: this.owner(),
              repo: this.repo(),
            });
          }
          return this.commitService.searchCommits({
            owner: this.owner(),
            repo: this.repo(),
            message: query,
          });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
  getCommits(query: { owner: string; repo: string; message?: string }) {
    this.commitService.getCommits(query).subscribe();
  }
}
