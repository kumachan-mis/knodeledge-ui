import { createJsonRoute, jsonCsrHeaders } from '@/apis/route/json';

export const POST = createJsonRoute('/api/graphs/update', 'POST', jsonCsrHeaders);
