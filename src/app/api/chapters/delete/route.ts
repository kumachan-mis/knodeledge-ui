import { createJsonRoute, jsonCsrHeaders } from '@/apis/route/json';

export const POST = createJsonRoute('/api/chapters/delete', 'POST', jsonCsrHeaders);
