import { JSON_ROUTE } from '@/utils/route';

export async function POST(request: Request): Promise<Response> {
  return JSON_ROUTE('/api/hello-world', 'POST', request);
}
