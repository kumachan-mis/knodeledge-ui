import { JSON_ROUTE } from '@/routes/common';

export async function POST(request: Request): Promise<Response> {
  return JSON_ROUTE('/api/papers/update', 'POST', request);
}
