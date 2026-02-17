import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeatureFlag, Environment } from '../../models/feature-flag.model';

@Component({
    selector: 'app-feature-flags',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './feature-flags.component.html',
    styleUrls: ['./feature-flags.component.css']
})
export class FeatureFlagsComponent implements OnInit {
    // Original data - Will be fetched from service later
    allFeatureFlags = signal<FeatureFlag[]>([]);

    // State signals
    searchTerm = signal<string>('');
    selectedEnvironment = signal<string>('all');
    selectedStatus = signal<string>('all');
    pageNumber = signal<number>(1);
    pageSize = signal<number>(5);

    // Environments for dropdown
    environments: string[] = ['development', 'staging', 'production'];

    constructor() { }

    ngOnInit(): void {
        // Boilerplate for initial data fetch
        this.fetchFeatureFlags();
    }

    fetchFeatureFlags(): void {
        // Mock data for now, will call service later
        // This is where you would call your service: this.featureFlagService.getFlags().subscribe(...)
        const mockData: FeatureFlag[] = [
            { id: 'ff-001', name: 'new-dashboard-ui', environment: 'development', createdDate: '2026-01-05T10:15:00Z', status: true },
            { id: 'ff-002', name: 'beta-payment-gateway', environment: 'staging', createdDate: '2026-01-10T14:30:00Z', status: false },
            { id: 'ff-003', name: 'ai-recommendations', environment: 'production', createdDate: '2026-01-15T09:00:00Z', status: true },
            { id: 'ff-004', name: 'dark-mode', environment: 'production', createdDate: '2026-01-18T16:45:00Z', status: false },
            { id: 'ff-013', name: 'image-optimization', environment: 'production', createdDate: '2026-02-09T08:30:00Z', status: true },
            { id: 'ff-020', name: 'custom-themes', environment: 'development', createdDate: '2026-02-17T10:30:00Z', status: true }
        ];
        this.allFeatureFlags.set(mockData);
    }

    // Computed signals for filtering and pagination
    filteredFlags = computed(() => {
        let flags = this.allFeatureFlags();

        // Search filter
        if (this.searchTerm()) {
            const term = this.searchTerm().toLowerCase();
            flags = flags.filter(f =>
                f.name.toLowerCase().includes(term) ||
                f.id.toLowerCase().includes(term)
            );
        }

        // Environment filter
        if (this.selectedEnvironment() !== 'all') {
            flags = flags.filter(f => f.environment === this.selectedEnvironment());
        }

        // Status filter
        if (this.selectedStatus() !== 'all') {
            const isEnabled = this.selectedStatus() === 'enabled';
            flags = flags.filter(f => f.status === isEnabled);
        }

        return flags;
    });

    paginatedFlags = computed(() => {
        const startIndex = (this.pageNumber() - 1) * this.pageSize();
        return this.filteredFlags().slice(startIndex, startIndex + this.pageSize());
    });

    totalItems = computed(() => this.filteredFlags().length);
    totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

    // Event handlers
    onSearchChange(): void {
        this.pageNumber.set(1);
    }

    onEnvironmentChange(env: string): void {
        this.selectedEnvironment.set(env);
        this.pageNumber.set(1);
    }

    onStatusChange(status: string): void {
        this.selectedStatus.set(status);
        this.pageNumber.set(1);
    }

    onPageChange(page: number): void {
        if (page < 1 || page > this.totalPages()) return;
        this.pageNumber.set(page);
    }

    toggleStatus(flag: FeatureFlag): void {
        this.allFeatureFlags.update(flags =>
            flags.map(f => f.id === flag.id ? { ...f, status: !f.status } : f)
        );
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
