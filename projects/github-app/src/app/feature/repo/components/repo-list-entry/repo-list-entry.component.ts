import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Repo } from '../../domain/entities/repo.interface';

@Component({
  selector: 'github-repo-list-entry',
  standalone: true,
  imports: [MatTableModule, DatePipe, RouterLink],
  templateUrl: './repo-list-entry.component.html',
  styleUrl: './repo-list-entry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepoListEntryComponent {
  repoList = input.required<Repo[] | undefined>();
  displayedColumns: string[] = ['name', 'owner', 'created_at'];
}
