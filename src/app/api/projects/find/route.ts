import { createJsonRoute, jsonSsrHeaders } from '@/apis/route/json';

export const GET = createJsonRoute('/api/projects/find', 'GET', jsonSsrHeaders);
