import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeatureFlag } from '../../models/feature-flag.model';
import { FeatureFlagsService } from '../../services/feature-flags.service';
import { ErrorHandlerService } from '../../core/state/error-handler.service';
import { ErrorMessageComponent } from "../../shared/ui/error-message/error-message";
import { FeatureFlagTableComponent } from "./feature-flag-table/feature-flag-table";
import { FeatureFlagFiltersComponent } from "./feature-flag-filters/feature-flag-filters";

interface FeatureFlagsViewModel {
    flags: FeatureFlag[];
    totalItems: number;
    page: number;
    pageSize: number;
    searchTerm: string;
    environment: string;
    status: string;
    environments: string[];
}

@Component({
    selector: 'app-feature-flags-container',
    standalone: true,
    imports: [CommonModule, FormsModule, ErrorMessageComponent, FeatureFlagTableComponent, FeatureFlagFiltersComponent],
    templateUrl: './feature-flags-container.component.html',
    styleUrl: './feature-flags-container.component.css'
})

export class FeatureFlagsContainerComponent implements OnInit {

    readonly vm = computed<FeatureFlagsViewModel>(() => ({
        flags: this.flags(),
        totalItems: this.totalCount(),
        page: this.pageNumber(),
        pageSize: this.pageSize(),
        searchTerm: this.searchTerm(),
        environment: this.selectedEnvironment(),
        status: this.selectedStatus(),
        environments: this.environments
    }));

    private readonly flags = signal<FeatureFlag[]>([]);
    private readonly totalCount = signal<number>(0);

    private readonly searchTerm = signal<string>('');
    private readonly selectedEnvironment = signal<string>('all');
    private readonly selectedStatus = signal<string>('all');
    private readonly pageNumber = signal<number>(1);
    private readonly pageSize = signal<number>(5);

    private readonly environments: string[] = ['development', 'staging', 'production'];

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

    setSearch(term: string) {
        this.searchTerm.set(term);
        this.pageNumber.set(1);
        this.loadFlags();
    }

    setEnvironment(env: string) {
        this.selectedEnvironment.set(env);
        this.pageNumber.set(1);
        this.loadFlags();
    }

    setStatus(status: string) {
        this.selectedStatus.set(status);
        this.pageNumber.set(1);
        this.loadFlags();
    }

    changePage(page: number) {
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
}
