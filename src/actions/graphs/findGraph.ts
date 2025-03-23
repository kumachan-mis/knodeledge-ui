import { Errorable, defaultOnResposeError } from '@/apis/action/api';
import { fetchCsrFromOpenApi } from '@/apis/action/csr';
import { GraphFindErrorResponse, GraphFindErrorResponseFromJSON, GraphFindRequest, GraphFindResponse } from '@/openapi';

import { graphsApi } from './api';

export async function findGraph(
  request: GraphFindRequest,
): Promise<Errorable<GraphFindResponse, GraphFindErrorResponse>> {
  return await fetchCsrFromOpenApi(
    async (initOverrides) => await graphsApi.graphsFind(request, initOverrides),
    async (error) => {
      if (error.response.status === 404) {
        const errorResponse = GraphFindErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
