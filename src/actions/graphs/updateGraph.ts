import { fetchCsrFromOpenApi } from '@/apis/action/csr';
import { Errorable, defaultOnResposeError } from '@/apis/action/fetch';
import {
  GraphUpdateErrorResponse,
  GraphUpdateErrorResponseFromJSON,
  GraphUpdateRequest,
  GraphUpdateResponse,
} from '@/openapi';

import { csrGraphsApi } from './api';

export async function updateGraph(
  request: GraphUpdateRequest,
): Promise<Errorable<GraphUpdateResponse, GraphUpdateErrorResponse>> {
  return await fetchCsrFromOpenApi<GraphUpdateResponse, GraphUpdateErrorResponse>(
    async (initOverrides) => await csrGraphsApi.graphsUpdate({ graphUpdateRequest: request }, initOverrides),
    async (error) => {
      if (400 <= error.response.status && error.response.status < 500) {
        const errorResponse = GraphUpdateErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
