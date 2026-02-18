import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FeatureFlag } from '../../../models/feature-flag.model';

@Component({
  selector: 'app-feature-flag-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feature-flag-table.html',
  styleUrl: './feature-flag-table.css'
})
export class FeatureFlagTableComponent {

  @Input() flags!: FeatureFlag[];
  @Input() page!: number;
  @Input() totalItems!: number;
  @Input() pageSize!: number;

  @Output() toggle = new EventEmitter<FeatureFlag>();
  @Output() pageChange = new EventEmitter<number>();

  mathMin(a: number, b: number) {
    return Math.min(a, b);
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pageNumbers(): (number | string)[] {

    const total = this.totalPages;
    const current = this.page;
    const pages: (number | string)[] = [];

    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');

      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (current < total - 2) pages.push('...');
      if (!pages.includes(total)) pages.push(total);
    }
    return pages;
  }

}

