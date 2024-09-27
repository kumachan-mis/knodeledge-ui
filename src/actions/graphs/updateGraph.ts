import { Errorable, fetchFromOpenApi, defaultOnResposeError } from '../openapi';
import {
  GraphUpdateErrorResponse,
  GraphUpdateErrorResponseFromJSON,
  GraphUpdateRequest,
  GraphUpdateResponse,
} from '@/openapi';

import { graphsApi } from './api';

export async function updateGraph(
  request: GraphUpdateRequest,
): Promise<Errorable<GraphUpdateResponse, GraphUpdateErrorResponse>> {
  return await fetchFromOpenApi<GraphUpdateResponse, GraphUpdateErrorResponse>(
    async () => await graphsApi.graphsUpdate({ graphUpdateRequest: request }),
    async (error) => {
      if (400 <= error.response.status && error.response.status < 500) {
        const errorResponse = GraphUpdateErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
