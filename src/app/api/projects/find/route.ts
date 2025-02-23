import { createJsonRoute, jsonSsrHeaders } from '@/apis/route/json';

export const POST = createJsonRoute('/api/projects/find', 'POST', jsonSsrHeaders);
