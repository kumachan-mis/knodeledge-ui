import { createJsonRoute, jsonSsrHeaders } from '@/apis/route/json';

export const POST = createJsonRoute('/api/projects/list', 'POST', jsonSsrHeaders);
