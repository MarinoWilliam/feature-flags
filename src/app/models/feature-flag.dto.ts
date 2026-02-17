export interface FeatureFlagsStatsDto {
    total: number;
    enabled: number;
    disabled: number;
    development: number;
    staging: number;
    production: number;
}

export interface PagedResultDto<T> {
    Items: T[];
    TotalCount: number;
}
