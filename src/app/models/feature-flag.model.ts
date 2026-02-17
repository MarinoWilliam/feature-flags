export type Environment = 'development' | 'staging' | 'production';

export interface FeatureFlag {
    id: string;
    name: string;
    environment: Environment;
    createdDate: string;
    status: boolean;
}
