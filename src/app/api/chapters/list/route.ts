import { createJsonRoute, jsonSsrHeaders } from '@/apis/route/json';

export const GET = createJsonRoute('/api/chapters/list', 'GET', jsonSsrHeaders);
