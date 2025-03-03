import { createJsonRoute, jsonCsrHeaders } from '@/apis/route/json';

export const POST = createJsonRoute('/api/projects/delete', 'POST', jsonCsrHeaders);
