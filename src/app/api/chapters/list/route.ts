import { createJsonRoute, jsonSsrHeaders } from '@/apis/route/json';

export const POST = createJsonRoute('/api/chapters/list', 'POST', jsonSsrHeaders);
