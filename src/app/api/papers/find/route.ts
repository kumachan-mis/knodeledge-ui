import { createJsonRoute, jsonCsrHeaders } from '@/apis/route/json';

export const GET = createJsonRoute('/api/papers/find', 'GET', jsonCsrHeaders);
