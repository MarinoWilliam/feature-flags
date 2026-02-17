import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { FeatureFlagsStatsDto, PagedResultDto } from '../models/feature-flag.dto';
import { FeatureFlag } from '../models/feature-flag.model';

@Injectable({
    providedIn: 'root'
})
export class FeatureFlagsService {
    private apiUrl = 'http://localhost:3000/feature-flags';

    constructor(private http: HttpClient) { }

    getFeatureFlagsStats(): Observable<FeatureFlagsStatsDto> {
        return this.http.get<FeatureFlag[]>(this.apiUrl).pipe(
            map(featureFlags => {
                const total = featureFlags.length;
                const enabled = featureFlags.filter(f => f.status).length;
                const disabled = total - enabled;
                const development = featureFlags.filter(f => f.environment === 'development').length;
                const staging = featureFlags.filter(f => f.environment === 'staging').length;
                const production = featureFlags.filter(f => f.environment === 'production').length;

                return { total, enabled, disabled, development, staging, production };
            }),
            catchError(error => throwError(() => new Error('Failed to fetch stats')))
        );
    }

    getFeatureFlags(
        environment?: string,
        status?: boolean,
        name?: string,
        page: number = 1,
        pageSize: number = 10
    ): Observable<PagedResultDto<FeatureFlag>> {

        let params = new HttpParams()
            .set('_page', page)
            .set('_limit', pageSize);

        if (environment) {
            params = params.set('environment', environment);
        }

        if (status !== undefined) {
            params = params.set('status', status);
        }

        if (name) {
            params = params.set('name_like', name);
        }

        return this.http.get<FeatureFlag[]>(this.apiUrl, {
            params,
            observe: 'response'
        }).pipe(
            map(response => {

                const totalCount =
                    Number(response.headers.get('X-Total-Count')) ?? 0;

                return {
                    Items: response.body ?? [],
                    TotalCount: totalCount
                };
            }),
            catchError(() =>
                throwError(() => new Error('Failed to fetch feature flags'))
            )
        );
    }


    toggleFeatureFlagStatus(id: string): Observable<FeatureFlag> {
        return this.http.get<FeatureFlag>(`${this.apiUrl}/${id}`).pipe(
            catchError(error => throwError(() => new Error(`Feature flag with id ${id} not found`))),
            switchMap(flag => {
                const updatedFlag = { ...flag, status: !flag.status };
                return this.http.patch<FeatureFlag>(`${this.apiUrl}/${id}`, { status: updatedFlag.status });
            }),
            catchError(error => throwError(() => new Error('Failed to toggle feature flag')))
        );
    }
}
