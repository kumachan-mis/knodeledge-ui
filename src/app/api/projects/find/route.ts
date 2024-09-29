import { JSON_ROUTE } from '../../utils/json';

export async function POST(request: Request): Promise<Response> {
  return JSON_ROUTE('/api/projects/find', 'POST', request);
}
