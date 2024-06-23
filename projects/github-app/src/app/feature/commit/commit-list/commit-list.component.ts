import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { debounceTime, switchMap } from 'rxjs';
import { CommitStore } from '../domain/state/commit.store';
import { CommitListEntryComponent } from '../components/commit-list-entry/commit-list-entry.component';

@Component({
  selector: 'github-commit-list',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    CommitListEntryComponent,
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

  vm = this.commitService.vm;

  repo = input.required<string>(); // pass from router
  owner = input.required<string>(); // pass from router

  query = new FormControl();
  ngOnInit(): void {
    this.getCommits({ owner: this.owner(), repo: this.repo() });
    this.listenToFormChanges();
  }
  private listenToFormChanges() {
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
