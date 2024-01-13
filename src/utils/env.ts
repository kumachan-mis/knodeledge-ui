export const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT ?? 'development';
export const ENV_GCP = ['staging', 'production'].includes(ENVIRONMENT);
