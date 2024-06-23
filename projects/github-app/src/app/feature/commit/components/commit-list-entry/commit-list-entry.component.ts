import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Commit } from '../../domain/entities/commit.interface';

@Component({
  selector: 'github-commit-list-entry',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './commit-list-entry.component.html',
  styleUrl: './commit-list-entry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommitListEntryComponent {
  commitList = input.required<Commit[]>();
  displayedColumns: string[] = ['author', 'url', 'message'];
}
