import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeatureFlag } from '../../models/feature-flag.model';
import { FeatureFlagsService } from '../../services/feature-flags.service';
import { ErrorHandlerService } from '../../core/state/error-handler.service';
import { ErrorMessageComponent } from "../../shared/ui/error-message/error-message";

@Component({
    selector: 'app-feature-flags',
    standalone: true,
    imports: [CommonModule, FormsModule, ErrorMessageComponent],
    templateUrl: './feature-flags.component.html',
    styleUrls: ['./feature-flags.component.css']
})
export class FeatureFlagsComponent implements OnInit {
    flags = signal<FeatureFlag[]>([]);
    totalCount = signal<number>(0);

    searchTerm = signal<string>('');
    selectedEnvironment = signal<string>('all');
    selectedStatus = signal<string>('all');
    pageNumber = signal<number>(1);
    pageSize = signal<number>(5);

    environments: string[] = ['development', 'staging', 'production'];

    constructor(
        private featureFlagsService: FeatureFlagsService,
        private errorHandlerService: ErrorHandlerService
    ) { }

    ngOnInit(): void {
        this.loadFlags();
    }

    loadFlags(): void {
        const env = this.selectedEnvironment() === 'all' ? undefined : this.selectedEnvironment();
        const status = this.selectedStatus() === 'all' ? undefined : this.selectedStatus() === 'enabled';
        const name = this.searchTerm() || undefined;

        this.featureFlagsService.getFeatureFlags(
            env,
            status,
            name,
            this.pageNumber(),
            this.pageSize()
        ).subscribe({
            next: (result) => {
                this.flags.set(result.Items);
                this.totalCount.set(result.TotalCount);
            },
            error: (error) => {
                console.error('Error loading flags:', error);
            }
        });
    }

    paginatedFlags = computed(() => this.flags());
    totalItems = computed(() => this.totalCount());
    totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

    onSearchChange(): void {
        this.pageNumber.set(1);
        this.loadFlags();
    }

    onEnvironmentChange(env: string): void {
        this.selectedEnvironment.set(env);
        this.pageNumber.set(1);
        this.loadFlags();
    }

    onStatusChange(status: string): void {
        this.selectedStatus.set(status);
        this.pageNumber.set(1);
        this.loadFlags();
    }

    onPageChange(page: number): void {
        if (page < 1 || page > this.totalPages()) return;
        this.pageNumber.set(page);
        this.loadFlags();
    }

    toggleStatus(flag: FeatureFlag): void {

        const previousStatus = flag.status;
        this.featureFlagsService.toggleFeatureFlagStatus(flag.id).subscribe({
            next: (updatedFlag) => {
                this.flags.update(flags =>
                    flags.map(f =>
                        f.id === updatedFlag.id
                            ? updatedFlag
                            : f
                    )
                );
            },

            error: () => {
                //UI rollback
                this.flags.update(flags =>
                    flags.map(f =>
                        f.id === flag.id
                            ? { ...f, status: previousStatus }
                            : f
                    )
                );

                this.errorHandlerService.showError(
                    'Failed to toggle feature flag. Change reverted.'
                );
            }
        });
    }

    mathMin(a: number, b: number): number {
        return Math.min(a, b);
    }

    get pageNumbers(): (number | string)[] {
        const total = this.totalPages();
        const current = this.pageNumber();
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
