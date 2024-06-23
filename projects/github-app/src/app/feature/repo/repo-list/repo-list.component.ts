import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { debounceTime, filter, switchMap } from 'rxjs';
import { RepoListEntryComponent } from '../components/repo-list-entry/repo-list-entry.component';
import { RepoStore } from '../domain/state/repo.store';

@Component({
  selector: 'github-repo-list',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    RouterLink,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    RepoListEntryComponent,
  ],
  templateUrl: './repo-list.component.html',
  styleUrl: './repo-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepoListComponent implements OnInit {
  private readonly repoDataService = inject(RepoStore);
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);

  vm = this.repoDataService.vm;

  repoForm: FormGroup = this.fb.nonNullable.group({
    filterType: ['name', Validators.required],
    query: ['', Validators.required],
    language: ['', [Validators.minLength(2), Validators.maxLength(10)]],
    stars: [undefined, [Validators.min(0)]],
  });

  ngOnInit() {
    this.listenToFormChanges();
  }
  /**
   * Listens to changes in the repository form and triggers a search for repositories
   * when the form value changes. The search is debounced for 300 milliseconds.
   * query is required and language and stars are optional.
   *
   * @private
   * @return {void}
   */
  private listenToFormChanges(): void {
    this.repoForm.valueChanges
      .pipe(
        filter(({ query }) => !!query), // if query is not empty we can search
        debounceTime(300),
        switchMap(({ query, language, stars, filterType }) => {
          return this.repoDataService.searchRepos({
            query,
            language,
            stars,
            type: filterType,
          });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /**
   * Updates the form controls based on the provided queryBy.
   *
   * @param {string} queryBy - The queryBy used to determine which form controls to add or remove.
   * @return {void} This function does not return anything.
   */
  searchBy(queryBy: string): void {
    if (queryBy === 'text') {
      this.repoForm.removeControl('language');
      this.repoForm.removeControl('stars');
    } else if (queryBy === 'name') {
      this.repoForm.addControl(
        'stars',
        new FormControl('', [Validators.min(0)])
      );
      this.repoForm.addControl(
        'language',
        this.fb.control('', [Validators.minLength(2), Validators.maxLength(10)])
      );
    }
  }
}
