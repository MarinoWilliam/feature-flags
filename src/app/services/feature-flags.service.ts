import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { FeatureFlagsStatsDto, PagedResultDto } from '../models/feature-flag.dto';
import { FeatureFlag } from '../models/feature-flag.model';
import mockData from '../../assets/mock-feature-flags.json';

@Injectable({
    providedIn: 'root'
})
export class FeatureFlagsService {
    private featureFlags: FeatureFlag[] = mockData.featureFlags as FeatureFlag[];
    private apiDelay = 300;

    getFeatureFlagsStats(): Observable<FeatureFlagsStatsDto> {
        try {
            const total = this.featureFlags.length;
            const enabled = this.featureFlags.filter(f => f.status).length;
            const disabled = total - enabled;
            const development = this.featureFlags.filter(f => f.environment === 'development').length;
            const staging = this.featureFlags.filter(f => f.environment === 'staging').length;
            const production = this.featureFlags.filter(f => f.environment === 'production').length;

            return of({ total, enabled, disabled, development, staging, production }).pipe(
                delay(this.apiDelay),
                catchError(error => throwError(() => new Error('Failed to fetch stats')))
            );
        } catch (error) {
            return throwError(() => new Error('Failed to fetch stats'));
        }
    }

    getFeatureFlags(
        environment?: string,
        status?: boolean,
        name?: string,
        page: number = 1,
        pageSize: number = 10
    ): Observable<PagedResultDto<FeatureFlag>> {
        try {
            let filtered = [...this.featureFlags];

            if (environment) {
                filtered = filtered.filter(f => f.environment === environment);
            }
            if (status !== undefined) {
                filtered = filtered.filter(f => f.status === status);
            }
            if (name) {
                filtered = filtered.filter(f => f.name.toLowerCase().includes(name.toLowerCase()));
            }

            const start = (page - 1) * pageSize;
            const Items = filtered.slice(start, start + pageSize);

            return of({ Items, TotalCount: filtered.length }).pipe(
                delay(this.apiDelay),
                catchError(error => throwError(() => new Error('Failed to fetch feature flags')))
            );
        } catch (error) {
            return throwError(() => new Error('Failed to fetch feature flags'));
        }
    }

    toggleFeatureFlagStatus(id: string): Observable<FeatureFlag> {
        try {
            const flag = this.featureFlags.find(f => f.id === id);
            if (!flag) {
                return throwError(() => new Error(`Feature flag with id ${id} not found`));
            }

            flag.status = !flag.status;

            return of(flag).pipe(
                delay(this.apiDelay),
                catchError(error => throwError(() => new Error('Failed to toggle feature flag')))
            );
        } catch (error) {
            return throwError(() => new Error('Failed to toggle feature flag'));
        }
    }
}
