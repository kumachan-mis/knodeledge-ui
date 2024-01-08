import { JSON_POST } from '@/utils/route';

export async function POST(request: Request): Promise<Response> {
  return JSON_POST('/api/hello-world', request);
}
