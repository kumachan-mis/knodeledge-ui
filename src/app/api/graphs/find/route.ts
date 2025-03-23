import { createJsonRoute, jsonCsrHeaders } from '@/apis/route/json';

export const GET = createJsonRoute('/api/graphs/find', 'GET', jsonCsrHeaders);
