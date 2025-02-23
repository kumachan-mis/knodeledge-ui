import { createJsonRoute, jsonCsrHeaders } from '@/apis/route/json';

export const POST = createJsonRoute('/api/papers/find', 'POST', jsonCsrHeaders);
