import { Errorable, defaultOnResposeError, fetchFromOpenApi } from '@/actions/openapi';
import { GraphFindErrorResponse, GraphFindErrorResponseFromJSON, GraphFindRequest, GraphFindResponse } from '@/openapi';

import { graphsApi } from './api';

export async function findGraph(
  request: GraphFindRequest,
): Promise<Errorable<GraphFindResponse, GraphFindErrorResponse>> {
  return await fetchFromOpenApi(
    async () => await graphsApi.graphsFind({ graphFindRequest: request }),
    async (error) => {
      if (error.response.status === 404) {
        const errorResponse = GraphFindErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
