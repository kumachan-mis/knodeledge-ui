import { Errorable, defaultOnResposeError } from '@/apis/action/api';
import { fetchCsrFromOpenApi } from '@/apis/action/csr';
import {
  GraphSectionalizeRequest,
  GraphSectionalizeResponse,
  GraphSectionalizeErrorResponse,
  GraphSectionalizeErrorResponseFromJSON,
} from '@/openapi';

import { graphsApi } from './api';

export async function sectionalizeIntoGraphs(
  request: GraphSectionalizeRequest,
): Promise<Errorable<GraphSectionalizeResponse, GraphSectionalizeErrorResponse>> {
  return await fetchCsrFromOpenApi(
    async (initOverrides) => await graphsApi.graphsSectionalize({ graphSectionalizeRequest: request }, initOverrides),
    async (error) => {
      if (400 <= error.response.status && error.response.status < 500) {
        const errorResponse = GraphSectionalizeErrorResponseFromJSON(await error.response.json());
        return { state: 'error', response: null, error: errorResponse };
      }
      return await defaultOnResposeError(error);
    },
  );
}
