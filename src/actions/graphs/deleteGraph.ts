import { Errorable, defaultOnResposeError } from '@/apis/action/api';
import { fetchCsrFromOpenApi } from '@/apis/action/csr';
import { GraphDeleteRequest, GraphDeleteErrorResponse, GraphDeleteErrorResponseFromJSON } from '@/openapi';

import { graphsApi } from './api';

export async function deleteGraph(request: GraphDeleteRequest): Promise<Errorable<object, GraphDeleteErrorResponse>> {
  return await fetchCsrFromOpenApi<object, GraphDeleteErrorResponse>(
    async (initOverrides) => {
      await graphsApi.graphsDelete({ graphDeleteRequest: request }, initOverrides);
      return {};
    },
    async (error) => {
      if (400 <= error.response.status && error.response.status < 500) {
        const errorResponse = GraphDeleteErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
