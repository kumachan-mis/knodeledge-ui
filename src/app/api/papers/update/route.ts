import { createJsonRoute, jsonCsrHeaders } from '@/apis/route/json';

export const POST = createJsonRoute('/api/papers/update', 'POST', jsonCsrHeaders);
